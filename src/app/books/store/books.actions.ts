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

//min 9 https://www.youtube.com/watch?v=fiT5ng5wgrk&list=PL_WGMLcL4jzVkzMox4UxGcsBLvFurCDax&index=3&ab_channel=LeiferMendez
