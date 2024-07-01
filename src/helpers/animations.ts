import gsap from "gsap";
import { MenuItem } from "../components/menuItem";
import { ThumbGrid } from "../components/thumbGrid";
import designLab from "../design-lab/index.ts";
import { isMobile } from "../global";
import WorkDetails from "../work-details/index.ts";

export const lettersAndSymbols = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export let flickerEase =
  "rough({ template: circ.easeOut, strength: 4, points: 50, taper: 'out', randomize: true, clamp:  true})";

type AnimationOptions = {
  duration?: number;
  delay?: number | string;
};

export const initFlickerAnimation = (
  timeline: gsap.core.Timeline,
  text: any,
  options: AnimationOptions = {}
) => {
  let { duration, delay } = {
    duration: options.duration || 0.08,
    delay: options.delay || 0.3,
  };

  timeline.to(
    text.hasAttribute("data-splitting") ? text.querySelectorAll(".word") : text,
    {
      duration: 1,
      opacity: 1,
      stagger: { each: duration, from: "random" },
      ease: flickerEase,
    },
    delay
  );

  if (text.hasAttribute("data-triangle")) {
    timeline.to(
      text,
      {
        "--triangle-opacity": 1,
        duration: 1,
      },
      "<"
    );
  }
};
export const initTypewritingAnimation = (
  timeline: gsap.core.Timeline,
  text: any,
  options: AnimationOptions = {}
) => {
  let { duration, delay } = {
    duration: options.duration || 0.08,
    delay: options.delay || 0,
  };
  const chars = text.querySelectorAll(".char");

  chars.forEach((char: any, position: number) => {
    let initialHTML = char.innerHTML;

    timeline.fromTo(
      char,
      {
        opacity: 0,
      },
      {
        duration: 0.03,
        innerHTML: () =>
          lettersAndSymbols[
            Math.floor(Math.random() * lettersAndSymbols.length)
          ],
        repeat: 1,
        repeatRefresh: true,
        opacity: 1,
        repeatDelay: 0.03,
        onComplete: () => {
          gsap.set(char, { innerHTML: initialHTML, delay: 0.03 });
        },
      },
      (position + 1) * duration + (delay as number)
    );

    if (text.hasAttribute("data-triangle")) {
      timeline.to(
        text,
        {
          "--triangle-opacity": 1,
          duration: 1,
        },
        (chars.length + 2) * duration
      );
    }
  });
};

export const initHeaderAnimations = () => {
  const header = document.querySelector(".header");
  const headerTimeline = gsap.timeline();

  // Logo
  headerTimeline.to(".header__logo", { opacity: 1 });

  initTypewritingAnimation(
    headerTimeline,
    header?.querySelector(".header__baseline")
  );
  header?.querySelectorAll(".header__nav__el").forEach((navEl, position) => {
    initFlickerAnimation(headerTimeline, navEl, {
      delay: (position + 1) * 0.4,
    });
  });
};
export const initFooterAnimations = () => {
  const footer = document.querySelector(".footer");
  const footerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: footer,
      start: "top bottom",
      end: "bottom center",
    },
  });

  footerTimeline.to(footer, { opacity: 1 });

  if (footer?.querySelector(".footer__title"))
    initFlickerAnimation(
      footerTimeline,
      footer?.querySelector(".footer__title")
    );
  if (footer?.querySelector(".footer__location"))
    initTypewritingAnimation(
      footerTimeline,
      footer?.querySelector(".footer__location")
    );

  if (footer?.querySelector(".footer__mail a"))
    initFlickerAnimation(
      footerTimeline,
      footer?.querySelector(".footer__mail a")
    );
  if (footer?.querySelector(".footer__time > span:first-child"))
    initTypewritingAnimation(
      footerTimeline,
      footer?.querySelector(".footer__time > span:first-child")
    );

  if (footer?.querySelector(".footer__time > span:last-child"))
    initFlickerAnimation(
      footerTimeline,
      footer?.querySelector(".footer__time > span:last-child")
    );

  footer
    ?.querySelectorAll(".footer__socials__el a")
    .forEach((navEl, position) => {
      initFlickerAnimation(footerTimeline, navEl, {
        delay: (position + 1) * 0.25,
      });
    });
};

