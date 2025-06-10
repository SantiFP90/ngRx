import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBooks, selectBooksLoading } from '../store/books.selectors';
import { loadBooks, addBooks, deleteBooks } from '../store/books.actions';
import { FormsModule } from '@angular/forms';
import { Book } from '../store/models/books.model';
import { AddBookComponent } from './components/add.book/add.book.component';

@Component({
  standalone: true,
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
  imports: [CommonModule, FormsModule, AddBookComponent],
})
export class BooksComponent implements OnInit {
  books$ = this.store.select(selectBooks);
  loading$ = this.store.select(selectBooksLoading);

  constructor(private store: Store) {}

  ngOnInit(): void {}

  load() {
    this.store.dispatch(loadBooks());
  }

  delete(id: string | number) {
    this.store.dispatch(deleteBooks({ id }));
  }
}
