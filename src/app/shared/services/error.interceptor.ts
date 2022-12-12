import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
export const CODE = {
    OK: 200,
    UNAUTHORIZED: 401
}

export const SKIP_LOADER = {
    PLAYABLE_URL: 'playableURL',
    BOOKMARK: '/bookmark',
    SOCIAL: '/social',
    STREAM: '/stream',
    STORY: 'story/detail',
    LIVE_EVENT: '/out/',
    LIVE_EVENT_COUNT: '/live/',
    GENRATE_OTP: '/myotp/generatePin',
    VALIDATE_LOGIN: '/otpvalidate/validatelogin',
    REGISTER_USER: '/register/registeruser',
    WORDPRESS_API: 'posts?_embed'
}

export const SKIP_ERROR_REQUEST = {
    LOGIN: 'otpvalidate/validatelogin',
}

@Injectable({
    providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];
    public userLanguage = 'en';


    constructor(
        private loaderService: LoaderService,
        private toastr: ToastrService,
        public router: Router) {
    }

    removeRequest(req: HttpRequest<any>) {
        const i = this.requests.indexOf(req);
        if (i >= 0) {
            this.requests.splice(i, 1);
        }
        this.loaderService.isLoading.next(this.requests.length > 0);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf(SKIP_LOADER.LIVE_EVENT_COUNT) < 0 && req.url.indexOf(SKIP_LOADER.LIVE_EVENT) < 0 
        && req.url.indexOf(SKIP_LOADER.WORDPRESS_API) < 0
        ) {
            this.requests.push(req);
            this.loaderService.isLoading.next(true);
        }

        return Observable.create((observer: any) => {
            let eventTrackingDetail: any = {};
            const subscription = next.handle(req)
                .subscribe(
                    event => {
                        const apiCallStartTime = new Date().getTime();
                        if (event instanceof HttpResponse) {
                            if (event && event.body && event.body.status === CODE.OK) {
                                event.body.success = true;
                            }
                            this.removeRequest(req);
                            observer.next(event);
                            const apiCallEndTime = new Date().getTime();
                            eventTrackingDetail.response_time = (apiCallEndTime - apiCallStartTime) / 100;
                            eventTrackingDetail.network_type = 'test',
                                eventTrackingDetail.Name = event.url,
                                eventTrackingDetail.response_code = event.status,
                                eventTrackingDetail.SOURCE = '',
                                eventTrackingDetail.url = event.url
                        }
                    },
                    err => {
                        this.removeRequest(req);
                        observer.error(err);

                        if (req.url.indexOf(SKIP_ERROR_REQUEST.LOGIN) > -1) {
                            this.removeRequest(req);
                            observer.error(err);
                            return;
                        }

                        if (err && err?.error && err?.error?.message) {
                            this.toastr.error(err?.error?.message, undefined, { positionClass: 'toast-top-center', closeButton: true });
                        }
                        return;
                    },
                    () => {
                        this.removeRequest(req);
                        observer.complete();
                    });
            return () => {
                this.removeRequest(req);
                subscription.unsubscribe();
            };


        });
    }
}