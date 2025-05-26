import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'project',
  imports: [],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements AfterViewInit, OnDestroy {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private scrollHandler = () => {
    console.log('scroll event fired');
    this.updateBackground();
  };

  ngAfterViewInit() {
    if (this.isBrowser) {
      console.log("added slitener");
      window.addEventListener('scroll', this.scrollHandler);
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  updateBackground() {
    console.log('here');
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;

    const startColor = [9, 169, 200];  // Tailwind blue-500
    const endColor = [0, 31, 61];    // Tailwind purple-500

    const interpolated = startColor.map((start, i) =>
      Math.round(start + (endColor[i] - start) * scrollFraction)
    );

    document.body.style.backgroundColor = `rgb(${interpolated.join(',')})`;
  }
}
