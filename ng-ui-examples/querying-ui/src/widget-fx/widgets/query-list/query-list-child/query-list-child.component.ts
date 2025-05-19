import { Component, QueryList, ElementRef, Renderer2,
  ViewChildren, AfterViewInit, OnInit } from '@angular/core';
import { Book } from '../book';

@Component({
  selector: 'query-list-child',
  templateUrl: './query-list-child.component.html',
  styleUrls: ['./query-list-child.component.scss']
})
export class QueryListChildComponent implements AfterViewInit, OnInit {
  allBooks: Book[] = [];
  @ViewChildren('book') books: QueryList<ElementRef>;

  constructor(private ren: Renderer2) {}

  ngOnInit(): void {
    this.initBooksCollection();
  }

  ngAfterViewInit(): void {
    this.books.changes.subscribe(
      (val) => {
        console.log(val.toArray());
      }
    );
  }

  filterByGenre(genre: string) {
    this.books.filter( (elem) => {
      return this.genreMatches(elem, genre);
    }).forEach( (bookNode) => {
      this.ren.setStyle(bookNode.nativeElement, 'border', '3px solid red');
    });
  }

  addBook() {
    this.allBooks.push( {
      id: 'book-6',
      author: 'Stephen King',
      title: 'Rita Hayworth and the Shawshank Redemption',
      genre: 'Fiction' }
    );
  }

  removeBook() {
    this.allBooks.splice(this.allBooks.length - 1, 1);
  }

  private genreMatches(elem: ElementRef, genre: string): boolean {
    if (this.haveIdAttribute(elem)) {
      const bookGenre = this.getGenreForBookById(elem.nativeElement.attributes['id'].value);
      return bookGenre === genre;
    }
    return false;
  }

  private haveIdAttribute(elem: ElementRef): boolean {
    return elem.nativeElement
    && elem.nativeElement.attributes
    && elem.nativeElement.attributes['id']
    && elem.nativeElement.attributes['id'] !== '';
  }

  private getGenreForBookById(id: string) {
    const rv = this.allBooks.find( (book) => {
      return book.id === id;
    });
    return rv ? rv.genre : '';
  }

  private initBooksCollection() {
    this.allBooks.push({ id: 'book-1', author: 'Frank Herbert', title: 'Dune', genre: 'Science Fiction' });
    this.allBooks.push({ id: 'book-2', author: 'Stephen King', title: 'Carrie', genre: 'Horror' });
    this.allBooks.push({ id: 'book-3', author: 'Robert Heinlein', title: 'Stranger in a Strange Land', genre: 'Science Fiction' });
    this.allBooks.push({ id: 'book-4', author: 'Robert Ludlum', title: 'The Bourne Identity', genre: 'Spy Fiction' });
    this.allBooks.push({ id: 'book-5', author: 'Clancy Thomas', title: 'The Fear of All Sums', genre: 'Math Fiction' });
  }
}
