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

  const startAutoCarousel = ({ hoverTarget, scrollContainer, itemTrack, interval = 3000 }) => {
    const items = Array.from(itemTrack.children);
    if (items.length < 2) return;

    let paused = false;

    const getStepDistance = () => {
      const firstItem = items[0];
      const itemStyles = window.getComputedStyle(itemTrack);
      const gap = parseFloat(itemStyles.columnGap || itemStyles.gap || '0') || 0;
      const itemWidth = firstItem.getBoundingClientRect().width + gap;
      const visibleCount = Math.max(1, Math.floor((scrollContainer.clientWidth + gap) / itemWidth));
      return itemWidth * visibleCount;
    };

    const advance = () => {
      if (paused) return;

      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (maxScroll <= 0) return;

      const current = scrollContainer.scrollLeft;
      const step = getStepDistance();
      let target = current + step;

      if (current >= maxScroll - 2) {
        target = 0;
      } else if (target > maxScroll) {
        target = maxScroll;
      }

      scrollContainer.scrollTo({
        left: target,
        behavior: 'smooth',
      });
    };

    window.setInterval(advance, interval);

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
  };

  const sliderWrappers = document.querySelectorAll('.slider-wrap, .offerings-wrap');

  sliderWrappers.forEach((sliderWrap) => {
    const sliderTrack = sliderWrap.querySelector('.slider-track');
    if (!sliderTrack) return;

    startAutoCarousel({
      hoverTarget: sliderWrap,
      scrollContainer: sliderTrack,
      itemTrack: sliderTrack,
      interval: 3000,
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
        interval: 3000,
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
