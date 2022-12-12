import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerComponent, MenuComponent } from '../../_metronic/kt/components';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
})
export class ErrorsComponent implements OnInit, AfterViewInit {
  @HostBinding('class') class = 'd-flex flex-column flex-root';
  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  routeToDashboard() {
    this.router.navigate(['']);
    setTimeout(() => {
      DrawerComponent.bootstrap();
      MenuComponent.bootstrap();
    }, 200);
  }
}
