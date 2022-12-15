import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './shared/services/error.interceptor';
import { ToastrModule } from 'ngx-toastr';

import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { NgOptimizedImage, provideImageKitLoader } from '@angular/common';
// import { MetaTagsResolver } from './modules/shared/services/meta-tags/meta-tags.resolver';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    LottieModule.forRoot({ player: playerFactory }),
    AppRoutingModule,
    NgOptimizedImage,
    // NgbModule,
    ToastrModule.forRoot(),
  ],
  providers: [
   // provideImageKitLoader("https://image.gytree.com/assets/media/gaytree/icons/"),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    // MetaTagsResolver
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
