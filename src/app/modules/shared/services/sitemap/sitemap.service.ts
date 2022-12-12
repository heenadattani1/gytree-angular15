import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../../../../core/services/base/base.service';
import { TokenStorageService } from '../../../../core/services/token-storage/token-storage.service';

@Injectable({
    providedIn: 'root'
})
export class SitemapService extends BaseService {

    constructor(
        protected httpClient: HttpClient,
        protected tokenStorage: TokenStorageService
    ) {
        super(httpClient, tokenStorage)
    }

    getSitemapData() {
        const url = `${environment.apiUrls.baseUrl}v1/sitemaplist/SitemapListing`;
        return this.get(url);
    }

}