import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { NavBarComponent } from "./navbar/nav-bar.component";
import { filter } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, NavBarComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    title = "personal-website";
    constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
        // Start at the top of the page upon refresh
        if (isPlatformBrowser(this.platformId)) {
            if ("scrollRestoration" in window.history) {
                window.history.scrollRestoration = "manual";
            }

            this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
                window.scrollTo(0, 0);
            });
        }
    }
}
