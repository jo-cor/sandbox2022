import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, catchError, map, tap } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

//https://angular.io/guide/providers
//https://angular.io/guide/dependency-injection
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private messagesService: MessageService,
    private http: HttpClient
  ) {}

  /**
   * @deprecated The new version takes from HttpClient instead of a simple local array
   * https://angular.io/tutorial/toh-pt6
   */
  getHeroes_deprecated(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messagesService.add('HeroService: fetched heroes');
    return heroes;
  }

  /**
   * Replaces getHeroes_deprecated which used to mock data from a simple local array, this one uses HttpClient
   */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /**
   * @deprecated The new version takes from HttpClient instead of a simple local array
   * https://angular.io/tutorial/toh-pt6#get-hero-by-id
   */
  getHero_deprecated(id: number): Observable<Hero> {
    const hero = HEROES.find((r) => r.id === id)!;
    this.messagesService.add(`HeroService: fetched hero id=${id}`); //The backtick ( ` ) characters define a JavaScript template literal for embedding the id. you won't make fun of me again, madafaka!
    return of(hero);
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero [${id}]`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    //http.put [Returns an `Observable` of the response as a JSON object.]
    //that JSON object can be any so the returned Observable MUST BE [any] as well, it must match the results from the http.put
    //if we sign the method as returned Observable<Hero> then we should cast that 'any' to 'Hero'
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) =>
        this.log(`added hero, name [${newHero.name}], id [${newHero.id}]`)
      ),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero, id [${id}]`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  private log(message: string) {
    this.messagesService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`[${operation}] failed: ${error.message}.`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
