const path = require("path");

module.exports = {
  // Basta escolher o modo aqui, ou via linha de comando (ver package.json) :)
  mode: "development",
  //mode: "production",
  devtool: "source-map",

  // Arquivo inicial do projeto.
  entry: "./src/index.tsx",

  resolve: {
    // Quais extensões de arquivo serão utilizadas pelo webpack.
    extensions: [".ts", ".tsx", ".js"]
  },

  // O webpack não foi originalmente projetado para trabalhar com
  // TypeScript, por isso precisamos utilizar um componente extra
  // para ensinar ao webpack como carregar esse tipo de arquivo.
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },

  output: {
    // Qual será o nome do nosso arquivo final, e onde ele deve ficar. Como *não*
    // pode ser um caminho relativo, é interessante utilizar o __dirname, que representa
    // o diretório atual para o Node.js (ambiente onde o webpack é executado).
    filename: "main.js",
    path: path.resolve(__dirname, "public/js")
  }
};
