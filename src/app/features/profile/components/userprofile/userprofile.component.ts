import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from './../../../../core/auth/services/auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../models/user.interface';
import { DatePipe, Location } from '@angular/common';
import { Post } from '../../../timeline/components/posts/models/post.interface';
import { CommentsComponent } from '../../../timeline/components/posts/components/comments/comments.component';
import { PostsService } from '../../../timeline/components/posts/services/posts.service';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-userprofile',
  imports: [RouterLink, CommentsComponent, ReactiveFormsModule, DatePipe],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css',
})
export class UserprofileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly postsService = inject(PostsService);

  isFollowing = signal<boolean>(false);
  user = signal<User | null>(null);
  followers = signal<User[]>([]);
  allPosts = signal<Post[]>([]);
  postLikes = signal<User[]>([]);
  shareBody = new FormControl('', Validators.required);

  logedUser = signal(JSON.parse(localStorage.getItem('user')!));

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getUserProfile(params.get('id')!);
    });
  }

  getUserProfile(userId: string): void {
    this.authService.getUserProfile(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.isFollowing.set(res.data.isFollowing);
        this.user.set(res.data.user);
        this.followers.set(res.data.user.followers);
        console.log(res.data.user);
        this.getUserPosts(this.user()?._id!);
      },
    });
  }

  getUserPosts(userId: string): void {
    this.authService.getUserPosts(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.allPosts.set(res.data.posts);
        setTimeout(() => initFlowbite(), 0);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  savePost(postId: string, userId: string): void {
    this.postsService.savePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        this.getUserPosts(userId);
      },
    });
  }
  getPostLikes(postId: string, page: number = 1, limit: number = 20): void {
    this.postsService.getPostLikes(postId, page, limit).subscribe({
      next: (res) => {
        this.postLikes.set(res.data.likes);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  sharePost(postId: string, e: SubmitEvent, userId: string): void {
    e.preventDefault();

    let bodyValue = this.shareBody.value;

    this.postsService.sharePost(postId, { body: bodyValue }).subscribe({
      next: (res) => {
        console.log('Shared successfully:', res);
        this.getUserPosts(userId);
      },
      error: (err) => {
        console.log('Error sharing post:', err);
      },
      complete: () => {
        this.shareBody.setValue('');
      },
    });
  }
  likePost(postId: string, userId: string): void {
    this.postsService.likePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        this.getUserPosts(userId);
      },
    });
  }
  followUser(userId: string): void {
    this.authService.followUser(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.getUserProfile(userId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
