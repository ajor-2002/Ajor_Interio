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
    const prevButton = sliderWrap.querySelector('.slider-arrow.prev');
    const nextButton = sliderWrap.querySelector('.slider-arrow.next');
    const slides = sliderTrack?.querySelectorAll('.value-card, .offering-card');

    if (!sliderTrack || !prevButton || !nextButton || !slides || slides.length === 0) return;

    let currentIndex = 0;
    let autoScrollInterval = null;
    let animationFrame = null;

    const getSlideTarget = (index) => {
      const slide = slides[index];
      if (!slide) return sliderTrack.scrollLeft;
      return slide.offsetLeft - parseInt(getComputedStyle(sliderTrack).paddingLeft, 10);
    };

    const smoothScrollTo = (targetLeft) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      const startLeft = sliderTrack.scrollLeft;
      const distance = targetLeft - startLeft;
      const duration = 600;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        sliderTrack.scrollLeft = startLeft + distance * ease;

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          animationFrame = null;
        }
      };

      animationFrame = requestAnimationFrame(animate);
    };

    const scrollToIndex = (index) => {
      const targetLeft = getSlideTarget(index);
      smoothScrollTo(targetLeft);
      currentIndex = index;
    };

    const scrollNext = () => {
      const nextIndex = currentIndex + 1 >= slides.length ? 0 : currentIndex + 1;
      scrollToIndex(nextIndex);
    };

    const scrollPrev = () => {
      const prevIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
      scrollToIndex(prevIndex);
    };

    prevButton.addEventListener('click', () => {
      stopAutoScroll();
      scrollPrev();
      startAutoScroll();
    });

    nextButton.addEventListener('click', () => {
      stopAutoScroll();
      scrollNext();
      startAutoScroll();
    });

    const startAutoScroll = () => {
      if (!autoScrollInterval) {
        autoScrollInterval = setInterval(scrollNext, 2600);
      }
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    };

    sliderWrap.addEventListener('mouseenter', stopAutoScroll);
    sliderWrap.addEventListener('mouseleave', startAutoScroll);
    sliderWrap.addEventListener('focusin', stopAutoScroll);
    sliderWrap.addEventListener('focusout', startAutoScroll);

    scrollToIndex(0);
    startAutoScroll();
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
});
