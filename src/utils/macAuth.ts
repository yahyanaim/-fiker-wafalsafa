// Mac Device Authorization Utility for Yahia Naim (Admin Panel Protection)

export const MAC_AUTH_KEY = 'fiker_authorized_mac_device';
export const MAC_AUTH_SECRET_TOKEN = 'authorized_mac_yahia_2026';
export const MAC_UNLOCK_PARAM = 'mac_key';

/**
 * Checks whether the current visitor is on Yahia's Mac or authorized device.
 * Returns true if:
 * 1. Running on localhost / 127.0.0.1 (directly on user's Mac dev machine).
 * 2. Or the Mac device secret token exists in localStorage.
 * 3. Or URL contains the secret unlock key (?mac_key=yahia_mac_2026).
 */
export function isUserMacAuthorized(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Localhost check: running directly on Mac
  const hostname = window.location.hostname;
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local')
  ) {
    // Automatically persist authorization for this browser on his Mac
    try {
      localStorage.setItem(MAC_AUTH_KEY, MAC_AUTH_SECRET_TOKEN);
    } catch {
      // ignore
    }
    return true;
  }

  // 2. Secret URL parameter unlock on Mac browser
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get(MAC_UNLOCK_PARAM);
    if (
      key === 'yahia_mac_2026' ||
      key === 'yahia_mac_secure_2026' ||
      key === 'mac_yahia'
    ) {
      localStorage.setItem(MAC_AUTH_KEY, MAC_AUTH_SECRET_TOKEN);
      return true;
    }
  } catch {
    // ignore
  }

  // 3. Stored authorization token in localStorage
  try {
    const saved = localStorage.getItem(MAC_AUTH_KEY);
    if (
      saved === MAC_AUTH_SECRET_TOKEN ||
      saved === 'authorized_mac_yahia' ||
      saved === 'true'
    ) {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

/**
 * Manually authorizes the current device/browser.
 */
export function authorizeCurrentMac(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(MAC_AUTH_KEY, MAC_AUTH_SECRET_TOKEN);
    } catch {
      // ignore
    }
  }
}

/**
 * Revokes authorization on this device.
 */
export function revokeMacAuthorization(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(MAC_AUTH_KEY);
      localStorage.removeItem('fiker_admin_authenticated');
    } catch {
      // ignore
    }
  }
}
