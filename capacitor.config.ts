import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.technovahub.novora",
  appName: "Novora",
  webDir: "dist",
  backgroundColor: "#080711",
  server: {
    androidScheme: "https",
  },
};

export default config;
