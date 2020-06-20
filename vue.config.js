module.exports = {
  productionSourceMap: false,

  // Disabling webpack translating small images into base64 strings
  // chainWebpack: config => {,
  //   const imagesRule = config.module.rule('images');
  //   imagesRule.uses.clear()
  //   imagesRule
  //     .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
  //     .use('file-loader')
  //     .loader('file-loader')
  //     .tap(options => {
  //       return {
  //         ...options,
  //         limit: -1 // no limit
  //       };
  //     })
  //     .end();
  // }
};