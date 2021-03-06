const path = require('path')

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions

    // quem executa a query aqui é o Graphql (usa parenteses)
    const posts = await graphql(`
        query {
            posts: allMarkdownRemark {
                edges {
                    node {
                        frontmatter {
                            description
                            path
                            title
                        }
                    }
                }
            }
        }
    `)

    const template = path.resolve('src/templates/post.js')
    posts.data.posts.edges.forEach(post => {
        // console.log(post.node.frontmatter.title)
        createPage({
            path: post.node.frontmatter.path,
            component: template,
            context: {
                id: post.node.frontmatter.path
            }
        })
    })

    const templateBlog = path.resolve('src/templates/blog.js')
    const pageSize = 2
    const totalPosts = posts.data.posts.edges.length
    // Math.ceil => arredonda para cima
    const numPages = Math.ceil(totalPosts / pageSize)
    //console.log(Array.from(Array.from({ length: numPages})))
    Array.from({length: numPages}).forEach((_, i) => {
        //console.log('gen', i)
        //console.log(i === 0 ? '' : '/' + i)
        createPage({
            path: '/blog' + (i === 0 ? '' : '/' + i),
            component: templateBlog,
            context: {
                limit: pageSize,
                skip: i * pageSize,
                numPages,
                currentPage: i
            }
        })
    })

}