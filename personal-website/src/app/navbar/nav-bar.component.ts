import { Component } from "@angular/core";
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { NavigationHelper } from "../helpers/navigationHelper";

@Component({
    selector: "nav-bar",
    imports: [RouterOutlet, RouterModule],
    templateUrl: "./nav-bar.component.html",
    styleUrl: "./nav-bar.component.scss",
})
export class NavBarComponent {
    title = "";
    constructor(private navHelper: NavigationHelper, private router: Router) {}

    ngAfterViewInit() {
        console.log(window.location.href);
        const title = window.location.href.split("/").slice(-1)[0];
        this.title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    resetBackgroundColour(): void {
        const startColour = [0, 162, 232];
        document.body.style.backgroundColor = `rgb(${startColour.join(",")})`;
    }

    updateUrl(title: string): void {
        const fullUrl = this.router.url;
        this.navHelper.fromUrl = fullUrl;
        this.title = title;
    }
}
