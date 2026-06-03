document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const dropdownButtons = document.querySelectorAll('.dropdown-toggle');

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      navList.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  dropdownButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const item = this.closest('.nav-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.nav-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
      });
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  document.addEventListener('click', function (event) {
    const isDropdown = event.target.closest('.nav-item');
    if (!isDropdown) {
      document.querySelectorAll('.nav-item.open').forEach((openItem) => {
        openItem.classList.remove('open');
      });
    }
  });

  const sliderWrappers = document.querySelectorAll('.slider-wrap, .offerings-wrap');

  sliderWrappers.forEach((sliderWrap) => {
    const sliderTrack = sliderWrap.querySelector('.slider-track');
    const slides = sliderTrack?.querySelectorAll('.value-card, .offering-card');

    if (!sliderTrack || !slides || slides.length === 0) return;

    let paused = false;
    const scrollSpeed = sliderWrap.classList.contains('kitchen-showcase-wrap') ? 0.6 : 0.45;

    const scrollStep = () => {
      if (!paused) {
        sliderTrack.scrollLeft += scrollSpeed;
        const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;
        if (sliderTrack.scrollLeft >= maxScroll) {
          sliderTrack.scrollLeft = 0;
        }
      }
      requestAnimationFrame(scrollStep);
    };

    sliderWrap.addEventListener('mouseenter', () => {
      paused = true;
    });
    sliderWrap.addEventListener('mouseleave', () => {
      paused = false;
    });
    sliderWrap.addEventListener('focusin', () => {
      paused = true;
    });
    sliderWrap.addEventListener('focusout', () => {
      paused = false;
    });

    scrollStep();
  });

  const whyChooseCarousel = document.querySelector('.whyChooseUs_slider__vpqwR');
  if (whyChooseCarousel) {
    const whyChooseTrack = whyChooseCarousel.querySelector('.whyChooseUs_slide-icons__3t3Vh');
    let animationId = null;
    let paused = false;
    const scrollSpeed = 0.5;

    const scrollStep = () => {
      if (!paused && whyChooseTrack) {
        whyChooseCarousel.scrollLeft += scrollSpeed;
        if (whyChooseCarousel.scrollLeft >= whyChooseTrack.scrollWidth - whyChooseCarousel.clientWidth) {
          whyChooseCarousel.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scrollStep);
    };

    whyChooseCarousel.addEventListener('mouseenter', () => paused = true);
    whyChooseCarousel.addEventListener('mouseleave', () => paused = false);
    whyChooseCarousel.addEventListener('focusin', () => paused = true);
    whyChooseCarousel.addEventListener('focusout', () => paused = false);

    scrollStep();
  }

  const scrollToHashTarget = () => {
    if (!location.hash) return;
    const hashTarget = document.querySelector(location.hash);
    if (hashTarget) {
      hashTarget.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  };

  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToHashTarget);
    });
  });

  scrollToHashTarget();

});
