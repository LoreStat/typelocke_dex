import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.typelockedex.app',
  appName: 'TypelockeDex',
  webDir: 'build-mobile',
  server: {
    androidScheme: 'https'
  }
};

export default config;
