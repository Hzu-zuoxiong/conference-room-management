const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  baseUrl: './',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('cmpt', resolve('src/components'))
      .set('comm', resolve('src/components/common'))
      .set('mixins', resolve('src/mixins'))
      .set('images', resolve('src/assets/images'));
    const oneOfsMap = config.module.rule('scss').oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Provide path to the file with resources
          resources: path.resolve('src/assets/css/variables.scss')
        })
        .end();
    });
  }
};
