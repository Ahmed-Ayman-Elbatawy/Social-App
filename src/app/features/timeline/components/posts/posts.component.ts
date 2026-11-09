import { AuthService } from './../../../../core/auth/services/auth.service';
import { PostsService } from './services/posts.service';
import { Component, inject, OnInit, output, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Post } from './models/post.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentsComponent } from './components/comments/comments.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../profile/models/user.interface';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-posts',
  imports: [ReactiveFormsModule, CommentsComponent, RouterLink, InfiniteScrollDirective, DatePipe],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly source = this.route.snapshot.data['source'] as 'feed' | 'mine' | 'community' | 'saved';

  allPosts = signal<Post[]>([]);

  loading = signal(false);
  hasMorePosts = signal(true);
  page = 1;

  user = signal(JSON.parse(localStorage.getItem('user')!));

  file = signal<File | null>(null);

  postLikes = signal<User[]>([]);

  shareBody = new FormControl('', Validators.required);

  content = new FormControl('', Validators.required);
  privacy = new FormControl<'public' | 'following' | 'only_me'>('public');
  imgSrc = signal('');
  editImage = signal('');
  editFile = signal<File | null>(null);
  editContent = new FormControl('', Validators.required);
  removeCurrentImage = signal(false);
  editPrivacy = new FormControl<'public' | 'following' | 'only_me'>('public');

  commentCountChange = output<number>();

  ngOnInit(): void {
    this.getPostsData();
  }

  getPostsData(): void {
    this.loadPosts().subscribe({
      next: (res) => {
        console.log(res.data.posts);
        if (this.source === 'saved') {
          this.allPosts.set(res.data.bookmarks);
        } else {
          this.allPosts.set(res.data.posts);
        }
        setTimeout(() => initFlowbite(), 0);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  changeFile(e: Event, isEditing: boolean = false): void {
    let input = e.target as HTMLInputElement;

    if (input.files && !isEditing) {
      this.file.set(input.files[0]);
      this.imgSrc.set(URL.createObjectURL(input.files[0]));
    } else if (input.files && isEditing) {
      this.editFile.set(input.files[0]);
      this.editImage.set(URL.createObjectURL(input.files[0]));
    }
  }

  removePreview(): void {
    this.imgSrc.set('');
    this.file.set(null);
  }

  removeAllImage(): void {
    this.editImage.set('');
    this.editFile.set(null);
    this.removeCurrentImage.set(true);
  }

  submitForm(e: SubmitEvent): void {
    e.preventDefault();

    let formData = new FormData();

    if (this.content.value) {
      formData.append('body', this.content.value);
    }
    if (this.privacy.value) {
      formData.append('privacy', this.privacy.value);
    }
    if (this.file()) {
      formData.append('image', this.file()!);
    }

    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.removePreview();
        this.getPostsData();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.removePreview();
        (e.target as HTMLFormElement).reset();
      },
    });
  }

  deletePost(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        this.getPostsData();
      },
    });
  }

  likePost(postId: string): void {
    this.postsService.likePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        this.getPostsData();
      },
    });
  }

  savePost(postId: string): void {
    this.postsService.savePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        this.getPostsData();
      },
    });
  }

  getCommunityPosts(path: string, limit: number = 10): void {
    this.postsService.getCommunityPosts(path, limit).subscribe({
      next: (res) => {
        console.log(res.data.posts);
        this.allPosts.set(res.data.posts);
        setTimeout(() => initFlowbite(), 0);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private loadPosts() {
    switch (this.source) {
      case 'mine':
        return this.authService.getUserPosts(this.user()._id);
      case 'community':
        return this.postsService.getAllPosts();
      case 'saved':
        return this.authService.getBookmarks();
      default:
        return this.postsService.getCommunityPosts('following');
    }
  }

  emojis = [
    '😀',
    '😂',
    '😍',
    '🥰',
    '😎',
    '🤩',
    '😢',
    '😭',
    '😡',
    '🤔',
    '🙄',
    '😴',
    '🤗',
    '😇',
    '🥳',
    '😜',
    '👍',
    '👎',
    '👏',
    '🙌',
    '🙏',
    '💪',
    '🤝',
    '✌️',
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '💔',
    '🔥',
    '✨',
    '🎉',
    '💯',
    '⭐',
    '⚡',
    '🧠',
    '🩺',
    '🦴',
    '💻',
    '🚀',
    '☕',
    '🌱',
    '🌙',
    '☀️',
    '📚',
  ];

  addEmoji(emoji: string, isEditing: boolean = false): void {
    if (isEditing) {
      this.editContent.setValue((this.editContent.value ?? '') + emoji);
    } else {
      this.content.setValue((this.content.value ?? '') + emoji);
    }
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

  sharePost(postId: string, e: SubmitEvent): void {
    e.preventDefault();

    let bodyValue = this.shareBody.value;

    this.postsService.sharePost(postId, { body: bodyValue }).subscribe({
      next: (res) => {
        console.log('Shared successfully:', res);
        this.getPostsData();
      },
      error: (err) => {
        console.log('Error sharing post:', err);
      },
      complete: () => {
        this.shareBody.setValue('');
      },
    });
  }

  updatePost(e: SubmitEvent, postId: string): void {
    e.preventDefault();
    const formData = new FormData();
    if (this.editContent.value) {
      formData.append('body', this.editContent.value);
    }

    if (this.editFile() && !this.removeCurrentImage()) {
      formData.append('image', this.editFile()!);
    }
    if (this.removeCurrentImage()) {
      formData.append('removeImage', 'true');
    }
    if (this.editPrivacy.value) {
      formData.append('privacy', this.editPrivacy.value);
    }

    this.postsService.updatePost(postId, formData).subscribe({
      next: (res) => {
        console.log('Post updated successfully:', res);
        this.editContent.setValue('');
        this.getPostsData();
      },
      error: (err) => {
        console.log('Error updating post:', err);
      },
    });
  }

  updatePostPrivacy(postId: string, privacy: 'public' | 'following' | 'only_me'): void {
    this.postsService.updatePost(postId, { privacy }).subscribe({
      next: (res) => {
        console.log('Post privacy updated successfully:', res);
        this.getPostsData();
      },
      error: (err) => {
        console.log('Error updating post privacy:', err);
      },
    });
  }

  editPost(post: Post): void {
    this.editContent.setValue(post.body ?? '');
    this.editPrivacy.setValue((post.privacy as 'public' | 'following' | 'only_me') ?? 'public');

    post.isEditing = true;
    setTimeout(() => initFlowbite(), 0);
  }

  cancelEdit(post: Post): void {
    post.isEditing = false;
  }

  private readonly router = inject(Router);

  loadMorePosts(): void {
    const currentUrl = this.router.url.toLowerCase();

    const isTimelineRoute = currentUrl.includes('saved') || currentUrl.includes('my-posts');

    if (this.loading() || !this.hasMorePosts() || isTimelineRoute) {
      return;
    }

    this.loading.set(true);

    this.postsService.getAllPosts(this.page, 20).subscribe({
      next: (res) => {
        const posts = res.data.posts;

        this.allPosts.update((currentPosts) => [...currentPosts, ...posts]);
        this.hasMorePosts.set(posts.length === 20);
        this.page++;
        this.loading.set(false);
        setTimeout(() => initFlowbite(), 0);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
