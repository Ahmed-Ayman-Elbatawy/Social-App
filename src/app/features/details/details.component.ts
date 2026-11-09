import { PostsService } from './../timeline/components/posts/services/posts.service';
import { Component, inject, input, OnInit, Signal, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../timeline/components/posts/models/post.interface';
import { CommentsComponent } from '../timeline/components/posts/components/comments/comments.component';
import { Location } from '@angular/common';
import { PostsComponent } from '../timeline/components/posts/posts.component';

@Component({
  selector: 'app-details',
  imports: [RouterLink, CommentsComponent, CommentsComponent, PostsComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly postsService = inject(PostsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  postData = signal<Post>({} as Post);
  userId = signal(JSON.parse(localStorage.getItem('user')!)._id);
  commentCount = input.required<number>();

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getSinglePost(params.get('id')!);
    });
  }

  getSinglePost(id: string): void {
    this.postsService.getSinglePost(id).subscribe({
      next: (res) => {
        this.postData.set(res.data.post);
        setTimeout(() => initFlowbite(), 0);
      },
      error: (err) => {},
    });
  }

  deletePost(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        this.location.back();
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
