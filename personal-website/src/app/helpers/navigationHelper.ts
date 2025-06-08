import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

// Determines where the previous route was
@Injectable({ providedIn: 'root' })
export class NavigationHelper {
  public fromUrl: string | null = null;

  constructor(router: Router) {
    router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.fromUrl = router.url;
      });
  }
}
