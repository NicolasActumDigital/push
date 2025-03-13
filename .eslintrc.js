// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    ignorePatterns: ["/dist/*"],
    extends: ["expo", "prettier", "plugin:react/recommended"],
    plugins: ["prettier"],
    rules: {
      "prettier/prettier": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    },
  };
  