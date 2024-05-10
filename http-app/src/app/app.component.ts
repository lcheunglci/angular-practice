import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from 'process';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.onFetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    // console.log(postData);
    //
    this.http.post(
      process.env['URL'],
      postData).subscribe(responseData => {
        console.log(responseData);
      });



    onFetchPosts() {
      // Send Http request
      this.http.get(process.env['URL']).subscribe(posts => {
        console.log(posts);
      });


      ClearPosts() {
        // Send Http request
      }


