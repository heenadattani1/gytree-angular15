const RESPONSIVE = {
    0: {
        nav: false,
        dots: false,
    },
    400: {
        nav: false,
        dots: false,
    },
    740: {
        nav: false,
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

export const CAROUSEL_CONFIG = {
    carouselOptions: {
        loop: true,
        center: true,
        margin: 0,
        nav: true,
        navText: ['<', '>'],
        dots: false,
        autoWidth: true,
        mouseDrag: true,
        touchDrag: true,
        responsive: RESPONSIVE,
    },
    options: {
        loop: false,
        center: false,
        margin: 10,
        nav: false,
        dots: false,
        autoWidth: true,
        mouseDrag: false,
        touchDrag: true
    },
}