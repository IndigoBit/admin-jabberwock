import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCardModule } from "@angular/material/card";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
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
  MatRadioModule,
  MatTabsModule,
  MatMenuModule,
  MatExpansionModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatProgressBarModule
} from "@angular/material";
import { AvatarModule } from "ng2-avatar";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GraphQLModule } from "./graphql.module";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { UserListComponent } from "./users/components/user-list/user-list.component";
import { UserDetailComponent } from "./users/components/user-detail/user-detail.component";
import { InlineTextEditComponent } from "./shared/inline-text-edit/inline-text-edit.component";
import { DestroyConfirmationDialogComponent } from "./shared/destroy-confirmation-dialog/destroy-confirmation-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserDetailComponent,
    PageNotFoundComponent,
    InlineTextEditComponent,
    DestroyConfirmationDialogComponent
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
    MatTooltipModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    AvatarModule.forRoot()
  ],
  entryComponents: [DestroyConfirmationDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
