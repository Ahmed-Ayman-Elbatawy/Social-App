import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { Friend } from './models/friend.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-right',
  imports: [RouterLink],
  templateUrl: './side-right.component.html',
  styleUrl: './side-right.component.css',
})
export class SideRightComponent implements OnInit {
  private readonly authService = inject(AuthService);

  friends = signal<Friend[]>([]);
  limit = signal(5);

  ngOnInit(): void {
    this.getSuggestedUsers();
  }

  getSuggestedUsers(limit: number = 5, q: string = ''): void {
    this.authService.getsuggestedUsers(this.limit(), q).subscribe({
      next: (res) => {
        this.friends.set(res.data.suggestions);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  changeLimit(): void {
    this.limit.set(this.limit() + 5);
    this.getSuggestedUsers();
  }

  followUser(userId: string): void {
    this.authService.followUser(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.getSuggestedUsers();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  searchUser(e: Event): void {
    const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
    this.getSuggestedUsers(this.limit(), searchTerm);
  }
}
