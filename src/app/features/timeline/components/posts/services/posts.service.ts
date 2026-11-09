import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getAllPosts(page: number = 1, limit: number = 20): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts?page=${page}&limit=${limit}`);
  }

  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts/${postId}`);
  }

  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `posts/${postId}`);
  }

  createPost(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts`, data);
  }

  likePost(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/like`, {});
  }
  savePost(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/bookmark`, {});
  }

  getCommunityPosts(path: string, limit: number = 10): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts/feed?only=${path}&limit=${limit}`);
  }

  getPostLikes(postId: string, page: number = 1, limit: number = 20): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `posts/${postId}/likes?page=${page}&limit=${limit}`,
    );
  }

  sharePost(postId: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts/${postId}/share`, data);
  }

  updatePost(postId: string, data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}`, data);
  }
}
