const variant = process.env.APP_VARIANT || "development";

const config = {
  development: {
    name: "Push (Dev)",
    id: "com.nicolasactumdigital.push.dev",
  },
  staging: {
    name: "Push (Stage)",
    id: "com.nicolasactumdigital.push.stage",
  },
  release: {
    name: "Push",
    id: "com.nicolasactumdigital.push",
  },
};

const firebaseConfigPath = {
  development: {
    ios: "./config/dev/GoogleService-Info.plist",
    android: "./config/dev/google-services.json",
  },
  staging: {
    ios: "./config/dev/GoogleService-Info.plist", 
    android: "./config/dev/google-services.json",
  },
  release: {
    ios: "./config/dev/GoogleService-Info.plist", 
    android: "./config/dev/google-services.json",
  },
};

module.exports = {
  name: config[variant].name,
  slug: "Push",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    requireFullScreen: true,
    bundleIdentifier: config[variant].id,
    googleServicesFile: firebaseConfigPath[variant].ios,
    infoPlist: {
      NSCameraUsageDescription: "$(PRODUCT_NAME) needs access to your Camera.",
      UIBackgroundModes: ['remote-notification'],
    },
    buildNumber: "1",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: config[variant].id,
    googleServicesFile: firebaseConfigPath[variant].android,
    permissions: ["android.permission.CAMERA"],
    versionCode: "1",
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-build-properties",
      {
        android: {
          minSdkVersion: 26,
          enableProguardInReleaseBuilds: true,
        },
        ios: {
          useFrameworks: "static"
        }
      }
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/crashlytics"
  ],
  experiments: {
    typedRoutes: true,
  },
};