import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AuthService } from "../../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  protected formController: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.authService.user.subscribe(user => {
      console.log("re", user);

      if (user) {
        return this.router.navigate(["logged-in"]);
      }
    });

    this.formController = this.fb.group({
      email: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(255)])
      ],
      password: ["", Validators.compose([Validators.required])]
    });
  }

  login() {
    this.authService.login(
      this.formController.value.email,
      this.formController.value.password
    );
  }
}
