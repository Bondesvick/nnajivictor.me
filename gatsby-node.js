const path = require('path');
const _ = require('lodash');


exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const postTemplate = path.resolve(`src/templates/post.js`);
  const tagTemplate = path.resolve('src/templates/tag.js');
  const blogsTemplate = path.resolve('src/templates/blog.js');

  const result = await graphql(`
    {
      postsRemark: allContentfulBlogPosts(sort: {order: DESC, fields: date}) {
        edges {
          node {
            slug
            title
            description
          }
        }
      }
      tagsGroup: allContentfulBlogPosts {
        group(field: tags) {
          fieldValue
        }
      }
      
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

    // Create post detail pages
    const posts = result.data.postsRemark.edges;
    posts.forEach(({ node }, index) => {
      createPage({
        path: `blog/${node.slug}`,
        component: postTemplate,
        context: {
          slug: node.slug,
          prev: index === 0 ? null : posts[index - 1].node,
          next: index === (posts.length - 1) ? null : posts[index + 1].node,
        },
      });
    });

     // Extract tag data from query
  const tags = result.data.tagsGroup.group;
  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/blog/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    });
  });

  //amount of posts
  // const allPosts = posts;
  //posts per page 
  const postsPerPage = 6
  //how many pages
  const numPages = Math.ceil(posts.length/postsPerPage);

  Array.from({length: numPages}).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog`: `/blog/${i+1}`,
      component: blogsTemplate,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
        length: posts.length,
      },
    })
  })
}
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    // https://www.gatsbyjs.org/docs/debugging-html-builds/#fixing-third-party-modules
    if (stage === 'build-html') {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /scrollreveal/,
              use: loaders.null(),
            },
            {
              test: /animejs/,
              use: loaders.null(),
            },
          ],
        },
      });
    }
  
//     actions.setWebpackConfig({
//       resolve: {
//         alias: {
//           '@components': path.resolve(__dirname, 'src/components'),
//           '@config': path.resolve(__dirname, 'src/config'),
//           '@fonts': path.resolve(__dirname, 'src/fonts'),
//           '@images': path.resolve(__dirname, 'src/images'),
//           '@pages': path.resolve(__dirname, 'src/pages'),
//           '@styles': path.resolve(__dirname, 'src/styles'),
//           '@utils': path.resolve(__dirname, 'src/utils'),
//         },
//       },
//     });
//   };
}