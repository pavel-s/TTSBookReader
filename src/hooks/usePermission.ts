import { useState, useEffect, useCallback } from 'react';
import { Permission, PermissionsAndroid, Rationale } from 'react-native';

type PermissionStatus = 'granted' | 'undetermined' | 'denied';
type CheckCallback = () => Promise<void>;

/**
 * Check given permission status and then request (if permission is not granted and rationale provided).
 * Return array with permission status and checkPermission callback.
 */
const usePermission = (
  permission: Permission,
  rationale?: Rationale
): [PermissionStatus, CheckCallback] => {
  const [status, setStatus] = useState<PermissionStatus>('undetermined');

  const checkPermission = useCallback<CheckCallback>(async () => {
    try {
      const current = await PermissionsAndroid.check(permission);

      if (!current) {
        if (rationale) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            rationale
          );
          setStatus(
            granted === PermissionsAndroid.RESULTS.GRANTED
              ? 'granted'
              : 'denied'
          );
        } else setStatus('denied');
      } else setStatus('granted');
    } catch (error) {}
  }, [permission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return [status, checkPermission];
};

export default usePermission;
