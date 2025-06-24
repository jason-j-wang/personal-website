import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home/home.component";
import { ProjectComponent } from "./projects/project/project.component";

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "projects", component: ProjectComponent },
];
