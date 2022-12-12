import { NgxGalleryAnimation } from 'ngx-gallery-9';

const RESPONSIVECONFIG =
{
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

export const PACKAGE_DETAILS_CONFIG = {
    teamList: {
        loop: false,
        mouseDrag: true,
        touchDrag: true,
        dots: false,
        autoWidth: true,
        nav: true,
        navText: ["<", ">"],
        margin: 30,
        responsive: RESPONSIVECONFIG
    },

    galleryOptions: [
        {
            width: '100%',
            height: '400px',
            thumbnailsColumns: 4,
            preview: false,
            imageArrows: false,
            thumbnailsArrows: true,
            imageAnimation: NgxGalleryAnimation.Slide
        },
        {
            breakpoint: 800,
            width: '100%',
            height: '600px',
            imagePercent: 80,
            thumbnailsPercent: 20,
            thumbnailsMargin: 20,
            thumbnailMargin: 20
        },
        {
            breakpoint: 3000,
            preview: false
        },
        {
            arrowPrevIcon: 'left-custom',
            arrowNextIcon: 'right-custom',
            // closeIcon: 'close-custom'
        }
    ]
}

export const IMAGE_TYPE_CONFIG = {
    consultation: 'https://image.gytree.com/assets/media/gaytree/icons/consultation.svg',
    pdf: 'https://image.gytree.com/assets/media/gaytree/icons/doc_white.svg',
    couponcode: 'https://image.gytree.com/assets/media/gaytree/icons/coupon.svg',
    coupon: 'https://image.gytree.com/assets/media/gaytree/icons/coupon.svg',
    nutritionist: 'https://image.gytree.com/assets/media/gaytree/icons/nutritionist.svg',
    tracker: 'https://image.gytree.com/assets/media/gaytree/icons/PCOS.svg',
    report: 'https://image.gytree.com/assets/media/gaytree/icons/health-report.svg',
    video: 'https://image.gytree.com/assets/media/gaytree/icons/video_white.png',
    audio: 'https://image.gytree.com/assets/media/gaytree/icons/audio_white.png'
}