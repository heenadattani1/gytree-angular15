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

const MOBILE_RESPONSIVE_CONFIG =
{
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

const WHATWETREAT_CONFIG =
{
  0: {
    nav: true,
    dots: false,
    items: 1.5
  },
  340: {
    nav: true,
    dots: false,
    items: 1.5
  },
  400: {
    nav: true,
    dots: false,
    items: 2
  },
  465: {
    nav: true,
    dots: false,
    items: 2.5
  },
  560: {
    nav: true,
    dots: false,
    items: 3
  },
  640: {
    nav: true,
    dots: false,
    items: 3.4
  },
  690: {
    nav: true,
    dots: false,
    items: 3.7
  },
  740: {
    nav: true,
    dots: false,
    items: 4
  },
  830: {
    nav: true,
    dots: false,
    items: 4.5
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

const SHAPING_GYTREE_CONFIG =
{
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
  465: {
    nav: true,
    dots: false,
    items: 2
  },
  740: {
    nav: true,
    dots: false,
    items: 2
  },
  900: {
    nav: true,
    dots: false,
    items: 3
  },
  1000: {
    nav: true,
    dots: false,
    items: 3
  },
  1240: {
    nav: true,
    dots: false,
    items: 3
  }
}


export const HOME_CONSTANT_CONFIG = {
  offerList: {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    // autoWidth: true,
    items: 1,
    nav: true,
    navText: ['<', '>'],
    margin: 30,
    responsive: RESPONSIVECONFIG
  },
  newOfferList: {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    lazyLoad: true,
    // autoWidth: true,
    items: 1,
    nav: true,
    navText: ['<', '>'],
    margin: 30,
    responsive: MOBILE_RESPONSIVE_CONFIG
  },
  consultationList: {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    items: 1,
    nav: false,
    margin: 10,
  },
  articleList: {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoWidth: true,
    nav: true,
    navText: ['<', '>'],
    margin: 30,
    responsive: MOBILE_RESPONSIVE_CONFIG
  },
  videoList: {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoWidth: true,
    nav: true,
    navText: ['<', '>'],
    margin: 30,
    responsive: MOBILE_RESPONSIVE_CONFIG
  },
  whatWeTreatOwl: {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoWidth: true,
    nav: true,
    navText: ['<', '>'],
    responsive: WHATWETREAT_CONFIG
  },
  shapingGytree: {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoWidth: true,
    nav: true,
    navText: ['<', '>'],
    margin: 30,
    responsive: SHAPING_GYTREE_CONFIG
  },
  shapingGytreeConfig: {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    dots: true,
    // autoWidth: true,
    items: 1,
    nav: true,
    navText: ['<', '>'],
    margin: 30,
    responsive: MOBILE_RESPONSIVE_CONFIG,
    autoplay: true,
    autoplaySpeed: 1000,
    autoplayTimeout: 5000,
  }
}

export const SHAPING_GYTREE_LIST = [
  {
    image: "https://image.gytree.com/assets/media/gaytree/misc/founder.webp",
    title: "Shaili Chopra,",
    position: "Founder",
    description: "She founded India's largest community of women, SheThePeople, with over a billion in digital reach."
  },
  {
    image: "https://image.gytree.com/assets/media/gaytree/misc/user2.webp",
    title: "Sudeshna Ray,",
    position: "Medical Director",
    description: "The medical director at Gytree, has over 25 years of rich experience in OBGYN and Gynaecology."
  },
  {
    image: "https://image.gytree.com/assets/media/gaytree/misc/user3.webp",
    title: "Kareshma Khanna,",
    position: "Operations Lead",
    description: "She is an advocate of women's health and has built successful startups in the pharma space."
  },
  {
    image: "//image.gytree.com/assets/media/gaytree/misc/swarnima_ourStory.webp",
    title: "Swarnima Bhattacharya,",
    position: "Chief Product Officer",
    description: "Swarnima practised Public Health with UN and WHO for a decade, and founded Thea, a women’s health advocacy platform."
  },  
]