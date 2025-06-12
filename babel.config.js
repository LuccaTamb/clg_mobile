module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-web",
      ["module:react-native-dotenv"],
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      [
        "module-resolver",
        {
          alias: {
            "^react-native$": "react-native-web",
            "@react-navigation/elements": "@react-navigation/elements/src",
          },
        },
      ],
    ],
  };
};