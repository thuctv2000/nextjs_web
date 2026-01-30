/**
 * Infrastructure - Storage Service
 * Abstraction for browser storage operations
 */
export class StorageService {
  private storage: Storage | null = null;

  constructor(type: 'local' | 'session' = 'local') {
    if (typeof window !== 'undefined') {
      this.storage = type === 'local' ? localStorage : sessionStorage;
    }
  }

  get<T>(key: string): T | null {
    if (!this.storage) return null;

    const item = this.storage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.storage) return;

    const item = typeof value === 'string' ? value : JSON.stringify(value);
    this.storage.setItem(key, item);
  }

  remove(key: string): void {
    if (!this.storage) return;
    this.storage.removeItem(key);
  }

  clear(): void {
    if (!this.storage) return;
    this.storage.clear();
  }
}

export const localStorageService = new StorageService('local');
export const sessionStorageService = new StorageService('session');
