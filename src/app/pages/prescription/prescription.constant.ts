import { OwlOptions } from "ngx-owl-carousel-o";

export const PILL_OPTION: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
    items: 1,
    nav: false,
    margin: 18,
    responsive: {
        0: {
            nav: true,
            dots: false,
        },
        400: {
            nav: true,
            dots: false,
        },
        740: {
            nav: true,
            dots: false,
        },
        1000: {
            nav: true,
            dots: false,
        },
        1240: {
            nav: true,
            dots: false,
        }
    }
}