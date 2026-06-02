var swiper = new Swiper(".testimonialSwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  autoplay: {
    delay: 3000,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

document.querySelectorAll(".play-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    var video = this.parentElement.querySelector("video");
    if (video) {
      video.play();
      this.style.display = "none";
    }
  });
});
