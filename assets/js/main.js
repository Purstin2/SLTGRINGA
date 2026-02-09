// Main JS for Mega STL Pack project
// Here you can put page behaviors.

// Global error handling
window.addEventListener("error", (e) => {
  console.error("Captured error:", e.error);
});

// Function to capture UTMs and add to destination URL
function getUtmParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = new URLSearchParams();

  // List of UTM parameters to capture
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'];

  // 1st PRIORITY: UTMs from current URL
  utmKeys.forEach(key => {
    if (urlParams.has(key)) {
      utmParams.set(key, urlParams.get(key));
    }
  });

  // 2nd PRIORITY: If not found in URL, get from sessionStorage (captured on load)
  if (utmParams.toString() === '') {
    try {
      const capturedUtms = sessionStorage.getItem('captured_utms');
      if (capturedUtms) {
        const parsed = JSON.parse(capturedUtms);
        utmKeys.forEach(key => {
          if (parsed[key]) {
            utmParams.set(key, parsed[key]);
          }
        });
      }
    } catch (e) {
      console.log('Error reading UTMs from sessionStorage:', e);
    }
  }

  // 3rd PRIORITY: Try to get from localStorage (where Utmify may save)
  if (utmParams.toString() === '') {
    try {
      const utmifyData = localStorage.getItem('utms');
      if (utmifyData) {
        const parsed = JSON.parse(utmifyData);
        utmKeys.forEach(key => {
          if (parsed[key]) {
            utmParams.set(key, parsed[key]);
          }
        });
      }
    } catch (e) {
      console.log('Error reading UTMs from localStorage:', e);
    }
  }

  return utmParams.toString();
}

