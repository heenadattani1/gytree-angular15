import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../core/services/base/base.service';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ArticlesListService  extends BaseService {

  constructor(
    protected httpClient: HttpClient,
    protected tokenStorage: TokenStorageService
  ) {
    super(httpClient, tokenStorage)
  }

  getArticlesList() {
    const url = `https://blog.gytree.com/wp-json/wp/v2/posts?_embed`;
    return this.get(url);
  }
}
