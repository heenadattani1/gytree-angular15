import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  /**
    * Get Access Token
    * @returns token {string}
    */
  public getAccessToken(): string | null {
    const token: string | null = localStorage.getItem(btoa('accessToken'));
    return token;
  }

}
