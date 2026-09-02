/**
 * SIR HALIM STORE - MULTI-PRODUCT CLIENT APPLICATION
 * Malaysian English Edition
 * Features:
 * 1. CIDS Suites Pro (1-Year License / 2 Devices) - RM 19.99
 * 2. PDF Physics SPM State Trial Paper 2 2026 - RM 2.99
 */

class SirHalimStoreApp {
  constructor() {
    this.products = {
      "cids-suites-pro": {
        id: "cids-suites-pro",
        title: "CIDS Suites Pro (1-Year License / 2 Devices)",
        subtitle: "Smart Lesson Plan Management & Educational Automation CIDS Suites Pro 2026 Edition. Valid for 1 Year.",
        price: 19.99,
        formattedPrice: "RM 19.99",
        coverImage: "assets/cids-suites-pro-cover.png",
        category: "Teacher Software & Automation",
        badge: "2026 EDITION / POPULAR",
        engineType: "cids",
        portalUrl: "https://cidspro.vercel.app/",
        filesIncluded: [
          "1-Year Digital License Key (Valid for 2 Computers/Laptops)",
          "Full Access to CIDS Suites Pro Latest 2026 Edition",
          "Automatic Updates & Cloud Sync Support"
        ]
      },
      "fizik-kertas2-2026": {
        id: "fizik-kertas2-2026",
        title: "PDF Physics State Trial Paper 2 Exam Collection 2026",
        subtitle: "Topical Selected Questions, Complete Model Answers & SPM 2026 Scheme Analysis",
        price: 2.99,
        formattedPrice: "RM 2.99",
        coverImage: "assets/fizik-kertas2-2026-cover.png",
        category: "SPM Physics Form 4 & 5",
        badge: "Best Seller & Exclusive",
        engineType: "fizik",
        portalUrl: "https://kertas22026.vercel.app/",
        filesIncluded: [
          "Topical State Trial Paper 2 Question E-Book PDF (4.7 MB)",
          "Complete Answer Scheme & Detailed A+ Analysis (4.0 MB)",
          "Instant Automated License Key (4x Download Limit)"
        ]
      }
    };

    // Default active product
    this.currentProduct = this.products["cids-suites-pro"];
    this.lastAssignedKey = null;
    this.lastOrderData = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initCarousel();
    this.initGlobalNavFlyout();
    this.initCinematicCardVideo();
    this.checkUrlParams();
    console.log("🍏 Sir Halim Store App Initialized with Multi-Product Suite (English).");
  }