export const initMain = () => {
  const sectionAnimations = document.querySelectorAll(
    "[data-section-animation]"
  );
  sectionAnimations.forEach((section) => {
    const texts = section.querySelectorAll("[data-section-text-animation]");
    texts.forEach((text, index) => {
      // @ts-ignore
      const speed = text.dataset.speed || 2;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: text,
            start: "top bottom",
            end: "bottom center+=200px",
          },
          delay: section.hasAttribute("data-delay-animation")
            ? (index + 1) * 0.3
            : 0.2,
        })
        .fromTo(
          text,
          { opacity: 0 },
          {
            opacity: 1,
            onStart: () => {
              text.querySelectorAll("[data-image]").forEach((img) => {
                // @ts-ignore
                img.imageHover.regenerateGrid();
              });
              if (text.hasAttribute("data-image")) {
                // @ts-ignore
                text.imageHover.regenerateGrid();
              }
            },
          }
        );
    });
  });

  const titleAnimations = document.querySelectorAll(
    "[data-splitting][data-title-animation]"
  );
  titleAnimations.forEach((title) => {
    const chars = title.querySelectorAll(".char");

    chars.forEach((char, position) => {
      let initialHTML = char.innerHTML;

      gsap.fromTo(
        char,
        {
          opacity: 0,
        },
        {
          duration: 0.03,
          innerHTML: () =>
            lettersAndSymbols[
              Math.floor(Math.random() * lettersAndSymbols.length)
            ],
          repeat: 1,
          repeatRefresh: true,
          opacity: 1,
          repeatDelay: 0.03,
          delay: (position + 1) * 0.08,
          onComplete: () => {
            gsap.set(char, { innerHTML: initialHTML, delay: 0.03 });
          },
          scrollTrigger: {
            trigger: title,
            start: "top bottom",
            end: "bottom center",
          },
        }
      );
    });

    gsap.to(title, {
      "--triangle-opacity": 1,
      duration: 1,
      delay: 1.3,
      scrollTrigger: {
        trigger: title,
        start: "top bottom",
        end: "bottom center",
      },
    });
  });

  const textAnimations = document.querySelectorAll("[data-text-animation]");
  textAnimations.forEach((text) => {
    // @ts-ignore
    const duration = text.dataset.textAnimationDuration ?? 0.09;
    gsap
      .timeline({
        scrollTrigger: {
          trigger: text,
          start: "top bottom",
          end: "bottom center",
        },
      })
      .to(
        text.querySelectorAll(".word"),
        {
          opacity: 1,
          duration: 1,
          stagger: { each: duration, from: "random" },
          ease: flickerEase,
        },
        0.3
      );

    gsap.to(text, {
      "--triangle-opacity": 1,
      duration: 1,
      delay: 1,
      scrollTrigger: {
        trigger: text,
        start: "top bottom",
        end: "bottom center",
      },
    });
  });
};

export const initWorks = () => {
  if (!isMobile()) {
    // Thumbs grid items
    let thumbGrids: ThumbGrid[] = [];
    [...document.querySelectorAll(".thumbgrid__wrap > .thumbgrid")].forEach(
      (thumbGrid) => {
        thumbGrids.push(new ThumbGrid(thumbGrid));
      }
    );

    // Menu items
    const menu = document.querySelector(".list");
    let menuItems: MenuItem[] = [];
    if (menu)
      [...menu.querySelectorAll(".list__el")].forEach((menuItem, position) => {
        menuItems.push(new MenuItem(menuItem, thumbGrids[position]));
      });

    menuItems.forEach((menuItem) => {
      if (menuItem.DOM.el) {
        menuItem.DOM.el.addEventListener("mouseenter", () => {
          // Clear previous timeout to avoid unwanted triggers
          if (menuItem.mouseEnterTimeout !== null)
            clearTimeout(menuItem.mouseEnterTimeout);

          if (menuItem.leaveTL) {
            menuItem.leaveTL.kill();
          }

          menuItem.mouseEnterTimeout = setTimeout(() => {
            if (menuItem.thumbGrid.DOM.el)
              menuItem.thumbGrid.DOM.el.classList.add("thumbgrid--current");

            menuItem.enterTL = gsap
              .timeline({
                defaults: {
                  duration: 0.5,
                  ease: "expo",
                },
              })
              .addLabel("start", 0)
              .fromTo(
                menuItem.thumbGrid.DOM.items,
                {
                  opacity: 0,
                  scale: 0.5,
                },
                {
                  stagger: 0.045,
                  opacity: 1,
                  scale: 1,
                },
                "start"
              );
          }, 20);
        });

        menuItem.DOM.el.addEventListener("mouseleave", () => {
          // Clear the timeout to avoid triggering the event after leaving the element
          if (menuItem.mouseEnterTimeout !== null)
            clearTimeout(menuItem.mouseEnterTimeout);
          if (menuItem.mouseLeaveTimeout !== null)
            clearTimeout(menuItem.mouseLeaveTimeout);

          if (menuItem.enterTL) {
            menuItem.enterTL.kill();
          }

          menuItem.mouseLeaveTimeout = setTimeout(() => {
            if (menuItem.thumbGrid.DOM.el)
              menuItem.thumbGrid.DOM.el.classList.remove("thumbgrid--current");

            menuItem.leaveTL = gsap
              .timeline({
                defaults: {
                  duration: 0.3,
                  ease: "power3",
                },
              })
              .addLabel("start", 0)
              .to(
                menuItem.thumbGrid.DOM.items,
                {
                  opacity: 0,
                  scale: 0.5,
                },
                "start"
              );
          }, 20);
        });
      }
    });
  }

  // Animation of sections
  const sectionAnimations = document.querySelectorAll(
    "[data-section-animation]"
  );
  sectionAnimations.forEach((section) => {
    // Display element one by one
    const subSections = section.querySelectorAll(
      "[data-section-text-animation]"
    );
    subSections.forEach((subSection, index) => {
      // Creating the timeline
      const timeline = gsap.timeline({
        delay: (index + 0.5) * 0.4,
      });

      timeline.to(subSection, {
        duration: 0.6,
        opacity: 1,
      });

      // Typewriting animation
      const titleAnimations = subSection.querySelectorAll(
        "[data-splitting][data-title-animation]"
      );
      titleAnimations.forEach((title) => {
        // @ts-ignore
        const duration = title.dataset.textAnimationDuration ?? 0.08;
        const chars = title.querySelectorAll(".char");

        chars.forEach((char, position) => {
          let initialHTML = char.innerHTML;

          timeline.fromTo(
            char,
            {
              opacity: 0,
            },
            {
              duration: 0.03,
              innerHTML: () =>
                lettersAndSymbols[
                  Math.floor(Math.random() * lettersAndSymbols.length)
                ],
              repeat: 1,
              repeatRefresh: true,
              opacity: 1,
              repeatDelay: 0.03,
              delay: (position + 1) * 0.001,
              onComplete: () => {
                gsap.set(char, { innerHTML: initialHTML, delay: 0.03 });
              },
            },
            "<"
          );
        });
      });

      // Ficker animation
      const textAnimations = subSection.querySelectorAll(
        "[data-text-animation]"
      );
      textAnimations.forEach((text) => {
        timeline
          .to(text.querySelectorAll(".word"), {
            opacity: 1,
            duration: 1,
            stagger: { each: 0.09, from: "random" },
            ease: flickerEase,
          })
          .to(
            text,
            {
              "--triangle-opacity": 1,
              duration: 1,
              scrollTrigger: {
                trigger: text,
                start: "top bottom",
                end: "bottom center",
              },
            },
            ">"
          );
      });
    });
  });
};