// Function to redirect with UTMs
function redirectWithUtm(url) {
  const utmString = getUtmParams();
  const separator = url.includes('?') ? '&' : '?';
  const finalUrl = utmString ? `${url}${separator}${utmString}` : url;
  console.log('Redirecting to:', finalUrl);
  window.location.href = finalUrl;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded successfully!");

  // Log detected UTMs (DEBUG)
  const utms = getUtmParams();
  console.log('========== DEBUG UTMs ==========');
  console.log('Current URL:', window.location.href);
  console.log('UTM parameters that will be sent:', utms || 'NONE');

  // Check sessionStorage (immediate capture)
  try {
    const capturedUtms = sessionStorage.getItem('captured_utms');
    console.log('Captured UTMs (sessionStorage):', capturedUtms || 'NONE');
  } catch (e) {
    console.log('Error reading sessionStorage:', e);
  }

  // Check Utmify localStorage
  try {
    const utmifyData = localStorage.getItem('utms');
    console.log('Utmify data (localStorage):', utmifyData || 'NONE');
  } catch (e) {
    console.log('Error reading localStorage:', e);
  }

  console.log('================================');

  // Visual alert if UTMs were detected (testing only - remove later)
  if (utms) {
    console.log('%c✓ UTMs DETECTED AND WILL BE PROPAGATED!', 'color: green; font-size: 16px; font-weight: bold;');
  } else {
    console.log('%c⚠ NO UTMs DETECTED - Check if you are accessing with ?utm_source=...', 'color: orange; font-size: 14px;');
  }

  // Automatically update year in footer
  const yearSpan = document.getElementById("ano-atual");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // Main button - scroll to pricing section
  const btnComprar = document.getElementById("btn-comprar");
  if (btnComprar) {
    btnComprar.addEventListener("click", () => {
      const secaoPrecos = document.getElementById("secao-precos");
      if (secaoPrecos) {
        secaoPrecos.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Basic Pack Button - Opens upgrade modal
  const btnComprarBasico = document.getElementById("btn-comprar-basico");
  const upgradeModal = document.getElementById("upgrade-modal");
  const btnUpgradeYes = document.getElementById("btn-upgrade-yes");
  const btnUpgradeNo = document.getElementById("btn-upgrade-no");

  if (btnComprarBasico && upgradeModal) {
    btnComprarBasico.addEventListener("click", (e) => {
      e.preventDefault();
      upgradeModal.classList.add("active");
    });
  }

  // "Yes, I want the discount" button - Intercept click to add UTMs
  if (btnUpgradeYes) {
    btnUpgradeYes.addEventListener("click", (e) => {
      e.preventDefault();
      redirectWithUtm("https://buy.stripe.com/aFaaEY71RfBy3bvegr6g80a");
    });
  }

  // "No thanks" button - Redirects to Basic and closes modal
  if (btnUpgradeNo) {
    btnUpgradeNo.addEventListener("click", () => {
      upgradeModal.classList.remove("active");
      redirectWithUtm("https://buy.stripe.com/28E5kEfynahe3bvdcn6g80b");
    });
  }

  // Close modal when clicking overlay
  if (upgradeModal) {
    const overlay = upgradeModal.querySelector(".upgrade-modal__overlay");
    if (overlay) {
      overlay.addEventListener("click", () => {
        upgradeModal.classList.remove("active");
      });
    }
  }

  // Premium Pack Button
  const btnComprarPremium = document.getElementById("btn-comprar-premium");
  if (btnComprarPremium) {
    btnComprarPremium.addEventListener("click", () => {
      redirectWithUtm("https://buy.stripe.com/9B6cN6euj3SQ8vP8W76g809");
    });
  }

  // Buy with Guarantee Button
  const btnComprarGarantia = document.getElementById("btn-comprar-garantia");
  if (btnComprarGarantia) {
    btnComprarGarantia.addEventListener("click", () => {
      // Scroll to pricing section
      const secaoPrecos = document.getElementById("secao-precos");
      if (secaoPrecos) {
        secaoPrecos.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Gallery Carousel
  const carousel = document.querySelector(".gallery-carousel");
  if (carousel) {
    const track = carousel.querySelector(".gallery-carousel__track");
    const slides = carousel.querySelectorAll(".gallery-carousel__slide");
    const prevBtn = carousel.querySelector(".gallery-carousel__btn--prev");
    const nextBtn = carousel.querySelector(".gallery-carousel__btn--next");
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let isTransitioning = false;

    const updateCarousel = () => {
      if (track) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    };

    const nextSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
      setTimeout(() => {
        isTransitioning = false;
      }, 300);
    };

    const prevSlide = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
      setTimeout(() => {
        isTransitioning = false;
      }, 300);
    };

    // Initialize carousel
    updateCarousel();

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  }

  // WhatsApp Testimonials Carousel
  const whatsappCarousel = document.querySelector(".whatsapp-carousel");
  if (whatsappCarousel) {
    const whatsappTrack = whatsappCarousel.querySelector(".whatsapp-carousel__track");
    const whatsappSlides = whatsappCarousel.querySelectorAll(".whatsapp-carousel__slide");
    const whatsappPrevBtn = whatsappCarousel.querySelector(".whatsapp-carousel__btn--prev");
    const whatsappNextBtn = whatsappCarousel.querySelector(".whatsapp-carousel__btn--next");
    
    let whatsappCurrentIndex = 0;
    const whatsappTotalSlides = whatsappSlides.length;
    let whatsappIsTransitioning = false;

    const updateWhatsappCarousel = () => {
      if (whatsappTrack) {
        whatsappTrack.style.transform = `translateX(-${whatsappCurrentIndex * 100}%)`;
      }
    };

    const whatsappNextSlide = () => {
      if (whatsappIsTransitioning) return;
      whatsappIsTransitioning = true;
      whatsappCurrentIndex = (whatsappCurrentIndex + 1) % whatsappTotalSlides;
      updateWhatsappCarousel();
      setTimeout(() => {
        whatsappIsTransitioning = false;
      }, 400);
    };

    const whatsappPrevSlide = () => {
      if (whatsappIsTransitioning) return;
      whatsappIsTransitioning = true;
      whatsappCurrentIndex = (whatsappCurrentIndex - 1 + whatsappTotalSlides) % whatsappTotalSlides;
      updateWhatsappCarousel();
      setTimeout(() => {
        whatsappIsTransitioning = false;
      }, 400);
    };

    // Initialize carousel
    updateWhatsappCarousel();

    if (whatsappNextBtn) whatsappNextBtn.addEventListener("click", whatsappNextSlide);
    if (whatsappPrevBtn) whatsappPrevBtn.addEventListener("click", whatsappPrevSlide);
  }
  
  // Countdown timer
  const countdownTimer = document.getElementById("countdown-timer");
  if (countdownTimer) {
    let minutes = 13;
    let seconds = 22;
    
    const updateTimer = () => {
      countdownTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      
      if (seconds === 0) {
        if (minutes === 0) {
          // Reset to 13:22 when it reaches 00:00
          minutes = 13;
          seconds = 22;
        } else {
          minutes--;
          seconds = 59;
        }
      } else {
        seconds--;
      }
    };
    
    // Update every second
    setInterval(updateTimer, 1000);
    // Update immediately
    updateTimer();
  }
  
  // ========== ANTI-INSPECTION PROTECTION ==========
  const redirectAntiInspecionar = () => {
    window.location.href = "https://www.google.com/";
  };

  // Block right-click
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // Block common keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S, Ctrl+P)
  document.addEventListener("keydown", (e) => {
    const key = e.key?.toLowerCase();

    // F12
    if (e.key === "F12") {
      e.preventDefault();
      redirectAntiInspecionar();
      return;
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) {
      e.preventDefault();
      redirectAntiInspecionar();
      return;
    }

    // Ctrl+U (view source), Ctrl+S (save), Ctrl+P (print)
    if (e.ctrlKey && ["u", "s", "p"].includes(key)) {
      e.preventDefault();
      redirectAntiInspecionar();
      return;
    }
  });

  // Block copy event
  document.addEventListener("copy", (e) => {
    e.preventDefault();
    e.clipboardData?.setData("text/plain", "");
  });

  // Simple attempt to detect DevTools open by window size difference
  setInterval(() => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      redirectAntiInspecionar();
    }
  }, 1000);

  // Update ALL checkout links automatically with UTMs
  function updateAllCheckoutLinks() {
    const checkoutLinks = document.querySelectorAll('a[href*="buy.stripe.com"], a[href*="ggcheckout.com"]');
    checkoutLinks.forEach(link => {
      // If it doesn't have custom click event yet
      if (!link.dataset.utmUpdated) {
        link.dataset.utmUpdated = "true";
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const originalUrl = link.getAttribute("href");
          redirectWithUtm(originalUrl);
        });
      }
    });
  }

  // Update links when page loads
  updateAllCheckoutLinks();

  // Update again after 1 second (in case elements are loaded dynamically)
  setTimeout(updateAllCheckoutLinks, 1000);

  console.log("JavaScript initialized successfully! (protections active)");
});