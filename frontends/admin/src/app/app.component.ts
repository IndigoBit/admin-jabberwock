import { Component, OnInit, HostBinding, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { OverlayContainer } from "@angular/cdk/overlay";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  @HostBinding("class.light-theme") lightThemeBinding: boolean;
  @HostBinding("class.dark-theme") darkThemeBinding: boolean;
  protected currentTheme: string;
  private themeChanger: Subject<void>;
  private darkThemeClass: string;
  private lightThemeClass: string;

  constructor(private overlayContainer: OverlayContainer) {
    this.darkThemeClass = "dark-theme";
    this.lightThemeClass = "light-theme";
    this.currentTheme = this.darkThemeClass;
    this.lightThemeBinding = false;
    this.darkThemeBinding = true;
    this.themeChanger = new Subject();
  }

  ngOnInit(): void {
    // subscribe must be a lambda not the function call itself, else we wont have this.overlayContainer defined in the function
    this.themeChanger.subscribe(() => this.changeTheme());
  }

  ngOnDestroy(): void {
    this.themeChanger.unsubscribe();
  }

  invertTheme() {
    this.themeChanger.next();
  }

  private changeTheme() {
    // toggle current theme to get the new theme
    this.currentTheme =
      this.currentTheme === this.darkThemeClass
        ? this.lightThemeClass
        : this.darkThemeClass;

    // set the proper bindings so app-root as the right theme
    switch (this.currentTheme) {
      case this.lightThemeClass:
        this.lightThemeBinding = true;
        this.darkThemeBinding = false;
        break;
      case this.darkThemeClass:
      default:
        this.lightThemeBinding = false;
        this.darkThemeBinding = true;
        break;
    }

    // setup overlay to use the new theme on modals
    const overlayContainerClasses = this.overlayContainer.getContainerElement()
      .classList;

    overlayContainerClasses.remove(this.darkThemeClass);
    overlayContainerClasses.remove(this.lightThemeClass);

    overlayContainerClasses.add(this.currentTheme);
  }
}
