const CracoLessPlugin = require("craco-less");
const defaultTheme = require("./src/themes/default.json");

module.exports = {
  plugins: [{
    plugin: CracoLessPlugin,
    options: {
      lessLoaderOptions: {
        lessOptions: {
          modifyVars: {
            '@primary-color': defaultTheme.primaryColor,
            '@font-family': '"Sen", sans-serif'
          },
          javascriptEnabled: true
        }
      }
    }
  }],
};
