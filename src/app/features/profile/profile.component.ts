import { Post } from './../timeline/components/posts/models/post.interface';
import { AuthService } from './../../core/auth/services/auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from './models/user.interface';
import { RouterLink } from '@angular/router';
import { DatePipe, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, DatePipe, NgTemplateOutlet],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);

  user = signal<User | null>(null);
  userId = signal('');
  myPosts = signal<Post[]>([]);
  bookMarked = signal<Post[]>([]);
  activeTab = signal<'saved' | 'posts'>('posts');
  coverImg = signal<File | null>(null);
  profileImg = signal<File | null>(null);
  coverSrc = signal('');
  profileSrc = signal('');
  removeCurrentCover = signal(false);
  removeCurrentphoto = signal(false);
  isViewingCover = signal<boolean>(false);
  isViewingProfilePhoto = signal<boolean>(false);

  ngOnInit(): void {
    this.getMyProfile();
  }

  getMyProfile(): void {
    this.authService.getMyProfile().subscribe({
      next: (res) => {
        console.log(res.data.user);
        this.user.set(res.data.user);
        this.getMyPosts(this.user()?._id!);
        this.getBookMarkedPosts();
      },
    });
  }

  getMyPosts(userId: string): void {
    this.authService.getUserPosts(userId).subscribe({
      next: (res) => {
        console.log(res.data.posts);
        this.myPosts.set(res.data.posts);
      },
    });
  }

  getBookMarkedPosts() {
    this.authService.getBookmarks().subscribe({
      next: (res) => {
        console.log(res.data.bookmarks);
        this.bookMarked.set(res.data.bookmarks);
      },
    });
  }

  changeFile(e: Event, isProfile: boolean = false): void {
    let input = e.target as HTMLInputElement;

    if (input.files && !isProfile) {
      this.coverImg.set(input.files[0]);
      this.coverSrc.set(URL.createObjectURL(input.files[0]));
    } else if (input.files && isProfile) {
      this.profileImg.set(input.files[0]);
      this.profileSrc.set(URL.createObjectURL(input.files[0]));
    }
  }

  cancelCoverPreview(): void {
    this.coverSrc.set('');
    this.coverImg.set(null);
  }

  removeCover(): void {
    this.removeCurrentCover.set(true);
    this.coverSrc.set('');
  }

  saveNewCover(e: SubmitEvent): void {
    e.preventDefault();
    const formData = new FormData();
    if (this.coverImg()) {
      formData.append('cover', this.coverImg()!);
    }

    if (this.removeCurrentCover()) {
      formData.append('removeCover', 'true');
    }

    this.authService.uploadCoverPhoto(formData).subscribe({
      next: (res) => {
        this.cancelCoverPreview();
        this.getMyProfile();
      },
    });
  }

  cancelProfilePreview(): void {
    this.profileSrc.set('');
    this.profileImg.set(null);
    this.removeCurrentphoto.set(false);
  }

  removeProfilePhoto(): void {
    this.removeCurrentphoto.set(true);
    this.profileSrc.set('');
  }

  saveNewProfilePhoto(e: Event): void {
    e.preventDefault();

    const formData = new FormData();
    if (this.profileImg()) {
      formData.append('photo', this.profileImg()!);
    }

    if (this.removeCurrentphoto()) {
      formData.append('removePhoto', 'true');
    }

    this.authService.uploadProfilePhoto(formData).subscribe({
      next: (res) => {
        this.cancelProfilePreview();
        this.getMyProfile();
      },
    });
  }
}
