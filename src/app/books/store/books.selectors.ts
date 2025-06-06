import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BooksState } from './books.reducer';

export const selectBooksState = createFeatureSelector<BooksState>('books');

export const selectBooks = createSelector(
  selectBooksState,
  (state) => state.books
);
export const selectBooksLoading = createSelector(
  selectBooksState,
  (state) => state.loading
);
