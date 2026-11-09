import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  signUp(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'users/signup', data);
  }

  signIn(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'users/signin', data);
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getsuggestedUsers(limit: number = 5, q: string = ''): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `users/suggestions?limit=${limit}&q=${q}`);
  }

  getUserProfile(userId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `users/${userId}/profile`);
  }

  getBookmarks(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'users/bookmarks');
  }

  followUser(userId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `users/${userId}/follow`, {});
  }

  changePassword(data: object): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + 'users/change-password', data);
  }

  uploadProfilePhoto(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'users/upload-photo', data);
  }

  uploadCoverPhoto(data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'users/upload-cover', data);
  }

  getMyProfile(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'users/profile-data');
  }

  getUserPosts(userId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `users/${userId}/posts`);
  }
}
