module.exports = {
    pages: {
      'index': {
        // entry for the page
        entry: './src/pages/Home/main.js',
        // the source template
        template: 'public/index.html',
        // when using title option,
        // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
        title: 'Posi-Chess',
        // chunks to include on this page, by default includes
        // extracted common chunks and vendor chunks.
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      },
      signup: 'src/pages/SignUp/main.js',
      posmaker: 'src/pages/PosMaker/main.js',
      creategame: 'src/pages/CreateGame/main.js',
      battleboard: 'src/pages/BattleBoard/main.js'
    }
  }