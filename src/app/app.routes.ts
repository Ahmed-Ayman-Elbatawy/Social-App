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
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'my-profile', component: ProfileComponent },
      { path: 'user-profile/:id', component: UserprofileComponent },
      {
        path: 'timeline',
        component: TimelineComponent,
        children: [
          { path: '', component: PostsComponent, data: { source: 'feed' } },
          { path: 'my-posts', component: PostsComponent, data: { source: 'mine' } },
          { path: 'community', component: PostsComponent, data: { source: 'community' } },
          { path: 'saved', component: PostsComponent, data: { source: 'saved' } },
        ],
      },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'postdetails/:id', component: DetailsComponent },
    ],
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: 'notfound', pathMatch: 'full' },
];
