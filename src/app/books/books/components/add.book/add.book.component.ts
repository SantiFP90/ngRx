import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from '../../../store/models/books.model';
import { addBooks } from '../../../store/books.actions';
import { Store } from '@ngrx/store';

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

  constructor(private store: Store) {}

  ngOnInit() {}

  add() {
    const book: Book = {
      id: Math.floor(Math.random() * 1000),
      title: this.title,
      author: this.author,
    };
    this.store.dispatch(addBooks({ book }));
    this.title = '';
    this.author = '';
  }
}
