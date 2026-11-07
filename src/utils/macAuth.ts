// Client-side admin helpers for Yahia Naim's admin panel.
//
// SECURITY NOTE: The real checks happen on the server (see src/lib/adminAuth.ts
// and /api/admin/*). The values below are only UI hints (e.g. whether to show
// admin-only buttons) and never grant access by themselves.

const ADMIN_HINT_KEY = 'fiker_admin_authenticated';

export interface AdminStatus {
  deviceAuthorized: boolean;
  authenticated: boolean;
}

/** Asks the server whether this browser is an authorized device / logged-in admin. */
export async function fetchAdminStatus(): Promise<AdminStatus> {
  try {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const macKey = new URLSearchParams(search).get('mac_key');
    const url = macKey ? `/api/admin/session?mac_key=${encodeURIComponent(macKey)}` : '/api/admin/session';
    const res = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
    if (!res.ok) return { deviceAuthorized: false, authenticated: false };
    const data = (await res.json()) as AdminStatus;
    setAdminHint(data.authenticated);
    return data;
  } catch {
    return { deviceAuthorized: false, authenticated: false };
  }
}

export async function loginAdmin(passcode: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ passcode }),
    });
    setAdminHint(res.ok);
    return res.ok;
  } catch {
    return false;
  }
}

export async function logoutAdmin(): Promise<void> {
  setAdminHint(false);
  try {
    await fetch('/api/admin/login', { method: 'DELETE', credentials: 'same-origin' });
  } catch {
    // ignore
  }
}

function setAdminHint(value: boolean) {
  if (typeof window === 'undefined') return;
  try {
    if (value) localStorage.setItem(ADMIN_HINT_KEY, 'true');
    else localStorage.removeItem(ADMIN_HINT_KEY);
  } catch {
    // ignore
  }
}

/** UI hint only: true if this browser previously logged in successfully. */
export function isAdminUser(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(ADMIN_HINT_KEY) === 'true';
  } catch {
    return false;
  }
}
