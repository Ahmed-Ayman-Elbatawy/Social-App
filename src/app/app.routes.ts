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
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: 'register', component: RegisterComponent, title: 'Register' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'my-profile', component: ProfileComponent, title: 'My Profile' },
      { path: 'user-profile/:id', component: UserprofileComponent, title: 'User Profile' },
      {
        path: 'timeline',
        component: TimelineComponent,
        children: [
          { path: '', component: PostsComponent, data: { source: 'feed' }, title: 'News Feed' },
          {
            path: 'my-posts',
            component: PostsComponent,
            data: { source: 'mine' },
            title: 'My Posts',
          },
          {
            path: 'community',
            component: PostsComponent,
            data: { source: 'community' },
            title: 'Community',
          },
          {
            path: 'saved',
            component: PostsComponent,
            data: { source: 'saved' },
            title: 'Saved Posts',
          },
        ],
      },
      { path: 'notifications', component: NotificationsComponent, title: 'Notifications' },
      { path: 'change-password', component: ChangePasswordComponent, title: 'Change Password' },
      { path: 'postdetails/:id', component: DetailsComponent, title: 'Post Details' },
    ],
  },
  { path: 'notfound', component: NotfoundComponent, title: 'Page Not Found' },
  { path: '**', redirectTo: 'notfound', pathMatch: 'full' },
];
