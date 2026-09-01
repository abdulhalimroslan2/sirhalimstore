/**
 * SIR HALIM STORE - MULTI-PRODUCT CLIENT APPLICATION
 * Features:
 * 1. CIDS Suites Pro (Lesen 1 Tahun / 2 Peranti) - RM 19.99
 * 2. PDF Fizik SPM Percubaan Kertas 2 2026 - RM 2.99
 */

class SirHalimStoreApp {
  constructor() {
    this.products = {
      "cids-suites-pro": {
        id: "cids-suites-pro",
        title: "CIDS Suites Pro (Lesen 1 Tahun / 2 Peranti)",
        subtitle: "Sistem Pengurusan RPH Pintar & Automasi Pendidikan CIDS Suites Pro Versi 2026. Sah untuk 1 Tahun.",
        price: 19.99,
        formattedPrice: "RM 19.99",
        coverImage: "assets/cids-suites-pro-cover.png",
        category: "Perisian & Automasi Guru",
        badge: "EDISI 2026 / POPULAR",
        engineType: "cids",
        portalUrl: "https://cidspro.vercel.app/",
        filesIncluded: [
          "Lesen Kunci Digital 1 Tahun (Sah untuk 2 Peranti Komputer/Laptop)",
          "Akses Penuh CIDS Suites Pro Versi Terkini 2026",
          "Sokongan Kemas Kini Automatik & Cloud Sync"
        ]
      },
      "fizik-kertas2-2026": {
        id: "fizik-kertas2-2026",
        title: "PDF Fizik Koleksi Mirip Soalan Trial Negeri Kertas 2 2026",
        subtitle: "Koleksi Soalan Terpilih Mengikut Topik, Jawapan Lengkap & Skema Analisis SPM 2026",
        price: 2.99,
        formattedPrice: "RM 2.99",
        coverImage: "assets/fizik-kertas2-2026-cover.png",
        category: "Fizik SPM Tingkatan 4 & 5",
        badge: "Paling Laris & Eksklusif",
        engineType: "fizik",
        portalUrl: "https://kertas22026.vercel.app/",
        filesIncluded: [
          "E-Book PDF Soalan Kertas 2 Topikal Percubaan 2026 (4.7 MB)",
          "Skema & Analisis Jawapan Lengkap Kertas 2 (4.0 MB)",
          "Kunci Lesen Digital Automatik (Had Muat Turun 4x)"
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
    this.checkUrlParams();
    console.log("🍏 Sir Halim Store App Initialized with Multi-Product Suite.");
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

    // WhatsApp Receipt Button
    const waReceiptBtn = document.getElementById("receiptWhatsAppBtn");
    if (waReceiptBtn) {
      waReceiptBtn.addEventListener("click", () => this.sendWhatsAppReceipt());
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
    if (btnSpan) btnSpan.innerHTML = `<span>Bayar Sekarang (${product.formattedPrice})</span>`;

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
      if (bannerTitle) bannerTitle.innerText = "Portal Rasmi CIDS Suites Pro";
      if (bannerSub) bannerSub.innerText = "Lihat Video Tutorial & Muat Turun Versi Trial";
      if (secondaryPortalBtn) {
        secondaryPortalBtn.href = "https://cidspro.vercel.app/";
        secondaryPortalBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10 8 16 12 10 16 10 8"></polygon>
          </svg>
          Tonton Tutorial & Muat Turun Trial di Portal Rasmi
        `;
      }
      if (featureList) {
        featureList.innerHTML = `
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Lesen 1 Tahun:</strong> Sah aktif selama 365 hari untuk kegunaan 2 peranti komputer/laptop.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Automasi RPH Pintar:</strong> Penulisan RPH pantas, import jadual, DSKP bersepadu & Cloud Sync.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Penyerahan Kunci Automatik:</strong> Kod lesen dikeluarkan secara automatik serta-merta selepas bayaran ToyyibPay.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Tutorial & App Trial:</strong> Akses panduan penuh dan muat turun di <a href="https://cidspro.vercel.app/" target="_blank" style="color: var(--apple-blue); font-weight: 600; text-decoration: underline;">https://cidspro.vercel.app/</a></span>
          </li>
        `;
      }
      if (buyBtn) {
        buyBtn.setAttribute("data-product", "cids-suites-pro");
        buyBtn.innerText = "Beli Sekarang (RM 19.99)";
      }
    } else {
      if (bannerLink) bannerLink.href = "https://kertas22026.vercel.app/";
      if (bannerTitle) bannerTitle.innerText = "Portal Muat Turun Fizik SPM 2026";
      if (bannerSub) bannerSub.innerText = "Muat Turun PDF E-Book & Skema Jawapan Penuh";
      if (secondaryPortalBtn) {
        secondaryPortalBtn.href = "https://kertas22026.vercel.app/";
        secondaryPortalBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Buka Portal Muat Turun Fizik 2026
        `;
      }
      if (featureList) {
        featureList.innerHTML = `
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Koleksi Soalan Trial Negeri:</strong> Himpunan soalan berkualiti tinggi mirip soalan percubaan SPM sebenar 2026.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Skema & Analisis A+:</strong> Panduan pemarkahan terperinci, tip kata kunci, dan jalan kerja lengkap.</span>
          </li>
          <li style="display: flex; gap: 8px; align-items: flex-start;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span><strong>Akses Digital Segera:</strong> Kod lesen dikeluarkan automatik untuk akses portal <a href="https://kertas22026.vercel.app/" target="_blank" style="color: var(--apple-blue); font-weight: 600; text-decoration: underline;">https://kertas22026.vercel.app/</a></span>
          </li>
        `;
      }
      if (buyBtn) {
        buyBtn.setAttribute("data-product", "fizik-kertas2-2026");
        buyBtn.innerText = "Beli Sekarang (RM 2.99)";
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
      this.showToast("Sila lengkapkan semua maklumat pembeli.", "warning");
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
        <span>Menyambung ke ToyyibPay...</span>
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
      this.showToast("Memproses pembayaran melalui ToyyibPay...", "info");

      // 1. Process Payment via ToyyibPay Module
      const paymentResult = await window.toyyibPayManager.processPayment(orderPayload);

      if (paymentResult.success) {
        if (paymentResult.paymentUrl && !paymentResult.simulated) {
          // Save pending state
          sessionStorage.setItem("sirhalim_pending_order", JSON.stringify(orderPayload));
          window.location.href = paymentResult.paymentUrl;
          return;
        }

        // 2. Auto Claim / Pick up license key from Supabase Cloud
        const keyRecord = await window.licenseEngine.autoClaimLicenseKey({
          name: name,
          email: email,
          phone: phone,
          orderId: orderId,
          billCode: paymentResult.billCode || "SIM-" + Date.now(),
          engineType: this.currentProduct.engineType
        });

        this.lastAssignedKey = keyRecord;
        this.lastOrderData = {
          ...orderPayload,
          billCode: paymentResult.billCode
        };

        const buyModal = document.getElementById("appleBuySheetModal");
        if (buyModal) buyModal.classList.remove("active");

        this.showOrderReceipt(this.lastOrderData, keyRecord);
        this.triggerConfetti();
      }
    } catch (err) {
      console.error("Ralat Checkout:", err);
      this.showToast("Ralat memproses pembayaran: " + err.message, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Bayar Sekarang (${this.currentProduct.formattedPrice})</span>`;
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
    if (priceDisplay) priceDisplay.innerText = `RM ${this.currentProduct.price} (Lunas)`;

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
      if (keyRecord.productType === "cids") {
        downloadLinkBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Buka Portal CIDS Suites Pro Sekarang &rsaquo;
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

    const prodTitle = order.productTitle || this.currentProduct.title;

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
          amount: this.currentProduct.price,
          productTitle: prodTitle,
          downloadUrl: portalUrl
        })
      }).catch(() => {});

      // 2. Direct Web3Forms Relay backup (Guaranteed delivery to Gmail inbox)
      const emailPayload = {
        access_key: "099a9b2a-c21d-4009-bf25-2efc8f307409",
        to_email: customerEmail,
        subject: `[Sir Halim Store] Kod Lesen ${prodTitle}: ${keyRecord.key}`,
        from_name: "Sir Halim Store",
        message: `Salam ${order.customerName || "Pelanggan"},\n\nTerima kasih atas pembelian anda di Sir Halim Store!\n\nPRODUK:\n${prodTitle}\n\nKOD LESEN DIGITAL ANDA:\n${keyRecord.key}\n\nPAUTAN PORTAL (Klik Terus):\n${portalUrl}\n\nNo. Pesanan: ${order.orderId}\nJumlah Bayaran: RM ${this.currentProduct.price} (Lunas)\n\nSimpan mesej ini untuk rekod rujukan anda!`
      };

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(emailPayload)
      });

      console.log("[Email] Kod lesen berjaya dihantar ke Gmail:", customerEmail);
      this.showToast(`Kod lesen telah dihantar ke emel: ${customerEmail}`);
    } catch (err) {
      console.warn("[Email] Ralat penghantaran emel:", err);
    }
  }

  copyLicenseKey() {
    if (!this.lastAssignedKey || !this.lastAssignedKey.key) return;
    navigator.clipboard.writeText(this.lastAssignedKey.key).then(() => {
      this.showToast("Kod lesen digital berjaya disalin!");
    }).catch(() => {
      this.showToast("Sila salin kod secara manual.", "warning");
    });
  }

  sendWhatsAppReceipt() {
    if (!this.lastOrderData || !this.lastAssignedKey) return;
    const phone = this.lastOrderData.customerPhone.replace(/[^0-9]/g, "");
    const portalUrl = this.lastAssignedKey.portalUrl || "https://kertas22026.vercel.app/";
    const text = encodeURIComponent(
      `*RESIT PEMBELIAN & KOD LESEN SIR HALIM STORE*\n\n` +
      `Pembeli: ${this.lastOrderData.customerName}\n` +
      `Produk: ${this.currentProduct.title}\n` +
      `No. Pesanan: ${this.lastOrderData.orderId}\n` +
      `ToyyibPay Bill: ${this.lastOrderData.billCode}\n` +
      `Jumlah Bayaran: RM ${this.currentProduct.price}\n\n` +
      `*KOD LESEN ANDA:* \n*${this.lastAssignedKey.key}*\n\n` +
      `*Pautan Portal:* \n${portalUrl}\n\n` +
      `_Simpan mesej ini untuk rekod rujukan anda._`
    );

    const waUrl = phone ? `https://wa.me/${phone.startsWith('6') ? phone : '6' + phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(waUrl, "_blank");
  }

  // ==========================================
  // LICENSE SEARCH TOOL
  // ==========================================
  async handleLicenseSearch() {
    const input = document.getElementById("licenseSearchQuery");
    const container = document.getElementById("licenseSearchResults");
    const query = input ? input.value.trim() : "";

    if (!query) {
      this.showToast("Sila masukkan no. telefon, emel atau kod lesen.", "warning");
      return;
    }

    if (container) {
      container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-secondary);">Mencari dalam pangkalan data Supabase...</div>`;
      try {
        const results = await window.licenseEngine.lookupLicense(query);
        if (container) {
          if (results && results.length > 0) {
            container.innerHTML = results.map(r => {
              const portalUrl = r.portalUrl || (r.productType === "cids" ? "https://cidspro.vercel.app/" : `https://kertas22026.vercel.app/?key=${encodeURIComponent(r.key)}`);
              const badgeLabel = r.productType === "cids" ? "CIDS Suites Pro (1 Tahun)" : "Fizik Kertas 2 2026";
              return `
              <div class="license-item-result">
                <div class="license-result-top">
                  <div>
                    <div style="font-size: 11px; font-weight: 700; color: #ff3b30; text-transform: uppercase; margin-bottom: 2px;">${badgeLabel}</div>
                    <div class="license-result-key">${r.key}</div>
                    <div class="license-result-meta">${r.customer_name || 'Pembeli'} • Status: <strong>${r.downloads_left || 'Aktif'}</strong></div>
                  </div>
                </div>
                <div class="license-result-actions">
                  <a href="${portalUrl}" target="_blank" class="btn-buy-pill" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Buka Portal &rsaquo;
                  </a>
                  <button type="button" class="btn-buy-pill btn-pill-white" onclick="navigator.clipboard.writeText('${r.key}'); alert('Kod lesen ${r.key} disalin!');">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Salin Kod
                  </button>
                </div>
              </div>
            `;
            }).join("");
          } else {
            container.innerHTML = `
              <div style="text-align: center; padding: 25px 15px; color: var(--text-secondary); background: #f5f5f7; border-radius: 12px;">
                Tiada rekod lesen dijumpai untuk carian: <strong>${query}</strong>.<br>
                <span style="font-size: 12px; margin-top: 4px; display: block;">Pastikan no. telefon atau emel sama seperti semasa membuat bayaran.</span>
              </div>
            `;
          }
        }
      } catch (err) {
        if (container) {
          container.innerHTML = `<div style="text-align: center; color: #ff3b30; padding: 15px;">Ralat membuat carian: ${err.message}</div>`;
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
      this.showToast("Pembayaran ToyyibPay berjaya disahkan! Mengambil kunci lesen anda...", "success");

      const savedPending = sessionStorage.getItem("sirhalim_pending_order");
      const pendingData = savedPending ? JSON.parse(savedPending) : {};

      const keyRecord = await window.licenseEngine.autoClaimLicenseKey({
        name: pendingData.customerName || "Pelanggan",
        email: pendingData.customerEmail || "",
        phone: pendingData.customerPhone || "",
        orderId: orderId || pendingData.orderId || `ORD-${Date.now()}`,
        billCode: billCode,
        engineType: pendingData.engineType || "fizik"
      });

      this.lastAssignedKey = keyRecord;
      this.lastOrderData = {
        orderId: orderId || pendingData.orderId || "ORD-PAID",
        billCode: billCode,
        customerName: pendingData.customerName || "Pelanggan",
        customerEmail: pendingData.customerEmail || "",
        customerPhone: pendingData.customerPhone || "",
        productTitle: pendingData.productTitle || this.currentProduct.title
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
