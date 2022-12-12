import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, AfterViewInit, OnDestroy {
  today: Date = new Date();

  constructor() {}

  ngOnInit(): void {
    document.body.classList.add('bg-white');
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    document.body.classList.remove('bg-white');
  }
}
