module.exports = {
    env: {
      VERCEL_URL: process.env.VERCEL_URL,
    },
    webpack: (config, {isServer, webpack}) => {
      !isServer && config.plugins.push( new webpack.NormalModuleReplacementPlugin(
        /\.\/serverLink/,
        './clientLink.ts'
      ))
  
      return config
    },
  }
  