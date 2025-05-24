import { Component, OnInit } from '@angular/core';
import { Book } from '../../../shared/models/book';
import { BookService } from '../../../core/services/book.service';
import { LoggingService } from '../../../core/services/logging.service';
import { AngularConsoleLoggerService } from '../../../../../projects/angular-console-logger/src/lib/angular-console-logger.service';

@Component({
  selector: 'app-books-overview',
  templateUrl: './books-overview.component.html',
  styleUrls: ['./books-overview.component.css'],
})
export class BooksOverviewComponent implements OnInit {
  allReadbooks: Book[] = [];
  allUnreadbooks: Book[] = [];

  activeTabIndex = 0;

  constructor(
    private readonly bookService: BookService,
    private readonly loggingService: AngularConsoleLoggerService
  ) {}

  ngOnInit() {
    this.getBooks(false);
  }

  bookChanged(book: Book) {
    this.bookService.update(book).subscribe(() => {
      this.getBooks(this.currentTabIsReadTab());
      this.loggingService.info('Somebody was changing a book');
    });
  }

  loadBooks() {
    this.getBooks(this.currentTabIsReadTab());
  }

  private getBooks(readAlready: boolean) {
    if (readAlready) {
      this.bookService
        .getAllReadBooks()
        .subscribe((books: Book[]) => (this.allReadbooks = books));
    } else {
      this.bookService
        .getAllUnreadBooks()
        .subscribe((books: Book[]) => (this.allUnreadbooks = books));
    }
  }

  private currentTabIsReadTab() {
    return this.activeTabIndex === 1;
  }
}
