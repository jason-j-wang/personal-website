import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'nav-bar',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetBackgroundColour(): void {
    const startColour = [9, 169, 200];
    document.body.style.backgroundColor = `rgb(${startColour.join(',')})`;
  }
}