import { isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID } from "@angular/core";
import { NavigationHelper } from "../../helpers/navigationHelper";
import stickybits from "stickybits";

@Component({
    selector: "project",
    imports: [],
    templateUrl: "./project.component.html",
    styleUrl: "./project.component.scss",
})
export class ProjectComponent implements AfterViewInit, OnDestroy {
    private isBrowser: boolean;
    private deviceHeight: number = -1;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private el: ElementRef,
        private navHelper: NavigationHelper
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    private scrollHandler = () => {
        console.log(window.scrollY);
        this.updateBackground();
        this.updateProjectIntroCard();
    };

    ngAfterViewInit() {
        let doAnimation = false;

        if (
            this.navHelper.fromUrl !== "/projects" &&
            this.navHelper.fromUrl !== null &&
            this.navHelper.fromUrl !== "/"
        ) {
            doAnimation = true;
        }

        if (this.isBrowser) {
            this.deviceHeight = window.innerHeight;

            window.addEventListener("scroll", this.scrollHandler);

            if (doAnimation) {
                const content = this.el.nativeElement.querySelector(".project-start");
                content?.classList.remove("animate-end");
                content?.classList.add("animate-start");

                window.requestAnimationFrame(() => {
                    content?.classList.add("animate-end");
                });
            }
        }
    }

    ngOnDestroy() {
        if (this.isBrowser) {
            window.removeEventListener("scroll", this.scrollHandler);
        }
    }

    updateBackground() {
        const scrollTop = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollFraction = scrollTop / maxScroll;

        const startColour = [9, 169, 200];
        const endColour = [0, 17, 34];

        const interpolated = startColour.map((start, i) => Math.round(start + (endColour[i] - start) * scrollFraction));

        document.body.style.backgroundColor = `rgb(${interpolated.join(",")})`;
    }

    updateProjectIntroCard() {
        const heightOffset = this.deviceHeight * 0.9 * 0.25;

        const stopAt = 600;
        const div = document.getElementById("project-intro");
        const boat = document.getElementById("project-boat");
        if (div && boat) {
            if (window.scrollY > stopAt) {
                // Out of range
                div.classList.remove("visible");
                div.classList.add("invisible");

                boat.classList.remove("visible");
                boat.classList.add("invisible");

                stickybits("#project-intro", {
                    stickyBitStickyOffset: 0,
                    useStickyClasses: false,
                });

                stickybits("#project-boat", {
                    stickyBitStickyOffset: 0,
                    useStickyClasses: false,
                });
            } else {
                // Within range
                div.classList.remove("invisible");
                div.classList.add("visible");

                boat.classList.remove("invisible");
                boat.classList.add("visible");

                stickybits("#project-intro", {
                    stickyBitStickyOffset: heightOffset + this.deviceHeight * 0.1,
                    useStickyClasses: true,
                });

                stickybits("#project-boat", {
                    stickyBitStickyOffset: heightOffset + this.deviceHeight * 0.2,
                    useStickyClasses: true,
                });
            }
        }
    }
}
