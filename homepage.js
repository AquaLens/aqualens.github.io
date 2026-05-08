// importing ScrollTrigger from GSAP
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

// Smooth scroll — disable on mobile (breaks native touch scrolling)
let lenis = null;
if (window.innerWidth > 768) {
  lenis = new Lenis();
  lenis.on('scroll', (e) => {
    console.log(e);
  });
  lenis.on('scroll', ScrollTrigger.update);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// button scroll to scene1
document.querySelector('#dive_button').addEventListener('click', function () {
    const scene1 = document.querySelector('.scene1');

    if (scene1) {
        // calculate the scroll position
        const scene1Top = scene1.getBoundingClientRect().top + window.scrollY;
        const scrollTarget = scene1Top + (scene1.offsetHeight * 0.90);

        // scroll to the calculated position
        window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
        });
    }
});

// play or pause audio based on visibility of water_animation_container
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bubbly-sound');
  const waterAnimationContainer = document.querySelector('.water_animation_container');

  // adjust initial volume
  audio.volume = 0.3; // set initial volume (0.0 to 1.0)

  // use IntersectionObserver to monitor visibility
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        audio.play(); // play audio when the container is visible
      } else {
        audio.pause(); // pause audio when the container is not visible
      }
    });
  });

  observer.observe(waterAnimationContainer);

  // fade out audio volume on scroll
  window.addEventListener('scroll', () => {
    const containerRect = waterAnimationContainer.getBoundingClientRect();
    const fadeStart = 0; // start fading when the container is fully visible
    const fadeEnd = window.innerHeight; // end fading when the container is out of view

    // calculate the fade factor based on scroll position
    const fadeFactor = Math.max(0, Math.min(1, containerRect.bottom / fadeEnd));

    // adjust the audio volume based on the fade factor
    audio.volume = fadeFactor * 0.3; // multiply by max volume (e.g., 0.5)
  });
});

// button scroll to explore
document.querySelector('#explore_button').addEventListener('click', function () {
  window.location.href = '/projects'; 
});

// button scroll down by one viewport height when Dive In button is clicked
document.querySelector('#dive_button').addEventListener('click', function () {
  const targetScroll = window.scrollY + window.innerHeight; // calculate the target scroll position

  gsap.to(window, {
      scrollTo: targetScroll, // scroll to the target position
      duration: 2,
      ease: "power2.out" // smooth easing
  });
});

// progress bar code to go with the story
gsap.to(".progress_bar", {
  width: "100vw",
  ease: "none",
  scrollTrigger: {
    trigger: "#story",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  }
});

// pin the image when its bottom hits the viewport
ScrollTrigger.create({
    trigger: ".scene1",
    start: "bottom bottom",
    end: "+=800",
    pin: true,
    anticipatePin: 1,
    scrub: true
});

// fade in the overlay text
gsap.to(".act1_text", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".scene1",
        start: "bottom bottom",
        end: "+=600",
        scrub: true
    }
});

// Show blink GIF first, then swap to looping jump GIF after blink duration (~8.4s)
document.addEventListener('DOMContentLoaded', () => {
  const blinkGif = document.querySelector('.blink_vid');
  if (!blinkGif) return;

  // Preload the jump GIF
  const jumpImg = new Image();
  jumpImg.src = '/images/homepage_media/Froggy jump 10.gif';
  jumpImg.className = 'blink_vid';
  jumpImg.alt = 'Froggy jumping';
  jumpImg.style.cssText = blinkGif.style.cssText;

  // After blink plays once, swap to the looping jump GIF
  setTimeout(() => {
    blinkGif.replaceWith(jumpImg);
  }, 8400);
});

// slide in the hover text
gsap.from("#hover_text", {
    opacity: 1,
    y: 50,
    duration: 1,
    stagger: 0.1,
    ease: "power4",
    scrollTrigger: {
        trigger: ".scene2",
        start: "-3% top",
        end: "+=300",
        toggleActions: "play none none none",
        // markers: true
    }
});

// fade in the overlay text
gsap.to(".act2_text_1", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".scene2",
        start: "40% center",
        end: "+=400",
        scrub: true
    }
});

// animate the first data graph
gsap.to("#graph1", {
  scrollTrigger: {
    trigger: ".scene2",
    start: "54% center", // when trigger hits center of viewport
    toggleActions: "play none none reverse", // reverse animation as well
  },
  scale: 1,
  opacity: 1,
  duration: 0.5,
  ease: "back.out(0.5)" // gives it a pop
});

