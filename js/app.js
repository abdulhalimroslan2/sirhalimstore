/**
 * SIR HALIM STORE - MAIN CLIENT APPLICATION
 * Apple Store Inspired Interactive Interface & Checkout Workflow
 */

class SirHalimStoreApp {
  constructor() {
    this.currentProduct = {
      id: "fizik-kertas2-2026",
      title: "PDF Fizik Koleksi Mirip Soalan Trial Negeri Kertas 2 2026",
      subtitle: "Koleksi Soalan Terpilih Mengikut Topik, Jawapan Lengkap & Skema Analisis SPM 2026",
      price: 19.99,
      formattedPrice: "RM 19.99",
      coverImage: "assets/fizik-kertas2-2026-cover.png",
      category: "Fizik SPM Tingkatan 4 & 5",
      badge: "Paling Laris & Eksklusif",
      filesIncluded: [
        "E-Book PDF Soalan Kertas 2 Topikal Percubaan 2026 (4.7 MB)",
        "Skema & Analisis Jawapan Lengkap Kertas 2 (4.0 MB)",
        "Kunci Lesen Digital Automatik (Had Muat Turun 4x)"
      ]
    };

    this.cart = [];
    this.lastAssignedKey = null;
    this.lastOrderData = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initCarousel();
    this.checkUrlParams();
    console.log("🍏 Sir Halim Store App Initialized.");
  }

