import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { OUR_STORY_SHAPING_GYTREE } from '../our-story/our-story.constant';

@Component({
  selector: 'app-founder',
  templateUrl: './founder.component.html',
  styleUrls: ['./founder.component.scss']
})
export class FounderComponent implements OnInit {

  founder = OUR_STORY_SHAPING_GYTREE[0];

  constructor(
    private titleService: Title,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Gytree - Founder');
  }
}
