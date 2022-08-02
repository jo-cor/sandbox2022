import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';

//https://angular.io/guide/providers
//https://angular.io/guide/dependency-injection
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor() {}

  //https://angular.io/tutorial/toh-pt6
  getHeroes(): Observable<Hero[]> {
    return of(HEROES);
  }
}
