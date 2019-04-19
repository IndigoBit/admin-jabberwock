import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { UserListComponent } from "./users/components/user-list/user-list.component";
import { UserDetailComponent } from "./users/components/user-detail/user-detail.component";
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/components/login/login.component";

const routes: Routes = [
  // non-guarded
  { path: "login", component: LoginComponent },

  // guarded
  { path: "users", component: UserListComponent, canActivate: [AuthGuard] },
  {
    path: "users/:id",
    component: UserDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },

  // redirects
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "logged-in", redirectTo: "/home", pathMatch: "full" },

  // 404
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
