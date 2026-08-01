import * as SecureStore from "expo-secure-store";

/**
 * Lets a user save their license/vehicle details on-device so a
 * future renewal doesn't need to be filled from scratch. This is
 * plain on-device storage, not a backend account — it means "this
 * phone remembers", not "this user's data is backed up". If you
 * later add real accounts, mirror this to your backend so it
 * survives a reinstall/new device instead of being device-local.
 */
const KEYS = {
  license: "plate-renew:saved-license-profile",
  vehicle: "plate-renew:saved-vehicle-profile",
};

export async function getSavedProfile(kind) {
  try {
    const raw = await SecureStore.getItemAsync(KEYS[kind]);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveProfile(kind, data) {
  try {
    await SecureStore.setItemAsync(KEYS[kind], JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export async function clearSavedProfile(kind) {
  try {
    await SecureStore.deleteItemAsync(KEYS[kind]);
  } catch {
    // ignore — nothing to clear
  }
}
