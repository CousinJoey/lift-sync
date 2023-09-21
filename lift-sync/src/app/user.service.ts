import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl + '/register', userData);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', data);
  }
}
