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

  const startAutoCarousel = ({ hoverTarget, scrollContainer, itemTrack, speed = 0.45 }) => {
    const items = Array.from(itemTrack.children);
    if (items.length < 2 || itemTrack.dataset.autoLoopInitialized === 'true') return;

    items.forEach((item) => {
      itemTrack.appendChild(item.cloneNode(true));
    });

    itemTrack.dataset.autoLoopInitialized = 'true';

    let paused = false;

    const tick = () => {
      if (!paused) {
        const loopWidth = itemTrack.scrollWidth / 2;
        if (loopWidth > 0) {
          scrollContainer.scrollLeft += speed;
          if (scrollContainer.scrollLeft >= loopWidth) {
            scrollContainer.scrollLeft -= loopWidth;
          }
        }
      }

      requestAnimationFrame(tick);
    };

    hoverTarget.addEventListener('mouseenter', () => {
      paused = true;
    });
    hoverTarget.addEventListener('mouseleave', () => {
      paused = false;
    });
    hoverTarget.addEventListener('focusin', () => {
      paused = true;
    });
    hoverTarget.addEventListener('focusout', () => {
      paused = false;
    });

    tick();
  };

  const sliderWrappers = document.querySelectorAll('.slider-wrap, .offerings-wrap');

  sliderWrappers.forEach((sliderWrap) => {
    const sliderTrack = sliderWrap.querySelector('.slider-track');
    if (!sliderTrack) return;

    startAutoCarousel({
      hoverTarget: sliderWrap,
      scrollContainer: sliderWrap,
      itemTrack: sliderTrack,
      speed: sliderWrap.classList.contains('kitchen-showcase-wrap') ? 0.55 : 0.45,
    });
  });

  const whyChooseCarousel = document.querySelector('.whyChooseUs_slider__vpqwR');
  if (whyChooseCarousel) {
    const whyChooseTrack = whyChooseCarousel.querySelector('.whyChooseUs_slide-icons__3t3Vh');
    if (whyChooseTrack) {
      startAutoCarousel({
        hoverTarget: whyChooseCarousel,
        scrollContainer: whyChooseCarousel,
        itemTrack: whyChooseTrack,
        speed: 0.5,
      });
    }
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