// animate the second data graph
gsap.to("#graph2", {
  scrollTrigger: {
    trigger: ".scene2",
    start: "71% center",
    toggleActions: "play none none reverse",
  },
  scale: 1,
  opacity: 1,
  duration: 0.5,
  ease: "back.out(0.5)"
});

// animate the first graph caption
gsap.fromTo("#graph1_text",
  { x: "102%" }, // start fully hidden to the right
  {
    x: "0%",
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scene2",
      start: "58% center",
      toggleActions: "play none none reverse",
    }
  }
);

// animate the second graph caption
gsap.fromTo("#graph2_text",
  { x: "-102%" }, // start fully hidden to the left
  {
    x: "0%",
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scene2",
      start: "75% center",
      toggleActions: "play none none reverse",
    }
  }
);

// dade in the overlay text
gsap.to(".act2_text_2", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".pin_section_2",
        start: "bottom bottom",
        end: "+=400",
        scrub: true
    }
});

// animatations for the quotes

gsap.fromTo("#quote_1",
  { opacity: 0, y: 20 },
  {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scene3",
      start: "5.8% center",
      toggleActions: "play none none reverse",
    }
  }
);

gsap.fromTo("#quote_2",
  { opacity: 0, y: 20 },
  {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scene3",
      start: "21.3% center",
      toggleActions: "play none none reverse",
    }
  }
);

gsap.fromTo("#quote_3",
  { opacity: 0, y: 20 },
  {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scene3",
      start: "36.3% center",
      toggleActions: "play none none reverse",
    }
  }
);

gsap.fromTo("#quote_4",
  { opacity: 0, y: 20 },
  {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scene3",
      start: "52.2% center",
      toggleActions: "play none none reverse",
    }
  }
);

gsap.fromTo("#quote_5",
  { opacity: 0, y: 20 },
  {
    opacity: 1,
    y: 0,
    duration: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".scene3",
      start: "66.8% center",
      toggleActions: "play none none reverse",
    }
  }
);

// fade in text
gsap.to(".act3_text", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".act3_text",
        start: "bottom 80%+bottom",
        end: "+=400",
        scrub: true
    }
});

// hand sliding in from the left animation with scrub
let tl3 = gsap.timeline({
  scrollTrigger: {
    trigger: ".scene4",
    start: "top 40%-top",
    end: "top top",
    scrub: true,
  }
});

tl3.to("#hand_container", {
  x: "100%"
})

// project container fade ins/outs

gsap.fromTo("#project_container_1",
  { opacity: 0, y: 20 },
  {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#project_container_1",
      start: "top center",
      toggleActions: "play none none reverse",
    }
  }
);

gsap.fromTo("#project_container_2",
  { opacity: 0, y: 20 },
  {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#project_container_2",
      start: "top center",
      toggleActions: "play none none reverse",
      markers: false  
    }
  }
);

gsap.fromTo("#project_container_3",
  { opacity: 0, y: 20 },
  {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#project_container_3",
      start: "top center",
      toggleActions: "play none none reverse",
      markers: false  
    }
  }
);

// pin the image when its bottom hits the viewport
ScrollTrigger.create({
    trigger: "#enlarged_pin",
    start: "bottom bottom",
    end: "+=1600",
    pin: true,
    anticipatePin: 1,
    scrub: true
});

// fade in the overlay text
gsap.to("#act5_text_1", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#enlarged_pin",
        start: "bottom bottom",
        end: "+=400",
        scrub: true
    }
});

// fade in overlay text with delay
const scene5Timeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#enlarged_pin",
    start: "bottom bottom",
    end: "+=800",
    scrub: true
  }
});

scene5Timeline.to("#act5_text_2", {
  opacity: 1,
  y: 0,
  duration: 2,
  ease: "power2.out",
  delay: 2.5 // delay before this animation starts
});

// play arrow animation only once, when it enters the viewport
let player = document.getElementById("hover_lottie");

player.addEventListener("ready", () => {
let inte = LottieInteractivity.create({
    player: "#hover_lottie",
    mode:"scroll",
    actions: [
        {
        visibility: [0.50, 1.0], // animatin starts at 50% visibility
        type: "playOnce"
        }
    ]
});
});

// refresh ScrollTrigger once page loads fully
window.addEventListener('load', () => {
  ScrollTrigger.refresh()
})