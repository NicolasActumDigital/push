// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push("cjs");

// defaultConfig.resolver.resolverMainFields.unshift("sbmodern");

const config = withNativeWind(defaultConfig, { input: "./global.css" });
module.exports = config; 