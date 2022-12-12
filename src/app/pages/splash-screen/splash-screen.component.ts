import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
  @Input() duration: number = 3;
  @Input() isShowSplash;

  @Output() splasgScreenHide = new EventEmitter();

  showSplash = true;

  constructor(public cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showSplash = !this.showSplash;
      this.isShowSplash = !this.isShowSplash;
      this.splasgScreenHide.emit(true);
      this.cdr.detectChanges();
    }, this.duration * 1000);
  }

}
