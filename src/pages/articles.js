import React from 'react'
import { graphql } from 'gatsby'
import { css } from '@emotion/core'
import Container from 'components/Container'
import SEO from '../components/SEO'
import Layout from '../components/Layout'
import Post from '../components/Post'

/*

TODOS
- clean up code
- clean up state

*/

/**
 * @param currentFilterTags {string[]} the current filter tags in state
 * @param tag {string} the tag to add or remove
 */
function getNewTags(currentFilterTags, tag) {
  // Check if currentFilter tags has it
  if (currentFilterTags.includes(tag)) {
    // If it does, we remove it and return the array without it
    return currentFilterTags.filter(t => t !== tag)
  }

  // If it doesn't, we add it
  return [...currentFilterTags, tag]
}

const Articles = ({ data: { site, allMdx } }) => {
  const allPosts = allMdx.edges
  const [filterTags, setFilterTags] = React.useState([])

  const [filteredData, setFilteredData] = React.useState([])

  const emptyQuery = ''

  const [state, setState] = React.useState({
    query: emptyQuery,
  })

  const { query } = state

  // Runs when a user toggles a filter tag on the page
  // React.useEffect(() => {
  // If there are no filter tags
  // filter out posts who have the filteredTags
  // const filteredDataWithTags = filteredData.filter(({ node: post }) => {
  //   const postTags = post.fields.tags
  // compare these to the filteredTags
  // example: ['Book', 'Go']
  // if the filteredTags are ['Go']
  // we want to loop through the postTags and make it contains every tag in filteredTags
  // close but not there
  //     return filterTags.every(tag => postTags.includes(tag))
  //   })
  //   console.log(filteredDataWithTags, 'hello')
  //   setFilteredData(filteredDataWithTags)

  // }, [filterTags, filteredData])

  // This is called when a user types inside the input field
  const handleInputChange = event => {
    const query = event.target.value

    const posts = filteredData.length ? filteredData : allPosts

    const updatedData = posts.filter(({ node: post }) => {
      const title = post.frontmatter.title || ''
      const excerpt = post.excerpt || ''
      return (
        excerpt.toLowerCase().includes(query.toLowerCase()) ||
        title.toLowerCase().includes(query.toLowerCase())
      )
    })

    setState({
      query,
    })

    setFilteredData(updatedData)
  }

  const handleTagChange = newTags => {
    // if there is a tag change...
    // then we want to do it on the filteredData (if it's not empty)
    const posts = filteredData.length ? filteredData : allPosts

    // this might be it
    const filteredDataWithTags = posts.filter(({ node: post }) => {
      const postTags = post.fields.tags
      return newTags.every(tag => postTags.includes(tag))
    })

    setFilteredData(filteredDataWithTags)
  }

  /*
  Notes
  What i want to do is add buttons that let you filter posts by tags
  1. Make sure tags are available on post data check
  2. write out logic

  If a user clicks on a fiter button, it should filter the results and only show posts with that tag
    and it should filter if they search in the input.

  3. add simple buttons and test
  4. add css to buttons

  */

  // console.log('these are the posts', posts)
  console.log(`these are the filter tags`, filterTags)
  const hasSearchResults = filteredData && query !== emptyQuery
  const hasTags = filteredData && filterTags.length !== 0
  const posts = hasSearchResults || hasTags ? filteredData : allPosts

  return (
    <Layout site={site}>
      <SEO />
      <Container noVerticalPadding>
        <div
          css={css`
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            width: 100%;
          `}
        >
          <div>
            <button
              onClick={() => {
                const newTags = getNewTags(filterTags, 'Rust')
                setFilterTags(newTags)
                handleTagChange(newTags)
              }}
            >
              Rust
            </button>
            <button
              onClick={() => {
                const newTags = getNewTags(filterTags, 'JavaScript')
                setFilterTags(newTags)
                handleTagChange(newTags)
              }}
            >
              JavaScript
            </button>
          </div>
          <input
            aria-label="article search"
            type="text"
            id="filter"
            placeholder="Type to filter articles..."
            onChange={handleInputChange}
            css={css`
              margin-top: 0;
              width: 90%;
            `}
          />
          <span
            css={css`
              font-weight: bold;
              text-align: center;
              width: 10%;
            `}
          >
            {posts.length}
          </span>
        </div>
        {posts.map(({ node: post }) => (
          <Post key={post.id} post={post} />
        ))}
        <hr
          css={css`
            margin: 50px 0;
          `}
        />
      </Container>
    </Layout>
  )
}

export default Articles

export const pageQuery = graphql`
  query {
    site {
      ...site
    }
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        fields: { isPost: { eq: true } }
        frontmatter: { published: { ne: false } }
      }
    ) {
      edges {
        node {
          excerpt(pruneLength: 300)
          id
          fields {
            title
            slug
            date
            tags
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            slug
            keywords
          }
        }
      }
    }
  }
`
