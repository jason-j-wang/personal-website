import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home/home.component";
import { ProjectComponent } from "./projects/project/project.component";
import { ExperienceComponent } from "./experience/experience/experience.component";

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "experience", component: ExperienceComponent },
    { path: "projects", component: ProjectComponent },
];
