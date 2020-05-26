const path = require('path');
const _ = require('lodash');
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