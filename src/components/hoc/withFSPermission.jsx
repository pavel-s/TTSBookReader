import React from 'react';
import { PermissionsAndroid, ActivityIndicator } from 'react-native';
import { Banner } from 'react-native-paper';
import usePermission from '../../hooks/usePermission';
import * as IntentLauncher from 'expo-intent-launcher';
import manifest from '../../../app.json';

const withFSPermission = (Component) => (props) => {
  const [permissionStatus, checkPermission] = usePermission(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
      title: 'TTSBookReader Storage Permission',
      message:
        "TTSBookReader needs access to the device's storage to be able open books.",
      buttonPositive: 'OK',
    }
  );

  console.log(permissionStatus);
  if (permissionStatus === 'undetermined')
    return <ActivityIndicator style={{ flex: 1 }} />;
  if (permissionStatus === 'denied')
    return (
      <Banner
        visible={true}
        actions={[
          {
            label: 'Settings',
            onPress: async () => {
              await IntentLauncher.startActivityAsync(
                IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                { data: 'package:' + manifest.expo.android.package }
              );
              checkPermission();
            },
          },
          { label: 'Refresh', onPress: checkPermission },
        ]}
      >
        {
          "TTSBookReader needs access to the device's storage to be able open books. Open device settings and enable assess to storage for TTSBookReader."
        }
      </Banner>
    );

  return <Component {...props} />;
};

export default withFSPermission;
