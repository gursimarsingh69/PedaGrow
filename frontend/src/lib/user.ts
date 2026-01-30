export interface UserProfile {
  name: string;
  class?: string;
  curriculum?: string;
  age?: number;
  scopeOfInterest?: string[];
}

const USER_KEY = "pedagrow_user_profile";

export function saveUserProfile(profile: UserProfile) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save user profile", e);
  }
}

export function getUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch (e) {
    console.error("Failed to read user profile", e);
    return null;
  }
}

export function clearUserProfile() {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("Failed to clear user profile", e);
  }
}