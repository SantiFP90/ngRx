// effects/books.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { delay, map, switchMap, catchError } from 'rxjs/operators';
import { Book } from './models/books.model';
import * as BookActions from './books.actions';

@Injectable()
export class BooksEffects {
  constructor(private actions$: Actions) {}

  loadBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.loadBooks),
      switchMap(() =>
        of([
          { id: '1', title: '1984', author: 'George Orwell' },
          { id: '2', title: 'Fahrenheit 451', author: 'Ray Bradbury' },
        ] as Book[]).pipe(
          delay(1000),
          map((books) => BookActions.loadBooksSuccess({ books })),
          catchError((error) => of(BookActions.loadBooksFailure({ error })))
        )
      )
    )
  );
}
