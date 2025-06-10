import { createAction, props } from '@ngrx/store';
import { Book } from './models/books.model';

export const loadBooks = createAction('[Books] Load Books');
export const loadBooksSuccess = createAction(
  '[Books] Load Books Success',
  props<{ books: Book[] }>()
);
export const loadBooksFailure = createAction(
  '[Books] Load Books Failure',
  props<{ error: string }>()
);

export const addBooks = createAction(
  '[Books] Add Book Success',
  props<{ book: Book }>()
);

export const deleteBooks = createAction(
  '[Books] Delete Book Success',
  props<{ id: string | number }>()
);

export const editBooks = createAction(
  '[Books] Edit Book Success',
  props<{ book: Book }>()
);
