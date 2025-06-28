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
    private contentHeight: number = -1;

    // variable for the beginning of projects section, used within the cloud transition
    inSky: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private el: ElementRef,
        private navHelper: NavigationHelper
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    private scrollHandler = () => {
        /* 
        ch = content height for scroll location
        vh = view height
        format:       html range,      scroll range
        Intro:
            start:     0 - 180vh,        0 - 1ch
            boat:      180 - 540vh,      1 - 3ch
        Clouds:        0 - 360vh,        0 - 2ch  
        waves:         450 - 540vh,    2.5 - 3ch
        */
        console.log(window.scrollY);
        this.updateBackground();
        this.updateProjectIntroCard();
        this.updateClouds();
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
            this.contentHeight = window.innerHeight * 0.9;

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
        const introStopAt = this.contentHeight;
        const projectStopAt = 4 * this.contentHeight;
        const oceanIntro = document.getElementById("ocean-intro");
        if (oceanIntro) {
            if (window.scrollY > projectStopAt) {
                // Out of range
                oceanIntro.classList.remove("visible");
                oceanIntro.classList.add("invisible");

                stickybits("#ocean-intro", {
                    stickyBitStickyOffset: 0,
                    useStickyClasses: false,
                });
            } else {
                // Within range
                oceanIntro.classList.remove("invisible");
                oceanIntro.classList.add("visible");

                stickybits("#ocean-intro", {
                    stickyBitStickyOffset: this.deviceHeight * 0.1,
                    useStickyClasses: true,
                });
            }

            if (window.scrollY > introStopAt) {
                this.inSky = false;
            } else {
                this.inSky = true;
            }
        }
    }

    updateClouds() {
        const fullCoverStart = this.contentHeight - 50;
        const fullCoverEnd = this.contentHeight + 50;
        const end = 2 * this.contentHeight;
        const scroll = window.scrollY;

        const leftCloud = document.getElementById("cloud-image-left");
        const rightCloud = document.getElementById("cloud-image-right");

        if (leftCloud && rightCloud) {
            if (scroll < fullCoverStart) {
                leftCloud.style.transform = `translateX(${-100 + (scroll / fullCoverStart) * 60}%)`;
                rightCloud.style.transform = `translateX(${100 - (scroll / fullCoverStart) * 60}%)`;
            } else if (fullCoverStart <= scroll && scroll <= fullCoverEnd) {
                leftCloud.style.transform = `translateX(-40%)`;
                rightCloud.style.transform = `translateX(40%)`;
            } else if (scroll <= end) {
                leftCloud.style.transform = `translateX(${
                    -40 - 60 * ((scroll - fullCoverEnd) / (end - fullCoverEnd))
                }%)`;
                rightCloud.style.transform = `translateX(${
                    40 + 60 * ((scroll - fullCoverEnd) / (end - fullCoverEnd))
                }%)`;
            } else {
                leftCloud.style.transform = `translateX(-100%)`;
                rightCloud.style.transform = `translateX(100%)`;
            }

            const cloudContainer = document.getElementById("cloud-container");

            if (cloudContainer) {
                if (scroll <= end) {
                    cloudContainer.style.display = "";
                } else {
                    cloudContainer.style.display = "none";
                }
            }
        }
    }
}
