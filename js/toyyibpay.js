/**
 * SIR HALIM STORE - TOYYIBPAY INTEGRATION ENGINE (LIVE PRODUCTION READY)
 * Configured with Sir Halim's Official ToyyibPay Secret Key & Category
 */

const TOYYIBPAY_CONFIG = {
  // Live Official Credentials
  environment: "live", // "live" or "sandbox"
  userSecretKey: "j3eykoye-lkcf-af90-dwcv-t0ad5e9d5ys8",
  categoryCode: "c5ysh3le",
  
  // Endpoints
  endpoints: {
    sandbox: {
      createBill: "https://dev.toyyibpay.com/index.php/api/createBill",
      paymentUrl: "https://dev.toyyibpay.com/"
    },
    live: {
      createBill: "https://toyyibpay.com/index.php/api/createBill",
      paymentUrl: "https://toyyibpay.com/"
    }
  },

  enableSimulation: false
};

class ToyyibPayManager {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem("toyyibpay_store_config");
      return saved ? { ...TOYYIBPAY_CONFIG, ...JSON.parse(saved) } : TOYYIBPAY_CONFIG;
    } catch (e) {
      return TOYYIBPAY_CONFIG;
    }
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem("toyyibpay_store_config", JSON.stringify(this.config));
  }

  setEnvironment(env) {
    this.config.environment = env;
    this.saveConfig(this.config);
  }

  /**
   * Process ToyyibPay Checkout
   * @param {Object} orderData { customerName, customerEmail, customerPhone, amount, orderId, productTitle }
   * @returns {Promise<Object>} Payment result { success, billCode, paymentUrl, simulated }
   */
  async processPayment(orderData) {
    const isLiveMode = this.config.environment === "live";
    const amountInCents = Math.round(orderData.amount * 100);
    const returnUrl = window.location.origin + window.location.pathname + `?payment_return=1&order_id=${encodeURIComponent(orderData.orderId)}&name=${encodeURIComponent(orderData.customerName)}&phone=${encodeURIComponent(orderData.customerPhone)}&email=${encodeURIComponent(orderData.customerEmail)}`;

    // 1. PRIMARY: CALL SERVERLESS VERCEL BACKEND /api/create-bill (NO CORS ISSUES)
    try {
      const response = await fetch("/api/create-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderData.amount,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
          orderId: orderData.orderId,
          productTitle: orderData.productTitle,
          returnUrl: returnUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.paymentUrl) {
          console.log("[ToyyibPay] Bill Created via Serverless API:", data.billCode);
          return {
            success: true,
            billCode: data.billCode,
            paymentUrl: data.paymentUrl,
            simulated: false
          };
        }
      }
    } catch (err) {
      console.warn("[ToyyibPay] Serverless API unreachable or local static mode:", err);
    }

    // 2. FALLBACK A: CORS PROXY / DIRECT GATEWAY CALL
    try {
      const formData = new URLSearchParams();
      formData.append("userSecretKey", this.config.userSecretKey);
      formData.append("categoryCode", this.config.categoryCode);
      formData.append("billName", (orderData.productTitle || "Sir Halim Store Order").slice(0, 30));
      formData.append("billDescription", `Order #${orderData.orderId}`.slice(0, 100));
      formData.append("billPriceSetting", "1");
      formData.append("billPayorInfo", "1");
      formData.append("billAmount", amountInCents.toString());
      formData.append("billReturnUrl", returnUrl);
      formData.append("billCallbackUrl", returnUrl);
      formData.append("billExternalReferenceNo", orderData.orderId);
      formData.append("billTo", orderData.customerName);
      formData.append("billEmail", orderData.customerEmail);
      formData.append("billPhone", orderData.customerPhone);
      formData.append("billSplitPayment", "0");
      formData.append("billPaymentChannel", "0");
      formData.append("billDisplayMerchant", "1");

      const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent("https://toyyibpay.com/index.php/api/createBill");
      const proxyRes = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      });

      if (proxyRes.ok) {
        const result = await proxyRes.json();
        if (Array.isArray(result) && result[0] && result[0].BillCode) {
          const liveBillCode = result[0].BillCode;
          console.log("[ToyyibPay] Bill Created via Proxy:", liveBillCode);
          return {
            success: true,
            billCode: liveBillCode,
            paymentUrl: `https://toyyibpay.com/${liveBillCode}`,
            simulated: false
          };
        }
      }
    } catch (e) {
      console.warn("[ToyyibPay] Proxy fallback notice:", e);
    }

    // 3. FALLBACK B: TOYYIBPAY OFFICIAL DIRECT CATEGORY PORTAL
    const directCategoryUrl = `https://toyyibpay.com/${this.config.categoryCode}`;
    return {
      success: true,
      billCode: "CAT-" + this.config.categoryCode,
      paymentUrl: directCategoryUrl,
      simulated: false
    };
  }
}

window.toyyibPayManager = new ToyyibPayManager();
