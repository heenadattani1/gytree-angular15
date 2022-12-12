import { OwlOptions } from "ngx-owl-carousel-o";

export const APPOINTMENT_LIST_OPTIONS: OwlOptions =
{
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
    nav: false,
    margin: 18,
    responsive: {
        0: {
            nav: true,
            dots: false,
            items: 1
        },
        400: {
            nav: true,
            dots: false,
            items: 1
        },
        740: {
            nav: true,
            dots: false,
            items: 1
        },
        1000: {
            nav: true,
            dots: false,
            items: 1,
        },
        1240: {
            nav: true,
            dots: false,
            items: 1,
        }
    }
};