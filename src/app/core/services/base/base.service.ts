// ANGULAR
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// RX JS
import { catchError, map, Observable, of } from 'rxjs';
import { APIUtil } from '../../utils/api-util';

// SERVICES
import { TokenStorageService } from '../token-storage/token-storage.service';

interface ApiSetting {
  url?: any;
  module?: any;
  responseKey?: string;
  httpMethod?: string;
  replaceParams?: string[];
  queryParams?: string[];
}

interface payloadInterface {
  success: boolean,
  data: any
}
/**
 * This service is base service to make all api call.
 * For make all api calls
 */
@Injectable()
export class BaseService {



  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService) {
  }


  /**
   * Get Method
   * @param url {string}: url for make api call
   * @param headers {HttpHeaders}: headers for pass external headers
   * @returns Observable<ApiResponse>
   */
  public get<T>(url: string, headers?: HttpHeaders): Observable<payloadInterface> {
    return this.httpClient
      .get<T>(url, { headers: this.getAllHeaders(headers) }).pipe(
        map((data: any) => {
          return { success: true, data };
        }),
        catchError((data) => {
          console.log('Error:', data);
          return of({ success: false, data });
        })
      );
  }

  /**
   * Post Method
   * @param url {string}: url for make api call
   * @param body {object}: body pass in request
   * @param headers {HttpHeaders}: headers for pass external headers
   * @returns Observable<ApiResponse>
   */
  protected post<T>(url: string, body: any, headers?: HttpHeaders): Observable<payloadInterface> {
    return this.httpClient
      .post<T>(url, body, { headers: this.getAllHeaders(headers) }).pipe(
        map((data: any) => {
          return { success: true, data };
        }),
        catchError((data) => {
          return of({ success: false, data });
        })
      );
  }

  /**
   * Put Method
   * @param url {string}: url for make api call
   * @param body {object}: body pass in request
   * @param headers {HttpHeaders}: headers for pass external headers
   * @returns Observable<ApiResponse>
   */
  protected put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.httpClient
      .put<T>(url, body, { headers: this.getAllHeaders(headers) });
  }


  /**
   * Delete Method
   * @param url {string}: url for make api call
   * @param headers {HttpHeaders}: headers for pass external headers
   * @returns Observable<ApiResponse>
   */
  protected delete<T>(url: string, headers?: HttpHeaders): Observable<T> {
    return this.httpClient
      .delete<T>(url, { headers: this.getAllHeaders(headers) });
  }

  /**
   * Patch Method
   * @param url {string}: url for make api call
   * @param body {object}: body pass in request
   * @param headers {HttpHeaders}: headers for pass external headers
   * @returns Observable<ApiResponse>
   */
  protected patch<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.httpClient
      .patch<T>(url, body, { headers: this.getAllHeaders(headers) });
  }



  /**
   * Get Headers
   * @param headers {HttpHeaders}: headers for pass external headers
   * @returns Observable<ApiResponse>
   */
  private getAllHeaders(headers: any): HttpHeaders {
    if (headers === null || headers === undefined) {
      headers = new HttpHeaders();
    }

    if (!headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('Accept')) {
      headers = headers.set('Accept', 'application/json');
    }

    if (!headers.has('Authorization')) {
      const accessToken = this.tokenStorage.getAccessToken();
      if (accessToken !== 'undefined' && accessToken && accessToken !== 'null') {
        headers = headers.set('Authorization', 'Bearer ' + accessToken);
      }
    }

    return headers;
  }


  /**
    * Api Call Method
    * @param config {object}: config for make url and choose method
    * @param url {string}: url for make api call
    * @param body {object}: body pass in request
    * @param headers {HttpHeaders}: headers for pass external headers
    * @param options {object}: options for pass other options for api call
    * @returns Observable<ApiResponse>
    */
  public apiCall(config: ApiSetting, body: object, headers: HttpHeaders): Observable<any> {
    const url = APIUtil.getFullApiUrl(config.module, config.url, body, config.replaceParams, config.queryParams);
    let request = null;
    switch (config.httpMethod) {
      case 'get':
        request = this.get(url, headers);
        break;
      case 'post':
        request = this.post(url, body, headers);
        break;
      case 'patch':
        request = this.patch(url, body, headers);
        break;
      case 'put':
        request = this.put(url, body, headers);
        break;
      case 'delete':
        request = this.delete(url, headers);
        break;
      default:
        request = this.post(url, body, headers);
    }
    return request;
  }


}
