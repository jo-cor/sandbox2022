import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  selectedHero?: Hero;

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getHeroes(); //bad practice: call this at the ctor who should do the bare minimum
  }

  onSelect(receivedHero: Hero): void {
    this.selectedHero = receivedHero;
  }

  getHeroes(): void {
    this.heroes = this.heroService.getHeroes();
  }
}
