import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appYoutubeDirective]'
})
export class YoutubeDirectiveDirective {
  selector: any;
  options: any;
  buttonLabel: any;
  captionText: any;
  stopVideoBtn: any;
  @Input('video') video: any;
  constructor() {
    const defaultOptions = {
      button: `
      <svg height="100%" viewBox="0 0 68 48" width="100%" fill="#000">
          <path
          d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z">
          </path>
          <path d="M 45,24 27,14 27,34" fill="#fff"></path>
      </svg>`,
      imageBg: true,
      qualityBg: 'mqdefault'
    }
    this.options = { ...defaultOptions, ...this.options };
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    const selector = document.querySelectorAll('.js-video-item');
    if (selector && !selector.length) {
      return;
    }

    this.selector = selector;
    this.selector.forEach((el: any) => {
      const videoHref = this.video;
      const videoId = this.youtubeParser(videoHref);
      const videoPlay = el.querySelector('.js-video-play');

      videoPlay.innerHTML = this.options.button !== false ? this.options.button : null;
      videoPlay.setAttribute('aria-label', this.buttonLabel);
      this.isBgImage(el, videoId)
      el.addEventListener('click', (e: any) => {

        this.selector.forEach((item: any) => {

          if (item.querySelector('iframe')) {
            item.querySelector('iframe').remove();
          }
        });

        e.preventDefault();
        const iframe = this.createIframe(this.youtubeParser(el.id), 1);
        el.appendChild(iframe);

        el.querySelector('.js-video-play') ? el.querySelector('.js-video-play').remove() : null;
        el.querySelector('.js-video-caption') ? el.querySelector('.js-video-caption').remove() : null;
      });
    });
  }

  stopVideo() {
    if (!this.stopVideoBtn) {
      return;
    }

    this.stopVideoBtn.forEach((item: any) => {
      item.addEventListener('click', () => {
        this.selector.forEach((item: any) => {

          item.querySelector('.video__caption')
            ? this.captionText.push(item.querySelector('.js-video-caption').textContent)
            : this.captionText.push(null);

          if (item.querySelector('iframe')) {
            item.querySelector('iframe').remove();

            const captionText = this.captionText[this.captionText.length - 2];

            const showCaption = () => {
              if (captionText !== null) return `<span class="video__caption js-video-caption">${captionText}</span>`;
              return '';
            }

            const DOMElementButton = `
                    <button class="video__play js-video-play" aria-label="${this.buttonLabel}">${this.options.button}</button>
                    ${showCaption()}
                `;
            item.innerHTML = DOMElementButton;
          }
        });
      })
    });

  }

  youtubeParser(url: any) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match !== null) {
      return (match && match[7].length == 11) ? match[7] : false;
    }
    return url;
  }

  generateUrl(id: any, autoplay: any) {
    const query = `?rel=0&showinfo=0&autoplay=${autoplay}`;
    return `https://www.youtube.com/embed/${id}${query}`;
  }

  createIframe(id: any, autoplay: any) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('title', 'YouTube video player');
    iframe.setAttribute('src', this.generateUrl(id, autoplay));
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    return iframe;
  }

  isBgImage(element: any, videoId: any) {
    if (!this.options.imageBg) {
      element.removeAttribute('style');
      return;
    } else if (!element.hasAttribute('style') && this.options.imageBg) {
      const youtubeImgSrc = `https://i.ytimg.com/vi_webp/${videoId}/${this.options.qualityBg}.webp`;
      element.setAttribute('loading', 'lazy');
      element.style.backgroundImage = `url(${youtubeImgSrc})`;
    }
  }


}
