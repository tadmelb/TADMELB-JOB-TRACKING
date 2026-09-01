import { UserSession } from '../types';

const SESSION_KEY = 'tadmelb_active_user_session_v1';
const SESSION_CHANGE_EVENT = 'tadmelb_session_change';

export function getStoredUserSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading stored session:', err);
  }
  return null;
}

export function saveUserSession(session: UserSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('tadmelb_user_email', session.email);
    localStorage.setItem('tadmelb_user_name', session.displayName);
    window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT, { detail: session }));
  } catch (err) {
    console.error('Error saving user session:', err);
  }
}

export function clearUserSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('tadmelb_user_email');
    localStorage.removeItem('tadmelb_user_name');
    window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT, { detail: null }));
  } catch (err) {
    console.error('Error clearing user session:', err);
  }
}

export function onUserSessionChanged(callback: (session: UserSession | null) => void): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<UserSession | null>;
    callback(customEvent.detail !== undefined ? customEvent.detail : getStoredUserSession());
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === SESSION_KEY) {
      callback(getStoredUserSession());
    }
  };

  window.addEventListener(SESSION_CHANGE_EVENT, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(SESSION_CHANGE_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}
