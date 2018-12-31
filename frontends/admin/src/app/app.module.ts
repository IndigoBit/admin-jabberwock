import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { ReactiveFormsModule } from "@angular/forms";
import { LayoutModule } from "@angular/cdk/layout";
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule
} from "@angular/material";
import { AvatarModule } from "ng2-avatar";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GraphQLModule } from "./graphql.module";
import { OrganizationListComponent } from "./organization-list/organization-list.component";
import { OrganizationDetailComponent } from "./organization-detail/organization-detail.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { OrganizationDetailEditModeComponent } from "./organization-detail-edit-mode/organization-detail-edit-mode.component";
import { OrganizationDetailUserListComponent } from "./organization-detail-user-list/organization-detail-user-list.component";

@NgModule({
  declarations: [
    AppComponent,
    OrganizationListComponent,
    OrganizationDetailComponent,
    PageNotFoundComponent,
    OrganizationDetailEditModeComponent,
    OrganizationDetailUserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    LayoutModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    AvatarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
