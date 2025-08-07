import { Component } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

@Component({
    selector: "home",
    imports: [FontAwesomeModule],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent {
    faGithub = faGithub;
    faLinkedin = faLinkedin;
}
