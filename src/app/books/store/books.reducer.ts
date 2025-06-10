// books/store/books.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Book } from './models/books.model';
import * as BookActions from './books.actions';

export interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

export const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

export const booksReducer = createReducer(
  initialState,
  on(BookActions.loadBooks, (state) => ({ ...state, loading: true })),
  on(BookActions.loadBooksSuccess, (state, { books }) => ({
    ...state,
    books,
    loading: false,
  })),
  on(BookActions.loadBooksFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(BookActions.addBooks, (state, { book }) => ({
    ...state,
    books: [...state.books, book],
  })),
  on(BookActions.deleteBooks, (state, { id }) => ({
    ...state,
    books: state.books.filter((book) => book.id !== id),
  })),
  on(BookActions.editBooks, (state, { book }) => ({
    ...state,
    books: state.books.filter((bookFind) => (bookFind = book)),
  }))
);
