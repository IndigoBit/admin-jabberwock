import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { UserListComponent } from "./users/components/user-list/user-list.component";
import { UserDetailComponent } from "./users/components/user-detail/user-detail.component";

const routes: Routes = [
  { path: "users", component: UserListComponent },
  { path: "users/:id", component: UserDetailComponent },
  { path: "", redirectTo: "/users", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
