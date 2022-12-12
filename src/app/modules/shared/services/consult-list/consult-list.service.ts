import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';
import { BaseService } from '../../../../core/services/base/base.service';
import { CONSULT_PAYLOAD } from '../../models/consult.constant';

@Injectable({
  providedIn: 'root'
})
export class ConsultListService extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  getQuestions(payload?: CONSULT_PAYLOAD) {
    const url = `${environment.apiUrls.baseUrl}v1/questions/questionslist`;
    return this.post(url, payload);
  }
}
