import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitAction } from './store/counter.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    this.store.dispatch(new InitAction());
  }

  constructor(private store: Store) { }
}
