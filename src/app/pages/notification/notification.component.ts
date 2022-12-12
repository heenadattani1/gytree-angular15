import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @Input() file: any;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    if (this.file?.type === 'video')
      this.addVideoScriptTag();
  }

  /**
   * video tag script dynamic loading
   */
  addVideoScriptTag() {
    if (!document.getElementById('vimeo')) {
      var script = document.createElement('script');
      script.id = 'vimeo';
      script.src = "https://player.vimeo.com/api/player.js";
      document.body.appendChild(script);
    }
  }

}
