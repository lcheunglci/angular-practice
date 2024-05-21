import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  loadId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    const signUpUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[${process.env['API_KEY']}]`;

    return this.http.post<AuthResponseData>(signUpUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    ).pipe(catchError(errorRes => {
      let errorMessage = 'An unknown error occurred!';
      if (!errorRes.error || !errorRes.error.error) {
        return throwError(errorMessage);
      }
      switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = "This email exists already";
      }

      return throwError(errorMessage);
    }
    ))

  }


  login(email: string, password: string) {
    const loginUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[${process.env['API_KEY']}]`;

    return this.http.post<AuthResponseData>(loginUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true
      })
  }
}
