module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      "react-native-worklets-core/plugin",
      ["react-native-reanimated/plugin", { processNestedWorklets: true }],
    ],
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
