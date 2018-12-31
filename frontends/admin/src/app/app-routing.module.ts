import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationDetailComponent } from './organization-detail/organization-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: "organizations", component: OrganizationListComponent },
  { path: "organizations/:id", component: OrganizationDetailComponent },
  { path: "", redirectTo: "/organizations", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
