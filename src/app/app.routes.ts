import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { TimelineComponent } from './features/timeline/timeline.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { authGuard } from './core/auth/guard/auth-guard';
import { guestGuard } from './core/auth/guard/guest-guard';
import { DetailsComponent } from './features/details/details.component';
import { PostsComponent } from './features/timeline/components/posts/posts.component';
import { UserprofileComponent } from './features/profile/components/userprofile/userprofile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: 'login', component: LoginComponent, title: 'Synapse | Login' },
      { path: 'register', component: RegisterComponent, title: 'Synapse | Register' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'my-profile', component: ProfileComponent, title: 'Synapse | My Profile' },
      {
        path: 'user-profile/:id',
        component: UserprofileComponent,
        title: 'Synapse | User Profile',
      },
      {
        path: 'timeline',
        component: TimelineComponent,
        children: [
          {
            path: '',
            component: PostsComponent,
            data: { source: 'feed' },
            title: 'Synapse | News Feed',
          },
          {
            path: 'my-posts',
            component: PostsComponent,
            data: { source: 'mine' },
            title: 'Synapse | My Posts',
          },
          {
            path: 'community',
            component: PostsComponent,
            data: { source: 'community' },
            title: 'Synapse | Community',
          },
          {
            path: 'saved',
            component: PostsComponent,
            data: { source: 'saved' },
            title: 'Synapse | Saved Posts',
          },
        ],
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        title: 'Synapse | Notifications',
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        title: 'Change Synapse | Change Password',
      },
      { path: 'postdetails/:id', component: DetailsComponent, title: 'Synapse | Post Details' },
    ],
  },
  { path: 'notfound', component: NotfoundComponent, title: 'Synapse | Page Not Found' },
  { path: '**', redirectTo: 'notfound', pathMatch: 'full' },
];
