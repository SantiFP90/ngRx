import { Component } from '@angular/core';
import { BooksComponent } from './books/books/books.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BooksComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'ngrx';
}
