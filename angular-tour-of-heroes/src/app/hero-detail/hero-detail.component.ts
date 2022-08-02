import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  //the input makes this property an 'input property'
  //we'll bind data to it this way <app-hero-detail [hero]="this.selectedHero"></app-hero-detail>
  @Input() hero?: Hero;

  constructor() {}

  ngOnInit(): void {}
}
