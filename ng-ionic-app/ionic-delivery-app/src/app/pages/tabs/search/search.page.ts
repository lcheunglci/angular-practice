import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  @ViewChild('searchInput') searchInput: any;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 500);
  }

  onSearchChange(event: any) {
    console.log(event.detail.value);
  }

}
