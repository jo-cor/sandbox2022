import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

//https://angular.io/guide/providers
//https://angular.io/guide/dependency-injection
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(private messagesService: MessageService) {}

  //https://angular.io/tutorial/toh-pt6
  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messagesService.add('HeroService: fetched heroes');
    return heroes;
  }

  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find((r) => r.id === id)!;
    this.messagesService.add(`HeroService: fetched hero id=${id}`); //The backtick ( ` ) characters define a JavaScript template literal for embedding the id.
    return of(hero);
  }
}
