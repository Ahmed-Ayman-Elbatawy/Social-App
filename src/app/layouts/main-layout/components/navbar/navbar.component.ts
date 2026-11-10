import { AuthService } from './../../../../core/auth/services/auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NotificationService } from '../../../../features/notifications/services/notification.service';
import { User } from '../../../../features/profile/models/user.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  localUser = signal(JSON.parse(localStorage.getItem('user') || '{}'));
  user = signal<User | null>(null);

  ngOnInit(): void {
    initFlowbite();
    this.getUnreadCount();
    setInterval(() => {
      this.getUnreadCount();
    }, 1000);
  }

  logOut(): void {
    this.authService.logOut();
  }

  getMyProfile(): void {
    this.authService.getMyProfile().subscribe({
      next: (res) => {
        console.log(res.data.user);
        this.user.set(res.data.user);
      },
    });
  }

  notificationCount = signal(0);
  getUnreadCount(): void {
    this.notificationService.getUnreadNotifiationCount().subscribe({
      next: (res) => {
        this.notificationCount.set(res.data.unreadCount);
      },
    });
  }
}
