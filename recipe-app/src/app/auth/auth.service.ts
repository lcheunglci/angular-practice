import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  loadId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    const signUpUrl = `https://www.googleapis.com/identitytoolkit/v3/relyingpartt/signupNewUser?key=[${process.env['API_KEY']}]`;

    return this.http.post<AuthResponseData>(signUpUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }
    );
  }
}
