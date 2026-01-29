import { atom, computed } from 'nanostores';
import type { Admin, Voter, UserType, AuthTokens } from '@/types';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '@/lib/constants';

// Token atoms
export const $accessToken = atom<string | null>(null);
export const $refreshToken = atom<string | null>(null);

// User atoms
export const $user = atom<Admin | Voter | null>(null);
export const $userType = atom<UserType | null>(null);

// Session token for OTP flow (temporary, not persisted)
export const $sessionToken = atom<string | null>(null);
export const $faceVerificationToken = atom<string | null>(null);

// Computed values
export const $isAuthenticated = computed(
  [$accessToken, $user],
  (token, user) => !!token && !!user
);

export const $isAdmin = computed(
  [$userType],
  (type) => type === 'admin'
);

export const $isVoter = computed(
  [$userType],
  (type) => type === 'voter'
);

// Actions
export function setTokens(tokens: AuthTokens) {
  $accessToken.set(tokens.accessToken);
  $refreshToken.set(tokens.refreshToken);

  // Persist to localStorage
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  } catch (e) {
    console.error('Failed to persist tokens:', e);
  }
}

export function setUser(user: Admin | Voter, type: UserType) {
  $user.set(user);
  $userType.set(type);

  // Persist to localStorage
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ user, type }));
  } catch (e) {
    console.error('Failed to persist user:', e);
  }
}

export function setSessionToken(token: string | null) {
  $sessionToken.set(token);
}

export function setFaceVerificationToken(token: string | null) {
  $faceVerificationToken.set(token);
}

export function logout() {
  // Clear all auth state
  $accessToken.set(null);
  $refreshToken.set(null);
  $user.set(null);
  $userType.set(null);
  $sessionToken.set(null);
  $faceVerificationToken.set(null);

  // Clear localStorage
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
}

export function initializeAuth() {
  try {
    // Restore tokens
    const tokensJson = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (tokensJson) {
      const tokens = JSON.parse(tokensJson) as AuthTokens;
      $accessToken.set(tokens.accessToken);
      $refreshToken.set(tokens.refreshToken);
    }

    // Restore user
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (userJson) {
      const { user, type } = JSON.parse(userJson) as { user: Admin | Voter; type: UserType };
      $user.set(user);
      $userType.set(type);
    }
  } catch (e) {
    console.error('Failed to initialize auth:', e);
    logout(); // Clear corrupted data
  }
}
