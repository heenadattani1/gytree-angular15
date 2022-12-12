import { Injectable } from '@angular/core';

export const STORAGEKEY = {
  SPLASH_SCREEN: 'SPLASH_SCREEN',
}

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {

  constructor() { }

  setItem(key: string, value: string) {
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
  }

  getItem(key: string) {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } return '';
  }
  removeItem(key: string) {
    localStorage.removeItem(key)
  }


  setSplashScreen() {
    localStorage.setItem(STORAGEKEY.SPLASH_SCREEN, JSON.stringify(true));
  }

  getSplashScreen() {
    return localStorage.getItem(STORAGEKEY.SPLASH_SCREEN) &&
      JSON.parse(localStorage.getItem(STORAGEKEY.SPLASH_SCREEN));
  }

}
