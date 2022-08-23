import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { RecentQuotes } from './RecentQuotes';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class RecentQuotesService {
  private recentQuotesUrl = 'api/recentQuotes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET recent quotes from the server */
  getRecentQuotes(): Observable<RecentQuotes[]> {
    return this.http.get<RecentQuotes[]>(this.recentQuotesUrl)
      .pipe(
        tap(_ => this.log('fetched recent quotes')),
        catchError(this.handleError<RecentQuotes[]>('getRecentQuotes', []))
      );
  }

  /** GET recent quotes by id. Return `undefined` when id not found */
  getRecentQuoteNo404<Data>(id: number): Observable<RecentQuotes> {
    const url = `${this.recentQuotesUrl}/?id=${id}`;
    return this.http.get<RecentQuotes[]>(url)
      .pipe(
        map(recentQuotes => recentQuotes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} recentQuotes with id=${id}`);
        }),
        catchError(this.handleError<RecentQuotes>(`getRecentQuote id=${id}`))
      );
  }

  /** GET recent quotes by id. Will 404 if id not found */
  getRecentQuote(id: number): Observable<RecentQuotes> {
    const url = `${this.recentQuotesUrl}/${id}`;
    return this.http.get<RecentQuotes>(url).pipe(
      tap(_ => this.log(`fetched recentQuote with id=${id}`)),
      catchError(this.handleError<RecentQuotes>(`getRecentQuote id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new quote to the server */
  addRecentQuote(recentQuote: RecentQuotes): Observable<RecentQuotes> {
    return this.http.post<RecentQuotes>(this.recentQuotesUrl, recentQuote, this.httpOptions).pipe(
      tap((newRecentQuote: RecentQuotes) => this.log(`added recent quote w/ id=${newRecentQuote.id}`)),
      catchError(this.handleError<RecentQuotes>('addRecentQuote'))
    );
  }

  /** DELETE: delete the quote from the server */
  deleteRecentQuote(id: number): Observable<RecentQuotes> {
    const url = `${this.recentQuotesUrl}/${id}`;

    return this.http.delete<RecentQuotes>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted recent quote w/ id=${id}`)),
      catchError(this.handleError<RecentQuotes>('deleteRecentQuote'))
    );
  }

  /** PUT: update the quote on the server */
  updateRecentQuote(recentQuotes: RecentQuotes): Observable<any> {
    return this.http.put(this.recentQuotesUrl, recentQuotes, this.httpOptions).pipe(
      tap(_ => this.log(`updated recent quote with id=${recentQuotes.id}`)),
      catchError(this.handleError<any>('updateRecentQuote'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a RecentQuotesService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`RecentQuotesService: ${message}`);
  }
}