  bindEvents() {
    // Buy Buttons
    document.querySelectorAll("[data-action='open-buy-sheet']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openBuySheet();
      });
    });

    // Learn More Buttons
    document.querySelectorAll("[data-action='open-detail-sheet']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openDetailSheet();
      });
    });

    // License Check Buttons
    document.querySelectorAll("[data-action='open-license-checker']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openLicenseChecker();
      });
    });

    // Admin Settings / Key Vault
    const adminTrigger = document.getElementById("openAdminSettingsBtn");
    if (adminTrigger) {
      adminTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.promptAdminPin();
      });
    }

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

    // ToyyibPay Mode Chips
    document.querySelectorAll(".mode-chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        document.querySelectorAll(".mode-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const env = chip.getAttribute("data-env");
        if (window.toyyibPayManager) {
          window.toyyibPayManager.setEnvironment(env);
          this.showToast(`Mod ToyyibPay ditukar kepada: ${env.toUpperCase()}`);
        }
      });
    });

    // Shopping Bag Icon
    const bagBtn = document.getElementById("navBagBtn");
    if (bagBtn) {
      bagBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.openBuySheet();
      });
    }
  }

  // ==========================================
  // CAROUSEL LOGIC
  // ==========================================
  initCarousel() {
    const carousel = document.getElementById("cardsCarousel");
    const prevBtn = document.getElementById("carouselPrevBtn");
    const nextBtn = document.getElementById("carouselNextBtn");

    if (!carousel || !prevBtn || !nextBtn) return;

    const scrollAmount = 420;

    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    const updateArrowStates = () => {
      prevBtn.disabled = carousel.scrollLeft <= 10;
      nextBtn.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;
    };

    carousel.addEventListener("scroll", updateArrowStates);
    updateArrowStates();
  }

  // ==========================================
  // BUY SHEET & CHECKOUT FLOW
  // ==========================================
  openBuySheet() {
    const modal = document.getElementById("appleBuySheetModal");
    if (modal) {
      modal.classList.add("active");
      const nameInput = document.getElementById("buyerNameInput");
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 200);
      }
    }
  }

  openDetailSheet() {
    const modal = document.getElementById("productDetailModal");
    if (modal) modal.classList.add("active");
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
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
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
      productTitle: this.currentProduct.title
    };

    try {
      this.showToast("Memproses pembayaran melalui ToyyibPay...", "info");

      // 1. Process Payment via ToyyibPay Module
      const paymentResult = await window.toyyibPayManager.processPayment(orderPayload);

      if (paymentResult.success) {
        // If live redirect URL returned, redirect user
        if (paymentResult.paymentUrl && !paymentResult.simulated) {
          window.location.href = paymentResult.paymentUrl;
          return;
        }

        // 2. Auto Claim / Pick up license key from Supabase Cloud
        this.showToast("Pembayaran Berjaya! Menjana kunci lesen digital...", "success");

        const assignedKeyRecord = await window.licenseEngine.autoClaimLicenseKey({
          name: name,
          email: email,
          phone: phone,
          orderId: orderId,
          billCode: paymentResult.billCode
        });

        this.lastAssignedKey = assignedKeyRecord;
        this.lastOrderData = {
          ...orderPayload,
          billCode: paymentResult.billCode,
          key: assignedKeyRecord.key,
          date: new Date().toLocaleDateString("ms-MY", { dateStyle: "medium" }) + " " + new Date().toLocaleTimeString("ms-MY", { timeStyle: "short" })
        };

        // Close Buy Sheet
        const buyModal = document.getElementById("appleBuySheetModal");
        if (buyModal) buyModal.classList.remove("active");

        // Open Receipt Modal & Confetti
        this.showOrderReceipt(this.lastOrderData, this.lastAssignedKey);
        this.triggerConfetti();
      }
    } catch (err) {
      console.error("Ralat Checkout:", err);
      this.showToast("Ralat memproses pembayaran: " + err.message, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Bayar Sekarang (RM 19.99)</span>
        `;
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
    const dateDisplay = document.getElementById("receiptDate");
    const buyerDisplay = document.getElementById("receiptBuyerName");
    const downloadLinkBtn = document.getElementById("receiptDownloadPortalBtn");

    if (keyDisplay) keyDisplay.innerText = keyRecord.key;
    if (orderIdDisplay) orderIdDisplay.innerText = `${order.orderId} (${order.billCode})`;
    if (dateDisplay) dateDisplay.innerText = order.date || new Date().toLocaleString("ms-MY");
    if (buyerDisplay) buyerDisplay.innerText = `${order.customerName} (${order.customerPhone})`;

    // Prefill direct link with license key to kertas2admin.vercel.app or local portal
    if (downloadLinkBtn) {
      const portalUrl = `https://kertas2admin.vercel.app/?key=${encodeURIComponent(keyRecord.key)}`;
      downloadLinkBtn.href = portalUrl;
      downloadLinkBtn.target = "_blank";
    }

    if (receiptModal) receiptModal.classList.add("active");
  }

  copyLicenseKey() {
    if (!this.lastAssignedKey || !this.lastAssignedKey.key) return;
    navigator.clipboard.writeText(this.lastAssignedKey.key).then(() => {
      this.showToast("✅ Kod lesen digital berjaya disalin!");
    }).catch(() => {
      this.showToast("Sila salin kod secara manual.", "warning");
    });
  }

  sendWhatsAppReceipt() {
    if (!this.lastOrderData || !this.lastAssignedKey) return;
    const phone = this.lastOrderData.customerPhone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `*RESIT PEMBELIAN & KOD LESEN SIR HALIM STORE*\n\n` +
      `👤 Pembeli: ${this.lastOrderData.customerName}\n` +
      `📦 Produk: ${this.currentProduct.title}\n` +
      `🧾 No. Pesanan: ${this.lastOrderData.orderId}\n` +
      `💳 ToyyibPay Bill: ${this.lastOrderData.billCode}\n` +
      `💰 Jumlah Bayaran: RM ${this.currentProduct.price}\n\n` +
      `🔑 *KOD LESEN ANDA:* \n*${this.lastAssignedKey.key}*\n\n` +
      `📥 *Pautan Portal Muat Turun:* \nhttps://kertas2admin.vercel.app/?key=${this.lastAssignedKey.key}\n\n` +
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
    }

    try {
      const results = await window.licenseEngine.lookupLicense(query);
      if (container) {
        if (results && results.length > 0) {
          container.innerHTML = results.map(r => `
            <div class="license-item-result">
              <div>
                <div style="font-family: var(--apple-font-mono); font-weight: 700; color: var(--apple-blue); font-size: 15px;">${r.key}</div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">${r.customer_name || 'Pembeli'} • Baki: ${r.downloads_left !== undefined ? r.downloads_left : 4}x</div>
              </div>
              <a href="https://kertas2admin.vercel.app/?key=${encodeURIComponent(r.key)}" target="_blank" class="btn-apple-pill" style="padding: 4px 12px; font-size: 12px;">
                Muat Turun
              </a>
            </div>
          `).join("");
        } else {
          container.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-secondary);">Tiada rekod lesen dijumpai untuk carian "${query}".</div>`;
        }
      }
    } catch (err) {
      if (container) container.innerHTML = `<div style="text-align: center; color: var(--apple-red);">Ralat carian: ${err.message}</div>`;
    }
  }

  // ==========================================
  // ADMIN PIN & SETTINGS
  // ==========================================
  promptAdminPin() {
    const pin = prompt("Masukkan PIN Keselamatan Admin Sir Halim Store (Default: @reeZ860):");
    if (pin === "@reeZ860") {
      const adminModal = document.getElementById("adminStoreSettingsModal");
      if (adminModal) {
        adminModal.classList.add("active");
        this.loadAdminSettingsValues();
      }
    } else if (pin !== null) {
      alert("PIN salah.");
    }
  }

  loadAdminSettingsValues() {
    const secKeyInput = document.getElementById("adminToyyibSecretKey");
    const catCodeInput = document.getElementById("adminToyyibCatCode");
    if (secKeyInput && window.toyyibPayManager) secKeyInput.value = window.toyyibPayManager.config.userSecretKey || "";
    if (catCodeInput && window.toyyibPayManager) catCodeInput.value = window.toyyibPayManager.config.categoryCode || "";
  }

  // ==========================================
  // UTILITIES
  // ==========================================
  showToast(message, type = "info") {
    let toast = document.getElementById("appleGlobalToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "appleGlobalToast";
      toast.className = "apple-toast";
      document.body.appendChild(toast);
    }

    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  triggerConfetti() {
    const count = 120;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      if (typeof confetti === "function") {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }
    }

    if (typeof confetti === "function") {
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }

  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const statusId = urlParams.get("status_id");
    const billCode = urlParams.get("billcode");
    const isReturn = urlParams.get("payment_return") === "1" || statusId !== null;

    if (isReturn && billCode) {
      if (statusId === "3") {
        this.showToast("Pembayaran ToyyibPay tidak berjaya atau dibatalkan. Sila cuba lagi.", "error");
        return;
      }

      const orderId = urlParams.get("order_id") || "ORD-" + billCode;
      const buyerName = urlParams.get("name") || "Pelanggan ToyyibPay";
      const buyerPhone = urlParams.get("phone") || "";
      const buyerEmail = urlParams.get("email") || "";

      this.showToast("Pembayaran ToyyibPay disahkan! Menuntut kod lesen...", "success");
      
      window.licenseEngine.autoClaimLicenseKey({
        name: buyerName,
        email: buyerEmail,
        phone: buyerPhone,
        orderId: orderId,
        billCode: billCode
      }).then(keyRecord => {
        this.lastAssignedKey = keyRecord;
        this.lastOrderData = {
          orderId: orderId,
          billCode: billCode,
          customerName: buyerName,
          customerPhone: buyerPhone,
          customerEmail: buyerEmail,
          amount: this.currentProduct.price,
          key: keyRecord.key,
          date: new Date().toLocaleDateString("ms-MY", { dateStyle: "medium" }) + " " + new Date().toLocaleTimeString("ms-MY", { timeStyle: "short" })
        };
        this.showOrderReceipt(this.lastOrderData, keyRecord);
        this.triggerConfetti();
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.sirHalimStoreApp = new SirHalimStoreApp();
});
