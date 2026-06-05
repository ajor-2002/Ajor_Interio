document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const dropdownButtons = document.querySelectorAll('.dropdown-toggle');
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
  let modularKitchenLoginModal = null;
  let closeModularKitchenLoginModal = () => {};

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

      const subject = encodeURIComponent('New 3D Design Session Lead');
      const body = encodeURIComponent(
        [
          'New lead from AJOR Interio website',
          `Name: ${name}`,
          `Phone: ${phone}`,
          `City: ${city}`,
          `Page URL: ${window.location.href}`,
        ].join('\n')
      );

      setStatus('Opening your mail app to send the request...', 'success');
      leadForm.reset();
      window.location.href = `mailto:ajorinterio@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  const modularKitchenGallery = document.querySelector('.mk-gallery-section');
  if (modularKitchenGallery) {
    const cards = Array.from(modularKitchenGallery.querySelectorAll('.mk-design-card'));
    const filterButtons = Array.from(modularKitchenGallery.querySelectorAll('.mk-filter-bar .mk-filter'));
    const loadMoreWrap = modularKitchenGallery.querySelector('.mk-load-more-wrap');
    const loadMoreButton = modularKitchenGallery.querySelector('.mk-load-more');
    const filterDrawer = document.querySelector('.mk-filter-drawer');
    const filterDrawerOverlay = document.querySelector('.mk-filter-drawer-overlay');
    const filterDrawerClose = document.querySelector('.mk-filter-close');
    const filterDrawerCancel = document.querySelector('.mk-filter-cancel');
    const filterDrawerApply = document.querySelector('.mk-filter-apply');
    const filterDrawerClear = document.querySelector('.mk-filter-clear');
    const loginModal = document.querySelector('.mk-login-modal');
    const loginBackdrop = document.querySelector('.mk-login-backdrop');
    const loginClose = document.querySelector('.mk-login-close');
    const loginSubmit = document.querySelector('.mk-login-submit');
    const loginGoogle = document.querySelector('.mk-login-google');
    const loginPhoneInput = document.querySelector('#mk-login-phone-input');
    const drawerShapeButtons = Array.from(
      document.querySelectorAll('.mk-filter-drawer .mk-filter-chip[data-filter]')
    );
    const drawerColorButtons = Array.from(
      document.querySelectorAll('.mk-filter-drawer .mk-color-chip[data-color]')
    );
    const drawerFinishButtons = Array.from(
      document.querySelectorAll('.mk-filter-drawer .mk-filter-chip[data-finish]')
    );
    const drawerStorageButtons = Array.from(
      document.querySelectorAll('.mk-filter-drawer .mk-filter-chip[data-storage]')
    );
    const initialLimit = 6;

    let activeFilterMode = 'shape';
    let activeShapeFilter = 'all';
    let activeColorFilter = '';
    let activeFinishFilter = '';
    let activeStorageFilter = '';
    let expanded = false;

    const normalizeText = (value) =>
      (value || '')
        .toString()
        .toLowerCase()
        .replace(/[_\-.]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const detectCategory = (card) => {
      const image = card.querySelector('img');
      const source = normalizeText(
        [card.querySelector('h3')?.textContent, image?.alt, image?.getAttribute('src')]
          .filter(Boolean)
          .join(' ')
      );

      if (source.includes('parallel')) return 'parallel';
      if (source.includes('straight island')) return 'straight-island';
      if (source.includes('l shaped island')) return 'l-shaped-island';
      if (source.includes('u shaped island')) return 'u-shaped-island';
      if (source.includes('u shaped')) return 'u-shaped';
      if (source.includes('l shaped')) return 'l-shaped';
      if (source.includes('straight')) return 'straight';

      return 'all';
    };

    const detectColor = (card) => {
      const image = card.querySelector('img');
      const source = normalizeText(
        [card.querySelector('h3')?.textContent, image?.alt, image?.getAttribute('src')]
          .filter(Boolean)
          .join(' ')
      );

      if (source.includes('black')) return 'black';
      if (source.includes('green') || source.includes('meadow')) return 'green';
      if (source.includes('orange') || source.includes('citrus') || source.includes('amber')) return 'orange';
      if (source.includes('brown') || source.includes('beige') || source.includes('coffee') || source.includes('umber') || source.includes('mojave') || source.includes('walnut') || source.includes('oak') || source.includes('acacia') || source.includes('cappuccino') || source.includes('wood') || source.includes('ecru') || source.includes('chamoisee')) return 'brown';
      if (source.includes('grey') || source.includes('gray') || source.includes('silver') || source.includes('gainsboro')) return 'grey';
      if (source.includes('blue') || source.includes('indigo') || source.includes('navy') || source.includes('lupin') || source.includes('azure')) return 'blue';
      if (source.includes('yellow') || source.includes('buttercream') || source.includes('gold') || source.includes('lemon')) return 'yellow';
      if (source.includes('red') || source.includes('berry') || source.includes('burgundy') || source.includes('ruby')) return 'red';
      if (source.includes('purple') || source.includes('plum') || source.includes('lavender')) return 'purple';
      if (source.includes('pink') || source.includes('rose') || source.includes('passion flower')) return 'pink';
      if (source.includes('ivory') || source.includes('cream') || source.includes('white') || source.includes('frosty')) return 'ivory';

      return 'white';
    };

    const detectFinish = (card) => {
      const image = card.querySelector('img');
      const source = normalizeText(
        [card.querySelector('h3')?.textContent, image?.alt, image?.getAttribute('src')]
          .filter(Boolean)
          .join(' ')
      );

      if (source.includes('acrylic')) return 'acrylic';
      if (source.includes('lacquered') || source.includes('high gloss') || source.includes('glass')) {
        return 'lacquered-glass';
      }
      if (source.includes('membrane')) return 'membrane';
      if (source.includes('gloss') || source.includes('sleek') || source.includes('modern')) return 'gloss';
      return 'matte';
    };

    const detectStorage = (card) => {
      const image = card.querySelector('img');
      const source = normalizeText(
        [card.querySelector('h3')?.textContent, image?.alt, image?.getAttribute('src')]
          .filter(Boolean)
          .join(' ')
      );

      if (source.includes('breakfast counter')) return 'breakfast-counter';
      if (source.includes('built in appliance') || source.includes('appliance') || source.includes('oven')) {
        return 'built-in-appliance';
      }
      if (source.includes('open shelves') || source.includes('open shelf')) return 'open-shelves';
      if (source.includes('glass shutter') || source.includes('glass')) return 'glass-shutter';
      if (source.includes('loft')) return 'loft';
      if (source.includes('tall')) return 'tall-unit';
      return 'base-wall-units';
    };

    cards.forEach((card) => {
      card.dataset.category = detectCategory(card);
      card.dataset.color = detectColor(card);
      card.dataset.finish = detectFinish(card);
      card.dataset.storage = detectStorage(card);
    });

    const getMatchingCards = () =>
      cards.filter((card) => {
        if (activeFilterMode === 'color') {
          return !activeColorFilter || card.dataset.color === activeColorFilter;
        }

        if (activeFilterMode === 'finish') {
          return !activeFinishFilter || card.dataset.finish === activeFinishFilter;
        }

        if (activeFilterMode === 'storage') {
          return !activeStorageFilter || card.dataset.storage === activeStorageFilter;
        }

        return activeShapeFilter === 'all' || card.dataset.category === activeShapeFilter;
      });

    const updateFilterButtons = () => {
      filterButtons.forEach((button) => {
        const buttonFilter = button.dataset.filter || 'all';
        button.classList.toggle(
          'active',
          activeFilterMode === 'shape' && buttonFilter === activeShapeFilter && buttonFilter !== 'more'
        );
      });

      drawerShapeButtons.forEach((button) => {
        button.classList.toggle('active', activeFilterMode === 'shape' && button.dataset.filter === activeShapeFilter);
      });

      drawerColorButtons.forEach((button) => {
        button.classList.toggle('active', activeFilterMode === 'color' && button.dataset.color === activeColorFilter);
      });

      drawerFinishButtons.forEach((button) => {
        button.classList.toggle(
          'active',
          activeFilterMode === 'finish' && button.dataset.finish === activeFinishFilter
        );
      });

      drawerStorageButtons.forEach((button) => {
        button.classList.toggle(
          'active',
          activeFilterMode === 'storage' && button.dataset.storage === activeStorageFilter
        );
      });
    };

    const renderGallery = () => {
      const matchingCards = getMatchingCards();

      cards.forEach((card) => {
        card.classList.add('is-hidden');
        card.setAttribute('aria-hidden', 'true');
      });

      matchingCards.forEach((card, index) => {
        const shouldShow = expanded || index < initialLimit;
        card.classList.toggle('is-hidden', !shouldShow);
        card.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
      });

      if (loadMoreWrap) {
        loadMoreWrap.hidden = expanded || matchingCards.length <= initialLimit;
      }

      if (loadMoreButton) {
        loadMoreButton.textContent = 'Load More';
      }
    };

    const openFilterDrawer = () => {
      if (!filterDrawer) return;
      updateFilterButtons();
      filterDrawer.classList.add('is-open');
      filterDrawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    };

    const closeFilterDrawer = () => {
      if (!filterDrawer) return;
      filterDrawer.classList.remove('is-open');
      filterDrawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    const openLoginModal = () => {
      if (!loginModal) return;
      loginModal.classList.add('is-open');
      loginModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      setTimeout(() => loginPhoneInput?.focus(), 0);
    };

    const closeLoginModal = () => {
      if (!loginModal) return;
      loginModal.classList.remove('is-open');
      loginModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    modularKitchenLoginModal = loginModal;
    closeModularKitchenLoginModal = closeLoginModal;

    const sendLoginLead = () => {
      const phone = (loginPhoneInput?.value || '').trim();
      const digitCount = (phone.match(/\d/g) || []).length;

      if (digitCount < 10) {
        loginPhoneInput?.focus();
        loginPhoneInput?.setAttribute('aria-invalid', 'true');
        if (loginPhoneInput) {
          loginPhoneInput.placeholder = 'Enter at least 10 digits';
        }
        return;
      }

      loginPhoneInput?.setAttribute('aria-invalid', 'false');

      const subject = encodeURIComponent('New Login Lead from AJOR Interio');
      const body = encodeURIComponent(
        [
          'New login request from AJOR Interio website',
          `Phone: ${phone}`,
          `Page URL: ${window.location.href}`,
        ].join('\n')
      );

      window.location.href = `mailto:ajorinterio@gmail.com?subject=${subject}&body=${body}`;
      closeLoginModal();

      window.setTimeout(() => {
        window.location.href = '../index.html';
      }, 500);
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const buttonFilter = button.dataset.filter || 'all';
        if (buttonFilter === 'more') return;

        activeFilterMode = 'shape';
        activeShapeFilter = buttonFilter;
        expanded = false;
        updateFilterButtons();
        renderGallery();
      });
    });

    drawerShapeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilterMode = 'shape';
        activeShapeFilter = button.dataset.filter || 'all';
        expanded = false;
        updateFilterButtons();
        renderGallery();
        closeFilterDrawer();
      });
    });

    drawerColorButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilterMode = 'color';
        activeColorFilter = button.dataset.color || '';
        expanded = false;
        updateFilterButtons();
        renderGallery();
        closeFilterDrawer();
      });
    });

    drawerFinishButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilterMode = 'finish';
        activeFinishFilter = button.dataset.finish || '';
        expanded = false;
        updateFilterButtons();
        renderGallery();
        closeFilterDrawer();
      });
    });

    drawerStorageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilterMode = 'storage';
        activeStorageFilter = button.dataset.storage || '';
        expanded = false;
        updateFilterButtons();
        renderGallery();
        closeFilterDrawer();
      });
    });

    filterDrawerOverlay?.addEventListener('click', closeFilterDrawer);
    filterDrawerClose?.addEventListener('click', closeFilterDrawer);
    filterDrawerCancel?.addEventListener('click', closeFilterDrawer);
    filterDrawerApply?.addEventListener('click', closeFilterDrawer);
    filterDrawerClear?.addEventListener('click', () => {
      activeFilterMode = 'shape';
      activeShapeFilter = 'all';
      activeColorFilter = '';
      activeFinishFilter = '';
      activeStorageFilter = '';
      expanded = false;
      updateFilterButtons();
      renderGallery();
      closeFilterDrawer();
    });

    modularKitchenGallery.addEventListener('click', (event) => {
      const heart = event.target.closest('.mk-fav');
      if (!heart) return;

      event.preventDefault();
      event.stopPropagation();
      openLoginModal();
    });

    loginBackdrop?.addEventListener('click', closeLoginModal);
    loginClose?.addEventListener('click', closeLoginModal);
    loginSubmit?.addEventListener('click', sendLoginLead);
    loginGoogle?.addEventListener('click', closeLoginModal);

    if (loginModal) {
      loginModal.setAttribute('aria-hidden', 'true');
    }

    loadMoreButton?.addEventListener('click', () => {
      expanded = true;
      renderGallery();
    });

    if (filterDrawer) {
      filterDrawer.setAttribute('aria-hidden', 'true');
    }

    document.querySelector('.mk-filter-outline')?.addEventListener('click', (event) => {
      event.preventDefault();
      openFilterDrawer();
    });

    updateFilterButtons();
    renderGallery();
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

  document.querySelectorAll('.mk-accessories-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.mk-accessories-track');
    const cards = Array.from(carousel.querySelectorAll('.mk-accessory-card'));
    const prevButton = carousel.querySelector('.mk-accessories-arrow-prev');
    const nextButton = carousel.querySelector('.mk-accessories-arrow-next');
    let activeIndex = 0;

    if (!track || cards.length === 0 || !prevButton || !nextButton) return;

    const getVisibleCount = () => {
      if (window.matchMedia('(max-width: 520px)').matches) return 1;
      if (window.matchMedia('(max-width: 900px)').matches) return 2;
      return 4;
    };

    const updateCarousel = () => {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(cards.length - visibleCount, 0);
      activeIndex = Math.min(activeIndex, maxIndex);
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;

      track.style.transform = `translateX(-${activeIndex * (cardWidth + gap)}px)`;
      prevButton.disabled = activeIndex === 0;
      nextButton.disabled = activeIndex === maxIndex;
    };

    prevButton.addEventListener('click', () => {
      activeIndex = Math.max(activeIndex - 1, 0);
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      activeIndex += 1;
      updateCarousel();
    });

    window.addEventListener('resize', updateCarousel, { passive: true });
    updateCarousel();
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

    if (event.key === 'Escape' && modularKitchenLoginModal?.classList.contains('is-open')) {
      closeModularKitchenLoginModal();
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
