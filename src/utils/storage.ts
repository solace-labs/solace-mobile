import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

export async function StorageSetItem(
  key: string,
  value: any,
  encrypted: boolean = true,
) {
  if (encrypted) {
    try {
      await EncryptedStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return error;
    }
  } else {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return error;
    }
  }
}

export async function StorageGetItem(key: string, encrypted: boolean = true) {
  if (encrypted) {
    try {
      const value = await EncryptedStorage.getItem(key);
      if (value !== undefined) {
        if (value) {
          return JSON.parse(value);
        } else {
          return '';
        }
      }
    } catch (error) {
      return error;
    }
  } else {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== undefined) {
        if (value) {
          return JSON.parse(value);
        } else {
          return '';
        }
      }
    } catch (error) {
      return error;
    }
  }
}

export async function StorageDeleteItem(
  key: string,
  encrypted: boolean = true,
) {
  if (encrypted) {
    try {
      await EncryptedStorage.removeItem(key);
      return true;
    } catch (error) {
      return error;
    }
  } else {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      return error;
    }
  }
}

export async function StorageClearAll() {
  try {
    await EncryptedStorage.clear();
    await AsyncStorage.clear();
  } catch (error) {
    return error;
  }
}