let workDetailsInstance: WorkDetails | null = null;
export const disposeWorkDetails = () => {
  if (workDetailsInstance) {
    workDetailsInstance.dispose();
    workDetailsInstance = null;
  }
};
export const initWorkDetails = (containerNode: HTMLElement = document.body) => {
  workDetailsInstance = new WorkDetails(containerNode);

  const timeline = gsap.timeline();

  // Title
  initTypewritingAnimation(
    timeline,
    containerNode.querySelector(".work-details__title")
  );

  // Gallery
  timeline.fromTo(
    containerNode.querySelector(".work-details__gallery"),
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
    },
    0.8
  );

  // Sub titles
  containerNode
    .querySelectorAll(".work-details__header > p")
    .forEach((subtitle, position) => {
      initTypewritingAnimation(timeline, subtitle, {
        delay: (position + 2) * 0.3,
      });
    });

  // Description
  initFlickerAnimation(
    timeline,
    containerNode.querySelector(".work-details__description"),
    { delay: 1 }
  );

  // Link
  if (containerNode.querySelector(".work-details__link"))
    initFlickerAnimation(
      timeline,
      containerNode.querySelector(".work-details__link"),
      { delay: 1.6 }
    );

  // Nav
  containerNode
    .querySelectorAll(".work-details__nav > a, .work-details__nav ul li")
    .forEach((subtitle, position) => {
      initFlickerAnimation(timeline, subtitle, {
        delay: (position + 2) * 0.3,
      });
    });

  timeline.to(
    containerNode.querySelector(".work-details__nav"),
    {
      "--lines-opacity": 1,
      duration: 1,
    },
    "<"
  );

  // Back link
  initFlickerAnimation(
    timeline,
    containerNode.querySelector(".work-details__back"),
    {
      delay: 2,
    }
  );

  // hr
  initFlickerAnimation(timeline, containerNode.querySelector("hr"), {
    delay: 2.3,
  });
};

export let designLabInstance: designLab | null = null;
export const disposeDesignLab = () => {
  if (designLabInstance) {
    designLabInstance.dispose();
    designLabInstance = null;
  }
};
export const initDesignLab = () => {
  if (!document.querySelector("canvas.lab__canvas"))
    designLabInstance = new designLab();

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  const images = document.querySelectorAll<HTMLImageElement>(
    'img:not([src*="https://tympanus.net/codrops/wp-content/banners/"])'
  );
  let imagesIndex = 0;

  Array.from(images).forEach((element) => {
    const image = new Image();

    image.src = element.src;
    image.onload = (_) => {
      imagesIndex += 1;

      if (imagesIndex === images.length) {
        document.documentElement.classList.remove("loading");
      }
    };
  });

  // GSAP Scroll Triggers
  // Creating the timeline
  const timeline = gsap.timeline();

  initTypewritingAnimation(timeline, document.querySelector(".lab__title"));
  timeline.to(".lab__canvas", { opacity: 1 });
  initFlickerAnimation(timeline, document.querySelector(".lab__text"));
};

export const initErrorPage = () => {
  const timeline = gsap.timeline();

  initFlickerAnimation(timeline, document.querySelector(".error-page__title"));
  initTypewritingAnimation(
    timeline,
    document.querySelector(".error-page__subtitle")
  );
  initFlickerAnimation(timeline, document.querySelector(".error-page__text"), {
    delay: 0.6,
  });
  initFlickerAnimation(timeline, document.querySelector(".error-page__link"), {
    delay: 0.9,
  });
};
