export const OUR_STORY_SHAPING_GYTREE = [
    {
        image: "https://image.gytree.com/assets/media/gaytree/misc/founder.webp",
        title: "Shaili Chopra,",
        position: "Founder",
        description: " I believe when it comes to health, women should put themselves first. Building SheThePeople over the last few years I realised how little women cared for themselves, or invested in preventive healthcare to avoid complications later. From my own mother to my friends, I saw many suffer from the impact of hormonal imbalances. Their state motivated me to work in femtech and that’s how Gytree was born. From very early on, we knew that instead of just being another health platform or weight loss app, we wanted to actually take charge and make India’s health system women-oriented."
    },
    {
        image: "https://image.gytree.com/assets/media/gaytree/misc/user2.webp",
        title: "Dr. Sudeshna Ray,",
        position: "Medical Director",
        description: "I have been dealing with women's health for the past 24 years. Working on the frontlines, I have noticed and palpated the inhibitions, prejudices and unawareness among women across ages about their body and body parts.I want to change that ! Awareness and the right knowledge about health is the key to prevention of diseases. Being the Medical Director of Gytree empowers me to create a comprehensive and holistic ecosystem for every woman in India and am so proud of that."
    },
    {
        image: "https://image.gytree.com/assets/media/gaytree/misc/user3.webp",
        title: "Kareshma Khanna,",
        position: "Operations Lead",
        description: "Having built my own startup earlier in medtech, I realised how women procrastinate when it comes to their own health and put themselves last. India has a palpable need for a comprehensive platform that provides end to end health services to women. When Shaili told me about Gytree, I was onboard in a blink !"
    },
    {
        image: "https://image.gytree.com/assets/media/gaytree/misc/swarnima_ourStory.webp",
        title: "Swarnima Bhattacharya,",
        position: "Chief Product Officer",
        description: "As a Gender and Public Health practitioner, I have always seen how women's health is culturally blindsided and medically under-researched. So I firmly believe that fixing women's health needs both clinical reform and cultural change. That's why I look forward to building Gytree. Women learning to invest financially in their health, is the revolution this generation needs."
    }
]

const MOBILE_RESPONSIVE_CONFIG =
{
    0: {
        nav: false,
        dots: true,
        loop: true,
        autoplay: true,
        autoplaySpeed: 1000,
        autoplayTimeout: 5000,
    },
    400: {
        nav: false,
        dots: true,
        loop: true,
        autoplay: true,
        autoplaySpeed: 1000,
        autoplayTimeout: 5000,
    },
    740: {
        loop: false,
        nav: true,
        dots: false,
    },
    1000: {
        nav: true,
        dots: false,
        loop: false,
    },
    1240: {
        nav: true,
        dots: false,
        loop: false,
    }
}

const RESPONSIVE_CONFIG =
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

export const CAROUSEL_CONFIG = {
    newOfferList: {
        loop: false,
        mouseDrag: true,
        touchDrag: true,
        dots: false,
        // autoWidth: true,
        items: 1,
        nav: true,
        navText: ['<', '>'],
        margin: 30,
        responsive: RESPONSIVE_CONFIG
    },
    shapingGytree: {
        loop: false,
        mouseDrag: true,
        touchDrag: true,
        dots: false,
       // autoWidth: true,
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