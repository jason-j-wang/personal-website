import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { NavigationHelper } from '../../helpers/navigationHelper';

@Component({
  selector: 'project',
  imports: [],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent implements AfterViewInit, OnDestroy {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private el: ElementRef,
    private navHelper: NavigationHelper
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private scrollHandler = () => {
    this.updateBackground();
  };

  ngAfterViewInit() {
    let doAnimation = false;
    if (
      this.navHelper.fromUrl !== '/projects' &&
      this.navHelper.fromUrl !== null
    ) {
      doAnimation = true;
    }

    if (this.isBrowser) {
      window.addEventListener('scroll', this.scrollHandler);

      if (doAnimation) {
        const content = this.el.nativeElement.querySelector('.project-start');
        content?.classList.remove('animate-end');
        content?.classList.add('animate-start');

        window.requestAnimationFrame(() => {
          content?.classList.add('animate-end');
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  updateBackground() {
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;

    const startColour = [9, 169, 200];
    const endColour = [0, 17, 34];

    const interpolated = startColour.map((start, i) =>
      Math.round(start + (endColour[i] - start) * scrollFraction)
    );

    document.body.style.backgroundColor = `rgb(${interpolated.join(',')})`;
  }
}
