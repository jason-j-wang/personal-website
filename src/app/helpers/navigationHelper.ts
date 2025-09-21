import { Injectable } from "@angular/core";

// Stores where the previous route was
// Literally just a state holder
@Injectable({ providedIn: "root" })
export class NavigationHelper {
    public fromUrl: string | null = null;
}
