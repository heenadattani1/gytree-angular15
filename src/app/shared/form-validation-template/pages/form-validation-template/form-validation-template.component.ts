import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-validation-template',
  templateUrl: './form-validation-template.component.html',
  styleUrls: ['./form-validation-template.component.scss']
})
export class FormValidationTemplateComponent implements OnInit {
  @Input() form: any;
  @Input() field: string;
  @Input() label: string;
  @Input() length: number;

  constructor() { }

  ngOnInit(): void {
  }

}
