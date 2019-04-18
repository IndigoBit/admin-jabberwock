import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // todo: add redirect ability on guard check fail
    return this.authService.user.pipe(
      map(user => {
        console.log("in guard");

        if (user && user._id && user.token) {
          return true;
        }

        this.router.navigate(["login"]);
        return false;
      })
    );
  }
}
