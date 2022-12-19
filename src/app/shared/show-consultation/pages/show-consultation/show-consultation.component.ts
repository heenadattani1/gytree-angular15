import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CAROUSEL_CONFIG } from 'src/app/modules/shared/constants/carousel-config.constant';
import { NavigateService } from 'src/app/modules/shared/helper-utils/navigate.service';
import { CONSULTATION_SCHEMA } from 'src/app/modules/shared/models/consultations.constant';
@Component({
  selector: 'app-show-consultation',
  templateUrl: './show-consultation.component.html',
  styleUrls: ['./show-consultation.component.scss']
})
export class ShowConsultationComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth();
  }

  @Input() Home: boolean;
  mobileScreen: boolean;
  laptopScreen: boolean;

  consultations: CONSULTATION_SCHEMA = {
    consultationList: {
      ...CAROUSEL_CONFIG.carouselOptions,
      loop: false,
      margin: 0,
      nav: true,
      center: false,
      autoWidth: false,
      items: 1,
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
    },
    staticData: [
      {
        title: 'Consult Our Health Experts',
        description: 'Get a chance to connect directly with our team of health experts.',
        src: 'https://image.gytree.com/assets/media/gaytree/misc/doctors.svg',
        routing: '/our-experts',
        afterLoginRouting: '/book-doctor',
        heading: 'Expert Consultation',
        id: 'expert_consult'
      },
      {
        title: 'Lab Tests',
        description: 'Get yourself tested from the comfort of your Home.',
        src: 'https://image.gytree.com/assets/media/gaytree/misc/Frame.svg',
        routing: '/lab-test',
        heading: 'Book A Test',
        id: 'lab_test'
      }
    ]
  };

  constructor(
    private navigateService: NavigateService,
  ) { }

  ngOnInit(): void {
    this.screenWidth();
  }

  /**
 * Method to get the screen size
 */
  screenWidth() {
    if (window.innerWidth <= 575) {
      this.mobileScreen = true;
    } else {
      this.mobileScreen = false;
    }
    if (window.innerWidth > 991 && window.innerWidth < 1200) this.laptopScreen = true;
    else this.laptopScreen = false;
  }

  /**
  * Method to redirect
  */
  bookNowClickHandler(route: string) {
    this.navigateService.navigation([route]);
  }
}