import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Post } from './post.model';

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

  onCreatePost(postData: Post) {
    // Send Http request
    // console.log(postData);
    //
    this.http.post(
      process.env['URL'],
      postData).subscribe(responseData => {
        console.log(responseData);
      });
  }


  onFetchPosts() {
    // Send Http request
    this.http
      .get(process.env['URL'])
      .pipe(map((responseData: { [key: string]: Post }) => {
        const postsArray: Post[] = [];
        for (const key in responseData[key]) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }
        return postsArray;
      }))
      .subscribe(posts => {
        console.log(posts);
      });
  }

  ClearPosts() {
    // Send Http request
  }

}
