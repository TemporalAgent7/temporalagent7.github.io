const ghPages = process.env.DEPLOY_TARGET === 'gh-pages';

module.exports = {
  assetPrefix: ghPages ? '/temporalagent7.github.io/' : '', // customize this value if deployed to different URL
  future: {
    webpack5: true
  }
};