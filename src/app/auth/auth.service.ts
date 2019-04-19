import { Injectable } from "@angular/core";
import { User } from "../users/user.gql-schema";
import { BehaviorSubject } from "rxjs";
import { first, map } from "rxjs/operators";
import { LoginGqlMutation } from "./gql-mutations/login-gql-mutation";
import { LogoutGqlMutation } from "./gql-mutations/logout-gql-mutation";
import { CurrentUserGqlQuery } from "./gql-queries/current-user-gql-query";
import { ResetPasswordGqlMutation } from "./gql-mutations/reset-password-gql-mutation";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public user: BehaviorSubject<User>;
  private localStorageKey: string;

  constructor(
    private loginGqlMutation: LoginGqlMutation,
    private logoutGqlMutation: LogoutGqlMutation,
    private currentUserGqlQuery: CurrentUserGqlQuery,
    private resetPasswordGqlMutation: ResetPasswordGqlMutation
  ) {
    this.localStorageKey = "auth-token"; // this is used graphql module also, todo make this an injectable value
    this.user = new BehaviorSubject(null);

    // if someone logs in successfully make sure we nullify the not logged in token
    // since that is no longer needed/valid and save the new token in session
    this.user.subscribe(user => {
      console.log("a", user);
      if (!user) {
        return;
      }

      this.setSession(user.token);
    });

    // if user logged in previously and hasnt logged off then their token is in session, fetch it and log them back in if possible
    this.loginUserFromSession();
  }

  public login(email: string, password: string) {
    this.loginGqlMutation
      .mutate({ email: email, password: password })
      .pipe(first())
      .pipe(map(res => res.data.login))
      .subscribe(user => this.user.next(user));
  }

  public logout() {
    this.logoutGqlMutation
      .mutate()
      .pipe(first())
      .subscribe(this.invalidateUser);
  }

  private getAndSetUser(token: string) {
    if (!token) {
      return;
    }

    this.currentUserGqlQuery
      .watch()
      .valueChanges.pipe(first())
      .pipe(map(res => res.data.currentUser))
      .subscribe(user => this.user.next(user));
  }

  private loginUserFromSession() {
    const token = localStorage.getItem(this.localStorageKey);
    console.log(token);
    if (token) {
      this.getAndSetUser(token);
    }
  }

  private setSession(token: string) {
    if (!token) {
      return;
    }

    localStorage.setItem(this.localStorageKey, token);
  }

  private invalidateUser() {
    this.user.next(null);
    localStorage.removeItem(this.localStorageKey);
  }

  private resetPassword(password: string) {
    this.resetPasswordGqlMutation
      .mutate({ password: password })
      .pipe(first())
      .subscribe();
  }
}
