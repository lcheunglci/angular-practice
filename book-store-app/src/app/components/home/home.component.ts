import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isShowMore: boolean = false;
  
  showMore(){
    this.isShowMore = true;
  }

  showLess(){
    this.isShowMore = false;
  }

}
