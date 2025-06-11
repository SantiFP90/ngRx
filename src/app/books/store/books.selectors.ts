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

export const selectSelectedBook = createSelector(
  selectBooksState,
  (state) => state.selectBook
);

export const selectIsEditing = createSelector(
  selectBooksState,
  (state) => state.isEdit
);
