import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../../../store/models/books.model';
import {
  addBooks,
  editBooks,
  finishEditBooks,
  loadBooks,
} from '../../../store/books.actions';
import { Store } from '@ngrx/store';
import {
  selectIsEditing,
  selectSelectedBook,
} from '../../../store/books.selectors';

@Component({
  standalone: true,
  selector: 'app-addBook',
  templateUrl: './add.book.component.html',
  styleUrls: ['./add.book.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AddBookComponent implements OnInit {
  author: string = '';
  title: string = '';
  id?: string | number;

  isEditing$ = this.store.select(selectIsEditing);
  selectedBook$ = this.store.select(selectSelectedBook);

  constructor(private store: Store) {}

  ngOnInit() {
    this.selectedBook$.subscribe((book) => {
      if (book) {
        this.id = book.id;
        this.author = book.author;
        this.title = book.title;
      }
    });
  }

  submit() {
    if (this.id) {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    const book: Book = {
      id: Math.floor(Math.random() * 1000),
      title: this.title,
      author: this.author,
    };
    this.store.dispatch(addBooks({ book }));
    this.cancel();
  }

  edit() {
    const book: Book = {
      id: this.id!,
      title: this.title,
      author: this.author,
    };
    this.store.dispatch(editBooks({ book }));
    this.cancel();
  }

  cancel() {
    this.title = '';
    this.author = '';
    this.store.dispatch(finishEditBooks());
  }
}
