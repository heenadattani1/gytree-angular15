export class LocalStorageUtil {

  static setLocalStorageItem(key: string, value: any) {
    return localStorage.setItem(key, value)
  }

  static getLocalStorageItem(key: string) {
    return localStorage.getItem(key);
  }

  static removeLocalStorageItem(key: string) {
    return localStorage.removeItem(key);
  }

  static clearLocalStorage() {
    return localStorage.clear();
  }
}
