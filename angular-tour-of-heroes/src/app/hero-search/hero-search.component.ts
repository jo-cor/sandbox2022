import { Component, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

/*
 a'ight... let me see if I get this.

 so we have a variable [ heroes$! ] which turns out is an observable of heroes array
 then we have the template that makes calls to our [ search(string) ] method
 but that method is iterating through [ searchTerms ], so... where is the action?

 aha! [ searchTerms ] by itself does sh*t, nothing, nada. [ searchTerms ] must be initialized
 so here is where [ ngOnInit ] comes into play: see, init here, initializes our observable [ heroes$! ]
 by piping to searchTerms which... ... ... and this is cool, searchTerms:
 1.     delays for 300ms always (i suppose it's a scientificaly-identified number about keystrokes, or not)
 2.     makes use of [ distinctUntilChanged() ] so nothing goes through the searchTerms pipe if duplicated
        (which havent reached it's true potential yet, at least not in this very first initialization)
 3.     we finally declare the action: for every term put through the searchTerms' throat, make a call to heroService.searchHeroes
 bonus. [ heroService.searchHeroes(...) is an observable too] https://angular.io/tutorial/toh-pt6#chaining-rxjs-operators
*/
@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>(); //https://angular.io/tutorial/toh-pt6#the-searchterms-rxjs-subject

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      //wait 300ms after each keystroke before considering the term
      debounceTime(300),

      //ignore new term if same as previous term
      distinctUntilChanged(),

      //MUCHO-IMPORTANTE:switch to new search observable each time the term changes

      /*With the switchMap operator, every qualifying key event can trigger an HttpClient.get() method call.
      Even with a 300 ms pause between requests, you could have many HTTP requests in flight and they may not
      return in the order sent.
      switchMap() preserves the original request order while returning only the observable from the most
      recent HTTP method call. Results from prior calls are canceled and discarded.
      Canceling a previous searchHeroes() Observable doesn't actually cancel a pending HTTP request.
      Unwanted results are discarded before they reach your application code.*/
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term); //we are pushing values into the observable for it to process it
  }
}
