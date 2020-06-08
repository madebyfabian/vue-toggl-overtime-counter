module.exports = {
  productionSourceMap: false,
  
  chainWebpack: config => {
    // Disabling webpack translating small images into base64 strings
    const imagesRule = config.module.rule('images');
    imagesRule.uses.clear()
    imagesRule
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .tap(options => {
        return {
          ...options,
          limit: -1 // no limit
        };
      })
      .end();
  }
};