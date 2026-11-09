import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  getAllComments(postId: string, page: number = 1, limit: number = 10): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `posts/${postId}/comments?page=${page}&limit=${limit}`,
    );
  }

  createComment(postId: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts/${postId}/comments`, data);
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `posts/${postId}/comments/${commentId}`);
  }

  getCommentReplies(
    postId: string,
    commentId: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl +
        `posts/${postId}/comments/${commentId}/replies?page=${page}&limit=${limit}`,
    );
  }

  createCommentReply(postId: string, commentId: string, data: object): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `posts/${postId}/comments/${commentId}/replies`,
      data,
    );
  }

  deleteCommentReply(postId: string, commentId: string, replyId: string): Observable<any> {
    return this.httpClient.delete(
      environment.baseUrl + `posts/${postId}/comments/${commentId}/replies/${replyId}`,
    );
  }
  updateComment(postId: string, commentId: string, data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/comments/${commentId}`, data);
  }

  updateReply(postId: string, replyId: string, data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/comments/${replyId}`, data);
  }
  likeComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + `posts/${postId}/comments/${commentId}/like`,
      {},
    );
  }
}