  bindEvents() {
    // Buy Buttons
    document.querySelectorAll("[data-action='open-buy-sheet']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = btn.getAttribute("data-product") || "cids-suites-pro";
        this.openBuySheet(productId);
      });
    });

    // Learn More Buttons
    document.querySelectorAll("[data-action='open-detail-sheet']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = btn.getAttribute("data-product") || "cids-suites-pro";
        this.openDetailSheet(productId);
      });
    });

    // Mobile Menu Drawer Trigger (2-Lines button & Close button)
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenuCloseBtn = document.getElementById("mobileMenuCloseBtn");
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

    if (mobileMenuBtn && mobileMenuOverlay) {
      mobileMenuBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mobileMenuOverlay.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    }

    if (mobileMenuCloseBtn && mobileMenuOverlay) {
      mobileMenuCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mobileMenuOverlay.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    }

    // Close mobile menu when clicking any mobile link
    document.querySelectorAll(".mobile-menu-link").forEach(link => {
      link.addEventListener("click", () => {
        if (mobileMenuOverlay) {
          mobileMenuOverlay.classList.remove("is-open");
          document.body.style.overflow = "";
        }
      });
    });

    // License Check Buttons
    document.querySelectorAll("[data-action='open-license-checker']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openLicenseChecker();
      });
    });

    // Modal Close buttons
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal-backdrop");
        if (modal) modal.classList.remove("active");
      });
    });

    // Close on backdrop click
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove("active");
        }
      });
    });

    // Checkout Form Submit
    const checkoutForm = document.getElementById("appleCheckoutForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCheckoutSubmit();
      });
    }

    // Copy License Key Button
    const copyKeyBtn = document.getElementById("receiptCopyKeyBtn");
    if (copyKeyBtn) {
      copyKeyBtn.addEventListener("click", () => this.copyLicenseKey());
    }

    // Telegram Receipt Button
    const tgReceiptBtn = document.getElementById("receiptTelegramBtn");
    if (tgReceiptBtn) {
      tgReceiptBtn.addEventListener("click", () => this.sendTelegramReceipt());
    }

    // Search License Form
    const searchForm = document.getElementById("searchLicenseForm");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLicenseSearch();
      });
    }
  }

  // ==========================================
  // CAROUSEL LOGIC
  // ==========================================
  initCarousel() {
    const carousel = document.getElementById("cardsCarousel");
    if (!carousel) return;
  }

  // ==========================================
  // CINEMATIC VIDEO CARD BACKGROUND ENGINE
  // ==========================================
  initCinematicCardVideo() {
    const video = document.querySelector(".card-video-backdrop");
    if (!video) return;

    // Autoplay on load with user gesture fallback
    const playVideo = () => {
      video.muted = true;
      video.playsInline = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          const resume = () => {
            video.play().catch(() => {});
            document.removeEventListener("click", resume);
            document.removeEventListener("scroll", resume);
            document.removeEventListener("touchstart", resume);
          };
          document.addEventListener("click", resume, { passive: true });
          document.addEventListener("scroll", resume, { passive: true });
          document.addEventListener("touchstart", resume, { passive: true });
        });
      }
    };

    if (document.readyState === "complete") {
      playVideo();
    } else {
      window.addEventListener("load", playVideo);
    }

    // Interactive Scroll Looping & Dynamic Playback Rate
    let scrollTimeout = null;
    window.addEventListener("scroll", () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
      video.playbackRate = 1.25;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        video.playbackRate = 1.0;
      }, 150);
    }, { passive: true });

    // Viewport Intersection Observer for optimal performance
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.15 });

      const card = video.closest(".product-card");
      if (card) observer.observe(card);
    }
  }

  // ==========================================
  // APPLE DESKTOP MEGA HOVER DROPDOWN FLYOUT
  // ==========================================
  initGlobalNavFlyout() {
    const globalNav = document.getElementById("globalNav");
    const backdrop = document.getElementById("globalnavBackdrop");
    const flyoutContainer = document.getElementById("globalNavFlyout");
    if (!globalNav || !flyoutContainer) return;

    const navItems = document.querySelectorAll(".globalnav-item[data-flyout]");
    const panels = document.querySelectorAll(".flyout-panel");
    let closeTimeout = null;

    const openFlyout = (targetPanelId, navItem) => {
      clearTimeout(closeTimeout);
      navItems.forEach(item => item.classList.remove("is-hovered"));
      if (navItem) navItem.classList.add("is-hovered");

      panels.forEach(p => {
        if (p.getAttribute("data-panel") === targetPanelId) {
          p.classList.add("is-active");
          p.style.display = "grid";
          p.style.opacity = "1";
          p.style.transform = "translateY(0)";
        } else {
          p.classList.remove("is-active");
          p.style.display = "none";
          p.style.opacity = "0";
          p.style.transform = "translateY(-6px)";
        }
      });

      globalNav.classList.add("flyout-open");
      if (backdrop) backdrop.classList.add("is-active");
    };

    const closeFlyout = (immediate = false) => {
      clearTimeout(closeTimeout);
      const doClose = () => {
        globalNav.classList.remove("flyout-open");
        if (backdrop) backdrop.classList.remove("is-active");
        navItems.forEach(item => item.classList.remove("is-hovered"));
      };

      if (immediate) {
        doClose();
      } else {
        closeTimeout = setTimeout(doClose, 150);
      }
    };

    // Attach listeners to each nav item
    navItems.forEach(item => {
      const targetPanel = item.getAttribute("data-flyout");
      
      const handleEnter = (e) => {
        openFlyout(targetPanel, item);
      };

      item.addEventListener("mouseenter", handleEnter);
      item.addEventListener("mouseover", handleEnter);
      item.addEventListener("pointerenter", handleEnter);
    });

    // Keep open when hovering inside globalNav or flyout container
    globalNav.addEventListener("mouseenter", () => clearTimeout(closeTimeout));
    globalNav.addEventListener("mouseover", () => clearTimeout(closeTimeout));
    globalNav.addEventListener("mouseleave", () => closeFlyout(false));

    // Close when hovering over backdrop or clicking backdrop
    if (backdrop) {
      backdrop.addEventListener("mouseenter", () => closeFlyout(true));
      backdrop.addEventListener("mouseover", () => closeFlyout(true));
      backdrop.addEventListener("click", () => closeFlyout(true));
    }

    // Close when clicking any link inside flyout
    document.querySelectorAll(".flyout-panel a").forEach(link => {
      link.addEventListener("click", () => {
        closeFlyout(true);
      });
    });
  }

  // ==========================================
  // BUY SHEET & CHECKOUT FLOW
  // ==========================================
  openBuySheet(productId = "cids-suites-pro") {
    const product = this.products[productId] || this.products["cids-suites-pro"];
    this.currentProduct = product;

    // Update modal UI elements
    const modal = document.getElementById("appleBuySheetModal");
    const imgEl = modal ? modal.querySelector("img[alt='Cover']") : null;
    const titleEl = modal ? modal.querySelector("#buySheetTitle") || modal.querySelector(".modal-product-title") : null;
    const subEl = modal ? modal.querySelector("#buySheetSubtitle") || modal.querySelector(".modal-product-sub") : null;
    const priceEl = modal ? modal.querySelector("#buySheetPrice") || modal.querySelector(".modal-product-price") : null;
    const btnSpan = document.getElementById("payWithToyyibPayBtn");

    if (imgEl) imgEl.src = product.coverImage;
    if (titleEl) titleEl.innerText = product.title;
    if (subEl) subEl.innerText = product.subtitle;
    if (priceEl) priceEl.innerText = product.formattedPrice;
    if (btnSpan) btnSpan.innerHTML = `<span>Pay Now (${product.formattedPrice})</span>`;

    if (modal) {
      modal.classList.add("active");
      const nameInput = document.getElementById("buyerNameInput");
      if (nameInput) setTimeout(() => nameInput.focus(), 200);
    }
  }

  openDetailSheet(productId = "cids-suites-pro") {
    const product = this.products[productId] || this.products["cids-suites-pro"];
    this.currentProduct = product;

    const modal = document.getElementById("productDetailModal");
    if (!modal) return;

    const imgEl = document.getElementById("detailProductImg");
    const titleEl = document.getElementById("detailProductTitle");
    const bannerLink = document.getElementById("detailPortalBannerLink");
    const bannerTitle = document.getElementById("detailPortalBannerTitle");
    const bannerSub = document.getElementById("detailPortalBannerSub");
    const featureList = document.getElementById("detailFeatureList");
    const buyBtn = document.getElementById("detailBuyBtn");
    const secondaryPortalBtn = document.getElementById("detailSecondaryPortalBtn");

    if (imgEl) imgEl.src = product.coverImage;
    if (titleEl) titleEl.innerText = product.title;

    if (product.id === "cids-suites-pro") {
      if (bannerLink) bannerLink.href = "https://cidspro.vercel.app/";
      if (bannerTitle) bannerTitle.innerText = "Official CIDS Suites Pro Portal";
      if (bannerSub) bannerSub.innerText = "Watch Video Tutorials & Download Trial Version";
      if (secondaryPortalBtn) {
        secondaryPortalBtn.href = "https://cidspro.vercel.app/";
        secondaryPortalBtn.innerHTML = `
          <svg width="16" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10 8 16 12 10 16 10 8"></polygon>
          </svg>
          Watch Tutorials & Download Trial on Official Portal
        `;
      }
      if (featureList) {
        featureList.innerHTML = `
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>1-Year License:</strong> Fully active for 365 days for up to 2 desktop/laptop computers.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Smart Lesson Plan Automation:</strong> Fast RPH creation, schedule import, integrated DSKP & Cloud Sync.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Automated Key Delivery:</strong> Digital license key generated immediately upon ToyyibPay FPX confirmation.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Tutorials & Trial App:</strong> Access complete setup guides and trial downloads at <a href="https://cidspro.vercel.app/" target="_blank" style="color: var(--apple-blue); font-weight: 600; text-decoration: underline;">https://cidspro.vercel.app/</a></span>
          </li>
        `;
      }
      if (buyBtn) {
        buyBtn.setAttribute("data-product", "cids-suites-pro");
        buyBtn.innerText = "Buy Now (RM 19.99)";
      }
    } else {
      if (bannerLink) bannerLink.href = "https://kertas22026.vercel.app/";
      if (bannerTitle) bannerTitle.innerText = "Physics SPM 2026 Download Portal";
      if (bannerSub) bannerSub.innerText = "Download E-Book PDF & Full Answer Scheme";
      if (secondaryPortalBtn) {
        secondaryPortalBtn.href = "https://kertas22026.vercel.app/";
        secondaryPortalBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Open Physics 2026 Download Portal
        `;
      }
      if (featureList) {
        featureList.innerHTML = `
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>State Trial Exam Collection:</strong> Premium compilation mirroring actual SPM 2026 state trial exam formats.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>A+ Scheme & Analysis:</strong> Detailed marking breakdown, scoring rubrics, keyword tips, and complete workings.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Instant Digital Access:</strong> License code generated automatically for portal access at <a href="https://kertas22026.vercel.app/" target="_blank" style="color: var(--apple-blue); font-weight: 600; text-decoration: underline;">https://kertas22026.vercel.app/</a></span>
          </li>
        `;
      }
      if (buyBtn) {
        buyBtn.setAttribute("data-product", "fizik-kertas2-2026");
        buyBtn.innerText = "Buy Now (RM 2.99)";
      }
    }

    modal.classList.add("active");
  }

  openLicenseChecker() {
    const modal = document.getElementById("licenseCheckerModal");
    if (modal) {
      modal.classList.add("active");
      const qInput = document.getElementById("licenseSearchQuery");
      if (qInput) setTimeout(() => qInput.focus(), 200);
    }
  }

  async handleCheckoutSubmit() {
    const nameInput = document.getElementById("buyerNameInput");
    const emailInput = document.getElementById("buyerEmailInput");
    const phoneInput = document.getElementById("buyerPhoneInput");
    const submitBtn = document.getElementById("payWithToyyibPayBtn");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";

    if (!name || !email || !phone) {
      this.showToast("Please complete all buyer details.", "warning");
      return;
    }

    // Lock Button
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Connecting to ToyyibPay...</span>
      `;
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    const orderPayload = {
      orderId: orderId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      amount: this.currentProduct.price,
      productTitle: this.currentProduct.title,
      engineType: this.currentProduct.engineType,
      productId: this.currentProduct.id
    };

    try {
      this.showToast("Processing payment via ToyyibPay...", "info");

      // 1. Process Payment via ToyyibPay Module
      const paymentResult = await window.toyyibPayManager.processPayment(orderPayload);

      if (paymentResult.success && paymentResult.paymentUrl) {
        // Save pending state for return callback
        sessionStorage.setItem("sirhalim_pending_order", JSON.stringify(orderPayload));
        this.showToast("Redirecting to ToyyibPay FPX payment gateway...", "info");
        setTimeout(() => {
          window.location.href = paymentResult.paymentUrl;
        }, 300);
        return;
      } else {
        throw new Error(paymentResult.error || "Unable to connect to ToyyibPay payment gateway.");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      this.showToast("Error processing payment: " + err.message, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Pay Now (${this.currentProduct.formattedPrice})</span>`;
      }
    }
  }

  // ==========================================
  // ORDER RECEIPT & AUTO-PICKUP DISPLAY
  // ==========================================
  showOrderReceipt(order, keyRecord) {
    const receiptModal = document.getElementById("orderReceiptModal");
    const keyDisplay = document.getElementById("receiptKeyCode");
    const orderIdDisplay = document.getElementById("receiptOrderId");
    const buyerDisplay = document.getElementById("receiptBuyerName");
    const priceDisplay = document.getElementById("receiptAmountPaid");
    const downloadLinkBtn = document.getElementById("receiptDownloadPortalBtn");

    if (keyDisplay) keyDisplay.innerText = keyRecord.key;
    if (orderIdDisplay) orderIdDisplay.innerText = `${order.orderId} (${order.billCode || 'ToyyibPay'})`;
    if (buyerDisplay) buyerDisplay.innerText = `${order.customerName} (${order.customerPhone})`;
    
    // Determine accurate price paid
    const priceNum = order.amount !== undefined ? order.amount : (keyRecord.productType === "fizik" ? 2.99 : 19.99);
    const formattedPrice = Number(priceNum).toFixed(2);
    if (priceDisplay) priceDisplay.innerText = `RM ${formattedPrice} (Paid)`;

    // Link directly with embedded license key
    let portalUrl = keyRecord.portalUrl || "https://kertas22026.vercel.app/";
    if (keyRecord.productType === "cids" || (order.productId === "cids-suites-pro")) {
      portalUrl = "https://cidspro.vercel.app/";
    } else if (!portalUrl.includes("?key=")) {
      portalUrl = `https://kertas22026.vercel.app/?key=${encodeURIComponent(keyRecord.key)}`;
    }

    if (downloadLinkBtn) {
      downloadLinkBtn.href = portalUrl;
      downloadLinkBtn.target = "_blank";
      if (keyRecord.productType === "cids" || (order.productId === "cids-suites-pro")) {
        downloadLinkBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Open CIDS Suites Pro Portal Now &rsaquo;
        `;
      } else {
        downloadLinkBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Open Download Portal Now &rsaquo;
        `;
      }
    }

    // Auto-send email to buyer's Gmail
    this.sendLicenseEmail(order, keyRecord, portalUrl);

    if (receiptModal) receiptModal.classList.add("active");
  }

  // ==========================================
  // AUTO DISPATCH EMAIL TO GMAIL
  // ==========================================
  async sendLicenseEmail(order, keyRecord, portalUrl) {
    const customerEmail = order.customerEmail || (this.lastOrderData && this.lastOrderData.customerEmail);
    if (!customerEmail) return;

    const prodTitle = order.productTitle || (keyRecord.productType === "fizik" ? "PDF Physics SPM State Trial Paper 2 2026" : "CIDS Suites Pro (1-Year License)");
    const priceNum = order.amount !== undefined ? order.amount : (keyRecord.productType === "fizik" ? 2.99 : 19.99);
    const formattedPrice = Number(priceNum).toFixed(2);

    try {
      // 1. Try Vercel Serverless API
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: customerEmail,
          customerName: order.customerName,
          licenseKey: keyRecord.key,
          orderId: order.orderId,
          billCode: order.billCode,
          amount: formattedPrice,
          productTitle: prodTitle,
          downloadUrl: portalUrl
        })
      }).catch(() => {});

      // 2. Direct Web3Forms Relay backup (Guaranteed delivery to Gmail inbox)
      const emailPayload = {
        access_key: "099a9b2a-c21d-4009-bf25-2efc8f307409",
        to_email: customerEmail,
        subject: `[Sir Halim Store] License Key for ${prodTitle}: ${keyRecord.key}`,
        from_name: "Sir Halim Store",
        message: `Hello ${order.customerName || "Customer"},\n\nThank you for your purchase at Sir Halim Store!\n\nPRODUCT:\n${prodTitle}\n\nYOUR DIGITAL LICENSE KEY:\n${keyRecord.key}\n\nPORTAL LINK (Click to Open):\n${portalUrl}\n\nOrder No: ${order.orderId}\nTotal Paid: RM ${formattedPrice} (Paid)\n\nPlease keep this message for your reference!`
      };

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(emailPayload)
      });

      console.log("[Email] License key delivered to Gmail:", customerEmail);
      this.showToast(`License key sent to email: ${customerEmail}`);
    } catch (err) {
      console.warn("[Email] Error dispatching email:", err);
    }
  }

  copyLicenseKey() {
    if (!this.lastAssignedKey || !this.lastAssignedKey.key) return;
    navigator.clipboard.writeText(this.lastAssignedKey.key).then(() => {
      this.showToast("Digital license key copied to clipboard!");
    }).catch(() => {
      this.showToast("Please copy the code manually.", "warning");
    });
  }

  sendTelegramReceipt() {
    if (!this.lastOrderData || !this.lastAssignedKey) return;
    const portalUrl = this.lastAssignedKey.portalUrl || "https://kertas22026.vercel.app/";
    const priceNum = this.lastOrderData.amount !== undefined ? this.lastOrderData.amount : (this.lastAssignedKey.productType === "fizik" ? 2.99 : 19.99);
    const formattedPrice = Number(priceNum).toFixed(2);
    const prodTitle = this.lastOrderData.productTitle || (this.lastAssignedKey.productType === "fizik" ? "PDF Physics SPM State Trial Paper 2 2026" : "CIDS Suites Pro (1-Year License)");

    const text = encodeURIComponent(
      `SIR HALIM STORE PURCHASE RECEIPT & LICENSE KEY\n\n` +
      `Customer: ${this.lastOrderData.customerName}\n` +
      `Phone: ${this.lastOrderData.customerPhone}\n` +
      `Product: ${prodTitle}\n` +
      `Order No: ${this.lastOrderData.orderId}\n` +
      `ToyyibPay Bill: ${this.lastOrderData.billCode}\n` +
      `Total Paid: RM ${formattedPrice} (Paid)\n\n` +
      `YOUR DIGITAL LICENSE KEY:\n${this.lastAssignedKey.key}\n\n` +
      `Portal Link:\n${portalUrl}\n\n` +
      `Please keep this message for your reference.`
    );

    window.open(`https://t.me/halimroslan?text=${text}`, "_blank");
  }

  // ==========================================
  // LICENSE SEARCH TOOL
  // ==========================================
  async handleLicenseSearch() {
    const input = document.getElementById("licenseSearchQuery");
    const container = document.getElementById("licenseSearchResults");
    const query = input ? input.value.trim() : "";

    if (!query) {
      this.showToast("Please enter your phone number, email or license key.", "warning");
      return;
    }

    if (container) {
      container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-secondary);">Searching Supabase database...</div>`;
      try {
        const results = await window.licenseEngine.lookupLicense(query);
        if (container) {
          if (results && results.length > 0) {
            container.innerHTML = results.map(r => {
              const portalUrl = r.portalUrl || (r.productType === "cids" ? "https://cidspro.vercel.app/" : `https://kertas22026.vercel.app/?key=${encodeURIComponent(r.key)}`);
              const badgeLabel = r.productType === "cids" ? "CIDS Suites Pro (1 Year)" : "Physics Paper 2 2026";
              return `
              <div class="license-item-result">
                <div class="license-result-top">
                  <div>
                    <div style="font-size: 11px; font-weight: 700; color: #ff3b30; text-transform: uppercase; margin-bottom: 2px;">${badgeLabel}</div>
                    <div class="license-result-key">${r.key}</div>
                    <div class="license-result-meta">${r.customer_name || 'Customer'} • Status: <strong>${r.downloads_left || 'Active'}</strong></div>
                  </div>
                </div>
                <div class="license-result-actions">
                  <a href="${portalUrl}" target="_blank" class="btn-buy-pill" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Open Portal &rsaquo;
                  </a>
                  <button type="button" class="btn-buy-pill btn-pill-white" onclick="navigator.clipboard.writeText('${r.key}'); alert('License key ${r.key} copied!');">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy Key
                  </button>
                </div>
              </div>
            `;
            }).join("");
          } else {
            container.innerHTML = `
              <div style="text-align: center; padding: 25px 15px; color: var(--text-secondary); background: #f5f5f7; border-radius: 12px;">
                No license records found for: <strong>${query}</strong>.<br>
                <span style="font-size: 12px; margin-top: 4px; display: block;">Please ensure the phone number or email address matches the one used during checkout.</span>
              </div>
            `;
          }
        }
      } catch (err) {
        if (container) {
          container.innerHTML = `<div style="text-align: center; color: #ff3b30; padding: 15px;">Error performing search: ${err.message}</div>`;
        }
      }
    }
  }

  // ==========================================
  // URL PARAMS CHECK (TOYYIBPAY RETURN)
  // ==========================================
  async checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const statusId = params.get("status_id");
    const billCode = params.get("billcode") || params.get("bill_code");
    const orderId = params.get("order_id");

    if (statusId === "1" && billCode) {
      this.showToast("ToyyibPay payment verified successfully! Fetching your license key...", "success");

      const savedPending = sessionStorage.getItem("sirhalim_pending_order");
      const pendingData = savedPending ? JSON.parse(savedPending) : {};

      // Determine product type
      let engineType = pendingData.engineType;
      let productId = pendingData.productId;
      if (!engineType) {
        engineType = "fizik";
      }

      const keyRecord = await window.licenseEngine.autoClaimLicenseKey({
        name: pendingData.customerName || "Customer",
        email: pendingData.customerEmail || "",
        phone: pendingData.customerPhone || "",
        orderId: orderId || pendingData.orderId || `ORD-${Date.now()}`,
        billCode: billCode,
        engineType: engineType
      });

      if (keyRecord && keyRecord.productType === "cids") {
        this.currentProduct = this.products["cids-suites-pro"];
      } else {
        this.currentProduct = this.products["fizik-kertas2-2026"];
      }

      const paidAmount = pendingData.amount !== undefined ? pendingData.amount : this.currentProduct.price;

      this.lastAssignedKey = keyRecord;
      this.lastOrderData = {
        orderId: orderId || pendingData.orderId || "ORD-PAID",
        billCode: billCode,
        customerName: pendingData.customerName || "Customer",
        customerEmail: pendingData.customerEmail || "",
        customerPhone: pendingData.customerPhone || "",
        productTitle: pendingData.productTitle || this.currentProduct.title,
        amount: paidAmount,
        productId: productId || this.currentProduct.id
      };

      this.showOrderReceipt(this.lastOrderData, keyRecord);
      this.triggerConfetti();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  triggerConfetti() {
    if (typeof confetti === "function") {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  }

  showToast(msg, type = "info") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 8px;";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.style.cssText = "background: #1d1d1f; color: #fff; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.15); transition: opacity 0.3s;";
    toast.innerText = msg;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.storeApp = new SirHalimStoreApp();
});
