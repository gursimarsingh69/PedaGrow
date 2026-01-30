export interface StoredMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: StoredMessage[];
  updatedAt: string; // ISO
}

const STORAGE_KEY = "pedagrow_chat_history";
const RESTORE_KEY = "pedagrow_chat_restore";

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to load conversations", e);
    return [];
  }
}

export function saveConversation(conv: Conversation) {
  try {
    const all = loadConversations();
    const idx = all.findIndex((c) => c.id === conv.id);
    if (idx !== -1) {
      all[idx] = conv;
    } else {
      all.push(conv);
    }
    // sort by updatedAt desc
    all.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("Failed to save conversation", e);
  }
}

export function deleteConversation(id: string) {
  try {
    const all = loadConversations().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("Failed to delete conversation", e);
  }
}

export function clearConversations() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear conversations", e);
  }
}

export function setRestoreConversation(conv: Conversation) {
  try {
    localStorage.setItem(RESTORE_KEY, JSON.stringify(conv));
  } catch (e) {
    console.error("Failed to set restore conversation", e);
  }
}

export function getAndClearRestore(): Conversation | null {
  try {
    const raw = localStorage.getItem(RESTORE_KEY);
    if (!raw) return null;
    const conv = JSON.parse(raw) as Conversation;
    localStorage.removeItem(RESTORE_KEY);
    return conv;
  } catch (e) {
    console.error("Failed to get/clear restore conversation", e);
    return null;
  }
}
