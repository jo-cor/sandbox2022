import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//https://angular.io/guide/providers
//https://angular.io/guide/dependency-injection
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  constructor(
    private messagesService: MessageService,
    private http: HttpClient
  ) {}

  /**
   * @deprecated The new version takes from HttpClient instead of a simple local array
   */
  //https://angular.io/tutorial/toh-pt6
  getHeroes_deprecated(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messagesService.add('HeroService: fetched heroes');
    return heroes;
  }

  /**
   * Replaces getHeroes_deprecated which used to mock data from a simple local array, this one uses HttpClient
   */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find((r) => r.id === id)!;
    this.messagesService.add(`HeroService: fetched hero id=${id}`); //The backtick ( ` ) characters define a JavaScript template literal for embedding the id.
    return of(hero);
  }

  private log(message: string) {
    this.messagesService.add(`HeroService: ${message}`);
  }
}
