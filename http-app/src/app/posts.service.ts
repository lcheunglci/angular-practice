import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>()

  constructor(private http: HttpClient) { }

  createAndStorePost(title: string, content: string) {
    // ..
    const postData: Post = { title: title, content: content };
    this.http.post<{ name: string }>(
      process.env['URL'],
      postData).subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });

  }

  fetchPosts() {
    // ..
    //
    return this.http
      .get<{ [key: string]: Post }>(process.env['URL'])
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData[key]) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }
        return postsArray;
      }));

  }

  deletePosts() {
    return this.http.delete(process.env['URL']);
  }
}
