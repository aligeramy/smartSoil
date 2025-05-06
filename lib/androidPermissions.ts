import type { Permission, Rationale } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Utility to check if app is running on Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Permissions that the app might need
 */
export const AppPermissions = {
  INTERNET: 'android.permission.INTERNET' as Permission,
  WIFI_STATE: 'android.permission.ACCESS_WIFI_STATE' as Permission,
  NETWORK_STATE: 'android.permission.ACCESS_NETWORK_STATE' as Permission,
};

/**
 * Check if a specific permission is granted
 * @param permission The permission to check
 * @returns Promise resolving to boolean indicating if permission is granted
 */
export const checkPermission = async (permission: Permission): Promise<boolean> => {
  if (!isAndroid) return true;
  
  try {
    const result = await PermissionsAndroid.check(permission);
    return result;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Request a specific permission
 * @param permission The permission to request
 * @param rationale Optional explanation to show the user
 * @returns Promise resolving to boolean indicating if permission was granted
 */
export const requestPermission = async (
  permission: Permission,
  rationale?: Rationale
): Promise<boolean> => {
  if (!isAndroid) return true;
  
  try {
    const granted = await PermissionsAndroid.request(
      permission,
      rationale
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

/**
 * Request multiple permissions at once
 * @param permissions Array of permissions to request
 * @returns Promise resolving to an object with permission results
 */
export const requestMultiplePermissions = async (
  permissions: Permission[]
): Promise<Record<Permission, boolean>> => {
  if (!isAndroid) {
    return permissions.reduce<Record<Permission, boolean>>((acc, permission) => {
      acc[permission] = true;
      return acc;
    }, {} as Record<Permission, boolean>);
  }
  
  try {
    const results = await PermissionsAndroid.requestMultiple(permissions);
    
    // Convert results to a simple permission -> boolean mapping
    return permissions.reduce<Record<Permission, boolean>>((acc, permission) => {
      acc[permission] = results[permission] === PermissionsAndroid.RESULTS.GRANTED;
      return acc;
    }, {} as Record<Permission, boolean>);
  } catch (error) {
    console.error('Error requesting multiple permissions:', error);
    return permissions.reduce<Record<Permission, boolean>>((acc, permission) => {
      acc[permission] = false;
      return acc;
    }, {} as Record<Permission, boolean>);
  }
}; 