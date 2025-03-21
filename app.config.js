const variant = process.env.APP_VARIANT || "development";

const config = {
  development: {
    name: "Push (Dev)",
    id: "com.actumdigital.pushdev",
  },
  staging: {
    name: "Push (Stage)",
    id: "com.actumdigital.pushdev",
  },
  release: {
    name: "Push",
    id: "com.actumdigital.pushdev",
  },
};

const firebaseConfigPath = {
  development: {
    ios: "./config/dev/GoogleService-Info.plist",
    android: "./config/dev/google-services.json",
  },
  staging: {
    ios: "./config/staging/GoogleService-Info.plist", 
    android: "./config/staging/google-services.json",
  },
  release: {
    ios: "./config/release/GoogleService-Info.plist", 
    android: "./config/release/google-services.json",
  },
};

module.exports = {
  name: config[variant].name,
  slug: "Push",
  scheme: "pushdev",
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
      // Add this line to ensure push notifications work
      "aps-environment": "development"
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
    // Configure Firebase plugins with needed options
    ["@react-native-firebase/app", {
      // No custom configuration needed
    }],
    "@react-native-firebase/crashlytics",
    ["@react-native-firebase/messaging", {
      ios: {
        // Explicitly enable background mode
        backgroundMode: true
      }
    }]
  ],
  experiments: {
    typedRoutes: true,
  },
  // Add this to ensure the app has access to the config files
  extra: {
    firebaseConfigPath: firebaseConfigPath[variant]
  }
};