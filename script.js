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

  const rewards = {
    tier1: {
      icon: '💰',
      title: 'Cashback Extravaganza!',
      prize: '₹1,000 Cash Back',
      desc: 'Congratulations! Your ₹1,000 instant cashback reward has been processed to your account.'
    }
  };

  let referralCompleted = false;
  let rewardRevealed = false;

  const referralStatusText = document.getElementById('referralStatusText');
  const openGiftButton = document.getElementById('openGiftButton');
  const celebrateBox = document.getElementById('celebrationBox');
  const simulateCompletion = document.getElementById('simulateCompletion');

  const updateGiftState = () => {
    if (!openGiftButton) return;

    if (rewardRevealed) {
      openGiftButton.disabled = true;
      openGiftButton.classList.add('disabled');
      openGiftButton.innerText = 'Gift Claimed';
      if (referralStatusText) {
        referralStatusText.innerText = 'Referral completed and reward claimed. Thank you for referring a ₹4,00,000 project!';
      }
      return;
    }

    if (referralCompleted) {
      openGiftButton.disabled = false;
      openGiftButton.classList.remove('disabled');
      openGiftButton.innerText = 'Open Gift';
      if (referralStatusText) {
        referralStatusText.innerText = 'Referral completed: ₹4,00,000 project finished and paid. Open your gift now.';
      }
      if (celebrateBox) {
        celebrateBox.classList.add('ready');
      }
    } else {
      openGiftButton.disabled = true;
      openGiftButton.classList.add('disabled');
      openGiftButton.innerText = 'Open Gift';
      if (referralStatusText) {
        referralStatusText.innerText = 'Waiting for referred project ₹4,00,000 to be completed and paid.';
      }
      if (celebrateBox) {
        celebrateBox.classList.remove('ready');
      }
    }
  };

  const openRewardModal = () => {
    if (!referralCompleted || rewardRevealed) return;

    const reward = rewards.tier1;
    if (!reward) return;

    rewardRevealed = true;
    updateGiftState();

    if (celebrateBox) {
      celebrateBox.classList.add('opened');
    }

    document.getElementById('modalIcon').innerText = reward.icon;
    document.getElementById('modalTitle').innerText = reward.title;
    document.getElementById('modalPrize').innerText = reward.prize;
    document.getElementById('modalDescription').innerText = reward.desc;
    document.getElementById('rewardModal').classList.add('active');
  };

  const closeRewardModal = () => {
    document.getElementById('rewardModal').classList.remove('active');
  };

  if (openGiftButton) {
    openGiftButton.addEventListener('click', () => {
      if (!referralCompleted) {
        if (referralStatusText) {
          referralStatusText.innerText = 'Complete the referred ₹4,00,000 project and payment first to open the gift.';
        }
        return;
      }
      openRewardModal();
    });
  }

  if (simulateCompletion) {
    simulateCompletion.addEventListener('click', () => {
      referralCompleted = true;
      updateGiftState();
    });
  }

  const eligibilityModal = document.getElementById('eligibilityModal');
  const confirmEligibilityButton = document.getElementById('confirmEligibilityButton');

  const showEligibilityModal = () => {
    if (eligibilityModal) {
      eligibilityModal.classList.add('active');
    }
  };

  const closeEligibilityModal = () => {
    if (eligibilityModal) {
      eligibilityModal.classList.remove('active');
    }
  };

  if (openGiftButton) {
    openGiftButton.addEventListener('click', () => {
      if (!referralCompleted) {
        if (referralStatusText) {
          referralStatusText.innerText = 'Complete the referred ₹4,00,000 project and payment first to open the gift.';
        }
        return;
      }
      showEligibilityModal();
    });
  }

  if (confirmEligibilityButton) {
    confirmEligibilityButton.addEventListener('click', () => {
      closeEligibilityModal();
      openRewardModal();
    });
  }

  const closeModalBtn = document.getElementById('closeRewardModal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeRewardModal);
  }

  const modalOverlay = document.getElementById('rewardModal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        closeRewardModal();
      }
    });
  }

  const eligibilityOverlay = document.getElementById('eligibilityModal');
  if (eligibilityOverlay) {
    eligibilityOverlay.addEventListener('click', (event) => {
      if (event.target === eligibilityOverlay) {
        closeEligibilityModal();
      }
    });
  }

  updateGiftState();
});
