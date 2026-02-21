import { Routes } from '@angular/router';
import { LoginComponent } from './featuers/auth/login/login.component';
import { DashboardLayoutComponent } from './featuers/app-dashboard-layout/app-dashboard-layout.component';
import { AuthGuard } from './core/auth.guard';
import { ProjectsComponent } from './featuers/projects-component/projects-component.component';
import { CategoriesComponent } from './featuers/categories/categories.component';
import { AdminsComponent } from './featuers/admin/admin.component';
import { MessagesComponent } from './featuers/messages/messages.component';
import { VideoUploadComponent } from './featuers/video-upload/video-upload.component';
import { TeamMemberTableComponent } from './featuers/team/team.component';
import { CommentTableComponent } from './featuers/comments/comment.component';
import { PortifilioComponent } from './featuers/portifilio/portifilio.component';
import { OurClientsComponent } from './featuers/our-clients/our-clients.component';
import { AboutUsComponent } from './featuers/about-us/about-us.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'projects', component: ProjectsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'admins', component: AdminsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'Video', component: VideoUploadComponent },
      { path: 'team', component: TeamMemberTableComponent },
      { path: 'comments', component: CommentTableComponent },
      { path: 'portifilio', component: PortifilioComponent },
      { path: 'our-clients', component: OurClientsComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
