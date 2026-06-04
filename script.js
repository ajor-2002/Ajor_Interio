document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const dropdownButtons = document.querySelectorAll('.dropdown-toggle');
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

  document.querySelectorAll('main img').forEach((img) => {
    if (img.classList.contains('hero-image')) return;
    img.loading = 'lazy';
    img.decoding = 'async';
  });

  const leadForm = document.querySelector('.lead-form');
  if (leadForm) {
    const formStatus = leadForm.querySelector('.form-status');
    const nameInput = leadForm.querySelector('input[name="name"]');
    const phoneInput = leadForm.querySelector('input[name="phone"]');
    const cityInput = leadForm.querySelector('input[name="city"]');

    const setStatus = (message, type = '') => {
      if (!formStatus) return;
      formStatus.textContent = message;
      formStatus.classList.toggle('is-error', type === 'error');
      formStatus.classList.toggle('is-success', type === 'success');
    };

    const getDigitCount = (value) => (value.match(/\d/g) || []).length;

    const isValidCity = (value) => {
      const trimmed = value.trim();
      return /^[A-Za-z][A-Za-z\s.'-]{1,}$/.test(trimmed);
    };

    leadForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(leadForm);
      const name = (formData.get('name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const city = (formData.get('city') || '').toString().trim();

      if (!name) {
        nameInput?.focus();
        setStatus('Please enter your name.', 'error');
        return;
      }

      if (getDigitCount(phone) < 10) {
        phoneInput?.focus();
        setStatus('Phone number must contain at least 10 digits.', 'error');
        return;
      }

      if (!isValidCity(city)) {
        cityInput?.focus();
        setStatus('Please enter a valid city name.', 'error');
        return;
      }

      setStatus('Thank you for visiting. Your request has been submitted successfully.', 'success');
      leadForm.reset();
    });
  }

  const closeOpenDropdowns = (exceptItem = null) => {
    document.querySelectorAll('.nav-item.open').forEach((openItem) => {
      if (openItem !== exceptItem) {
        openItem.classList.remove('open');
      }
    });
  };

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      navList.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navList?.classList.remove('open');
      navToggle?.classList.remove('open');
    });
  });

  dropdownItems.forEach((item) => {
    item.addEventListener('mouseenter', function () {
      closeOpenDropdowns(this);
    });
  });

  dropdownButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const item = this.closest('.nav-item');
      const isOpen = item.classList.contains('open');
      closeOpenDropdowns(item);
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  document.addEventListener('click', function (event) {
    const clickedInsideHeader = event.target.closest('.nav-main') || event.target.closest('.topbar');
    const isDropdown = event.target.closest('.nav-item');
    if (!isDropdown) {
      closeOpenDropdowns();
    }

    if (navList && navToggle && navList.classList.contains('open') && !clickedInsideHeader) {
      navList.classList.remove('open');
      navToggle.classList.remove('open');
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
      speed: 0.45,
    });
  });

  let imageLightbox = null;
  let lastLightboxTrigger = null;

  const getImageLightbox = () => {
    if (imageLightbox) return imageLightbox;

    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Expanded slider image');
    lightbox.innerHTML = `
      <button class="image-lightbox-close" type="button" aria-label="Close image">x</button>
      <figure class="image-lightbox-frame">
        <img src="" alt="" />
        <figcaption></figcaption>
      </figure>
    `;

    document.body.appendChild(lightbox);

    imageLightbox = {
      root: lightbox,
      image: lightbox.querySelector('img'),
      caption: lightbox.querySelector('figcaption'),
      closeButton: lightbox.querySelector('.image-lightbox-close'),
    };

    return imageLightbox;
  };

  const closeImageLightbox = () => {
    if (!imageLightbox) return;

    imageLightbox.root.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');

    if (lastLightboxTrigger && typeof lastLightboxTrigger.focus === 'function') {
      lastLightboxTrigger.focus({ preventScroll: true });
    }
  };

  const openImageLightbox = (image) => {
    const lightbox = getImageLightbox();
    const cardTitle = image.closest('.offering-card')?.querySelector('h3')?.textContent?.trim();
    const caption = cardTitle || image.alt || 'Interior design image';

    lastLightboxTrigger = image;
    lightbox.image.src = image.currentSrc || image.src;
    lightbox.image.alt = image.alt || caption;
    lightbox.caption.textContent = caption;
    lightbox.root.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    lightbox.closeButton.focus({ preventScroll: true });
  };

  document.addEventListener('click', (event) => {
    const sliderCard = event.target.closest('.slider-track .offering-card');
    const sliderImage = sliderCard?.querySelector('.offering-image');
    if (!sliderCard || !sliderImage) return;

    event.preventDefault();
    openImageLightbox(sliderImage);
  });

  document.addEventListener('click', (event) => {
    if (!imageLightbox || !imageLightbox.root.classList.contains('is-open')) return;

    const clickedBackdrop = event.target === imageLightbox.root;
    const clickedClose = event.target.closest('.image-lightbox-close');
    if (clickedBackdrop || clickedClose) {
      closeImageLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageLightbox?.root.classList.contains('is-open')) {
      closeImageLightbox();
    }
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

  document.querySelectorAll('.trusted-brands-section').forEach((section) => {
    const track = section.querySelector('.trusted-brands-track');
    const slides = Array.from(section.querySelectorAll('.trusted-brands-slide'));
    const dots = Array.from(section.querySelectorAll('.trusted-brand-dots button'));
    if (!track || slides.length < 2 || dots.length === 0) return;

    let activeIndex = 0;
    let rotateTimer = null;

    const setSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${activeIndex * 100}%)`;

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    const stopRotation = () => {
      if (rotateTimer) {
        clearInterval(rotateTimer);
        rotateTimer = null;
      }
    };

    const startRotation = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      stopRotation();
      rotateTimer = setInterval(() => {
        setSlide(activeIndex + 1);
      }, 3000);
    };

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener('click', () => {
        setSlide(dotIndex);
        startRotation();
      });
    });

    section.addEventListener('mouseenter', stopRotation);
    section.addEventListener('mouseleave', startRotation);
    section.addEventListener('focusin', stopRotation);
    section.addEventListener('focusout', startRotation);

    setSlide(0);
    startRotation();
  });

  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    const toggleBackToTop = () => {
      backToTopButton.classList.toggle('is-visible', window.scrollY > 420);
    };

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
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
