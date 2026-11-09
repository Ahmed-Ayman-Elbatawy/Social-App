import { RouterLink } from '@angular/router';
import { Notification } from './models/notification.interface';
import { NotificationService } from './services/notification.service';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-notifications',
  imports: [RouterLink, DatePipe, InfiniteScrollDirective],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  allNotification = signal<Notification[]>([]);
  unReadNotification = signal<Notification[]>([]);
  activeTab = signal<'all' | 'unread'>('all');
  unReadCount = signal(0);
  isFollowing = signal(false);

  loading = signal(false);
  hasMore = signal(true);
  page = 1;
  private readonly limit = 20;

  ngOnInit(): void {
    this.getAllNotification();
    this.getUnreadNotification();
    this.getUnreadCount();
  }

  getAllNotification(): void {
    this.notificationService.getNotification(true, this.limit, this.page).subscribe({
      next: (res) => {
        this.allNotification.set(res.data.notifications);
        this.hasMore.set(res.data.notifications.length === this.limit);
        this.page++;
      },
    });
  }

  getUnreadNotification(): void {
    this.notificationService.getNotification(false, 20, 1).subscribe({
      next: (res) => {
        this.unReadNotification.set(res.data.notifications);
        this.hasMore.set(res.data.notifications.length === this.limit);
        this.page++;
      },
    });
  }

  markAllNotification(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.getAllNotification();
        this.getUnreadNotification();
        this.getUnreadCount();
      },
    });
  }

  markSingleNotification(id: string): void {
    this.notificationService.markNotificationAsRead(id).subscribe({
      next: () => {
        this.getUnreadNotification();
        this.getUnreadCount();
      },
    });
  }

  getUnreadCount(): void {
    this.notificationService.getUnreadNotifiationCount().subscribe({
      next: (res) => {
        this.unReadCount.set(res.data.unreadCount);
        this.getAllNotification();
      },
    });
  }

  loadMore(): void {
    if (this.loading() || !this.hasMore()) return;
    this.loading.set(true);

    this.notificationService.getNotification(true, this.limit, this.page).subscribe({
      next: (res) => {
        const items = res.data.notifications;

        this.allNotification.update((old) => [...old, ...items]);
        this.hasMore.set(items.length === this.limit);
        this.page++;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  followUser(userId: string): void {
    this.authService.followUser(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllNotification();
        this.getUnreadCount();
        this.getUnreadNotification();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
