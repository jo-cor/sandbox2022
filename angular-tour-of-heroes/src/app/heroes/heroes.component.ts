import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  selectedHero?: Hero;

  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getHeroes(); //bad practice: call this at the ctor who should do the bare minimum
  }

  onSelect(receivedHero: Hero): void {
    this.selectedHero = receivedHero;
    this.messageService.add(
      `HeroesComponent: selected hero id=${receivedHero.id}`
    );
  }

  getHeroes(): void {
    //https://angular.io/tutorial/toh-pt4#subscribe-in-heroescomponent
    //the old way was synchronous
    //the new way is asynchronous
    this.heroService.getHeroes().subscribe((r) => (this.heroes = r));
  }

  addHero(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.heroService.addHero({ name } as Hero).subscribe((r) => {
      this.heroes.push(r);
    });
  }

  deleteHero(hero: Hero): void {
    // i know i know i know... we are deleting from our 'own' list (this.heroes) they why da fuk do we need to call heroService.deleteHero?
    // and not only that... why do we must subscribe to it? well... if we do not call/subscribe, the moment you hit
    // http://localhost:4200/dashboard then http://localhost:4200/heroes now check HeroesComponent.ngOnInit... oooh! now you know!
    // this onInit will call this.getHeroes which in turn will get heroService.getHeroes() which uses our unmodified mock database,
    // unmodified mock database that was not deleted by this.heroService.deleteHero(...).subscribe()
    // so... this SUBSCRIBE is really important.
    this.heroes = this.heroes.filter((r) => r !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
