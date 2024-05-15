import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, catchError, map, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>()

  constructor(private http: HttpClient) { }

  createAndStorePost(title: string, content: string) {
    // ..
    const postData: Post = { title: title, content: content };
    this.http.post<{ name: string }>(
      process.env['URL'],
      postData, { observe: 'response' })
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });

  }

  fetchPosts() {
    // ..
    //
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: Post }>(process.env['URL'], {
        headers: new HttpHeaders({ "Custom-Header": 'Hello' }),
        params: searchParams
        // params: new HttpParams().set('print', 'pretty')
      })
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData[key]) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }
        return postsArray;
      }),
        catchError(errorRes => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );

  }

  deletePosts() {
    return this.http.delete(process.env['URL'],
      { observe: 'events' }).pipe(
        tap(event => {
          console.log(event)
          if (event == HttpEventType.Sent) {
            // ..
          }
          if (event == HttpEventType.Response) {
            console.log(event.body);
          }
        }));
  }
}
