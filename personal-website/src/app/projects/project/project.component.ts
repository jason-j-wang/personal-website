import { isPlatformBrowser } from "@angular/common";
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID } from "@angular/core";
import { NavigationHelper } from "../../helpers/navigationHelper";
import stickybits from "stickybits";
import { HttpClient } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

interface LeetcodeData {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
}

@Component({
    selector: "project",
    imports: [FontAwesomeModule],
    templateUrl: "./project.component.html",
    styleUrl: "./project.component.scss",
})
export class ProjectComponent implements AfterViewInit, OnDestroy {
    private isBrowser: boolean;
    private deviceHeight: number = -1;
    private contentHeight: number = -1;
    private ratio: number = 1;
    private navBarHeight: number = 0;
    private prevScroll: number = 0;

    totalQuestions = 0;
    easyQuestions = 0;
    mediumQuestions = 0;
    hardQuestions = 0;

    faGithub = faGithub;

    // variable for the beginning of projects section, used within the cloud transition
    inSky: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private el: ElementRef,
        private navHelper: NavigationHelper,
        private http: HttpClient
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.animateFish = this.animateFish.bind(this);
    }

    private scrollHandler = () => {
        this.updateElements();
    };

    updateElements() {
        this.updateBackground();
        this.updateProjectIntroCard();
        this.updateClouds();
        this.updateProjects();
        this.updateScrollFish();
    }

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
            this.ratio = window.devicePixelRatio;
            this.deviceHeight = window.innerHeight * this.ratio;
            this.contentHeight = window.innerHeight * 0.9 * this.ratio;
            document.documentElement.style.setProperty("--zoom-ratio", `${this.ratio}`);

            const navBar = document.querySelector("nav-bar");
            if (navBar) {
                this.navBarHeight = navBar.getBoundingClientRect().height;
            }

            window.addEventListener("scroll", this.scrollHandler);

            window.addEventListener("resize", () => {
                const currentRatio = window.devicePixelRatio;

                if (currentRatio !== this.ratio) {
                    this.ratio = currentRatio;
                    this.deviceHeight = window.innerHeight * this.ratio;
                    this.contentHeight = window.innerHeight * 0.9 * this.ratio;
                    document.documentElement.style.setProperty("--zoom-ratio", `${currentRatio}`);
                }

                const navBar = document.querySelector("nav-bar");
                if (navBar) {
                    this.navBarHeight = navBar.getBoundingClientRect().height;
                }
            });

            if (doAnimation) {
                const content = this.el.nativeElement.querySelector(".project-start");
                content?.classList.remove("animate-end");
                content?.classList.add("animate-start");

                window.requestAnimationFrame(() => {
                    content?.classList.add("animate-end");
                });
            }

            this.fetchLeetcodeStats();
            this.animateFish();
        }
    }

    fetchLeetcodeStats() {
        const url = "https://leetscan.vercel.app/jason--w";
        const data = this.http.get(url).subscribe({
            next: (data) => {
                const lcData = data as LeetcodeData;
                this.totalQuestions = lcData.totalSolved;
                this.easyQuestions = lcData.easySolved;
                this.mediumQuestions = lcData.mediumSolved;
                this.hardQuestions = lcData.hardSolved;
            },
            error: (err) => {},
        });
    }

    ngOnDestroy() {
        if (this.isBrowser) {
            window.removeEventListener("scroll", this.scrollHandler);
        }
    }

    updateBackground() {
        const scroll = window.scrollY;
        const startHeight = this.contentHeight * 5.5;
        const maxScroll = document.body.scrollHeight - window.innerHeight - this.contentHeight;

        const scrollFraction = (scroll - startHeight) / (maxScroll - startHeight);

        const startColour = [0, 88, 197];
        const endColour = [19, 40, 89];

        if (scroll >= this.contentHeight) {
            document.body.style.backgroundColor = `rgb(${startColour.join(",")})`;
        }

        if (scroll >= startHeight && scroll <= maxScroll) {
            const interpolated = startColour.map((start, i) =>
                Math.round(start + (endColour[i] - start) * scrollFraction)
            );
            document.body.style.backgroundColor = `rgb(${interpolated.join(",")})`;
        } else if (scroll > maxScroll) {
            document.body.style.backgroundColor = `rgb(${endColour.join(",")})`;
        }
    }

    updateProjectIntroCard() {
        const introStopAt = this.contentHeight;
        const projectStopAt = 3.75 * this.contentHeight;
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
                    stickyBitStickyOffset: this.navBarHeight,
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
        let pctCover = 80;
        if (window.innerWidth <= 500) {
            pctCover = 90;
        }

        const pctUncovered = 100 - pctCover;

        const leftCloud = document.getElementById("cloud-image-left");
        const rightCloud = document.getElementById("cloud-image-right");

        if (leftCloud && rightCloud) {
            if (scroll < fullCoverStart) {
                leftCloud.style.transform = `translateX(${-100 + (scroll / fullCoverStart) * pctCover}%)`;
                rightCloud.style.transform = `translateX(${100 - (scroll / fullCoverStart) * pctCover}%)`;
            } else if (fullCoverStart <= scroll && scroll <= fullCoverEnd) {
                leftCloud.style.transform = `translateX(-${pctUncovered}%)`;
                rightCloud.style.transform = `translateX(${pctUncovered}%%)`;
            } else if (scroll <= end) {
                leftCloud.style.transform = `translateX(${
                    -pctUncovered - pctCover * ((scroll - fullCoverEnd) / (end - fullCoverEnd))
                }%)`;
                rightCloud.style.transform = `translateX(${
                    pctUncovered + pctCover * ((scroll - fullCoverEnd) / (end - fullCoverEnd))
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

    updateProjects() {
        const numProjects = 5;
        const projectTotalHeight = this.contentHeight * 1.5;
        const projectsStart = this.contentHeight * 4.5;
        const scroll = window.scrollY;

        for (let i = 1; i <= numProjects; i++) {
            const start = projectsStart + (numProjects - i) * projectTotalHeight;
            const end = start + projectTotalHeight;

            const fadeInEnd = start;
            const fadeOutStart = end;

            const div = document.getElementById(`project-${i}`);

            if (div) {
                if (scroll >= fadeInEnd && scroll <= fadeOutStart) {
                    div.style.opacity = "1";
                } else {
                    div.style.opacity = "0";
                }
            }
        }
    }

    scrollTo(numContentHeights: number) {
        window.scrollTo({
            top: this.contentHeight * numContentHeights,
            behavior: "smooth",
        });
    }

    updateScrollFish() {
        const offsets = [5, 6.25, 6.5, 8];
        const scroll = window.scrollY;
        const speed = [0.5, 0.2, 0.3, 0.4];

        for (let i = 1; i <= offsets.length; i++) {
            const container = document.getElementById(`fish-container${i}`);
            const fish = document.getElementById(`fish${i}`);
            if (fish && container && scroll >= this.contentHeight * offsets[i - 1]) {
                if (this.prevScroll < scroll) {
                    if (fish.classList.contains("start-right")) {
                        fish.style.transform = "scaleX(1)";
                        let oldPct = parseFloat(fish.style.right);
                        if (isNaN(oldPct)) {
                            oldPct = 25;
                        }
                        fish.style.right = `${oldPct + speed[i - 1]}%`;
                    } else {
                        fish.style.transform = "scaleX(-1)";
                        let oldPct = parseFloat(fish.style.left);
                        if (isNaN(oldPct)) {
                            oldPct = 25;
                        }
                        fish.style.left = `${oldPct + speed[i - 1]}%`;
                    }
                } else {
                    if (fish.classList.contains("start-right")) {
                        fish.style.transform = "scaleX(-1)";
                        let oldPct = parseFloat(fish.style.right);
                        if (isNaN(oldPct)) {
                            oldPct = 25;
                        }
                        fish.style.right = `${oldPct - speed[i - 1]}%`;
                    } else {
                        fish.style.transform = "scaleX(1)";
                        let oldPct = parseFloat(fish.style.left);
                        if (isNaN(oldPct)) {
                            oldPct = 25;
                        }
                        fish.style.left = `${oldPct - speed[i - 1]}%`;
                    }
                }
            }
        }

        this.prevScroll = scroll;
    }

    animateFish() {
        const fishIds = ["fish5", "fish6", "fish7"];
        const speeds = [0.4, 0.3, 0.15];
        for (let i = 0; i <= fishIds.length; i++) {
            const fish = document.getElementById(fishIds[i]);
            if (fish) {
                if (fish.getAttribute("dir") === "left") {
                    fish.style.transform = "scaleX(1)";
                    let oldPct = parseFloat(fish.style.left);
                    if (isNaN(oldPct)) {
                        oldPct = 25;
                    }
                    fish.style.left = `${oldPct - speeds[i]}%`;

                    if (oldPct - speeds[i] < -25) {
                        fish.setAttribute("dir", "right");
                    }
                } else {
                    fish.style.transform = "scaleX(-1)";

                    let oldPct = parseFloat(fish.style.left);
                    if (isNaN(oldPct)) {
                        oldPct = 25;
                    }
                    fish.style.left = `${oldPct + speeds[i]}%`;

                    if (oldPct + speeds[i] > 125) {
                        fish.setAttribute("dir", "left");
                    }
                }
            }
        }
        requestAnimationFrame(this.animateFish);
    }
}
