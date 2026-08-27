/**
 * SIR HALIM STORE - SUPABASE LICENSE AUTO-PICKUP ENGINE
 * Connects directly to Supabase Cloud (kertas2admin.vercel.app backend)
 * Picks up available license keys and assigns them to buyers upon successful payment.
 */

const SUPABASE_CONFIG = {
  url: "https://fhwtxkbnxpdgrqmajujr.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZod3R4a2JueHBkZ3JxbWFqdWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NjA3OTYsImV4cCI6MjEwMzIzNjc5Nn0.268UE9YfGwi_VNEfXN4mBhB7nMFvgDL1JHjQL3HLYt8",
  adminSiteUrl: "https://kertas2admin.vercel.app/"
};

class LicenseEngine {
  constructor() {
    this.supabase = null;
    this.isCloudActive = false;
    this.initSupabase();
  }

  initSupabase() {
    try {
      if (window.supabase && typeof window.supabase.createClient === "function") {
        this.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        this.isCloudActive = true;
        console.log("🟢 Supabase Cloud License Engine Connected.");
      } else {
        console.warn("Supabase SDK not loaded yet. Will initialize on runtime.");
      }
    } catch (e) {
      console.warn("Failed to initialize Supabase client:", e);
    }
  }

  /**
   * Helper to generate a standardized license key: FZ26-XXXX-XXXX
   */
  generateRandomKey(prefix = "FZ26") {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const part1 = Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
    const part2 = Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
    return `${prefix}-${part1}-${part2}`;
  }

  /**
   * Auto Pick Up an Available License Key from Supabase
   * @param {Object} buyerDetails { name, email, phone, orderId, billCode }
   * @returns {Promise<Object>} The assigned license key record
   */
  async autoClaimLicenseKey(buyerDetails) {
    if (!this.supabase) {
      this.initSupabase();
    }

    const customerName = buyerDetails.name || "Pelanggan Sir Halim Store";
    const orderId = buyerDetails.orderId || `ORD-${Date.now()}`;
    const billCode = buyerDetails.billCode || "TOYYIB-PAID";

    let assignedKeyRecord = null;

    // 1. Try to find an available stock key in Supabase
    if (this.supabase) {
      try {
        // Query for available stock keys (e.g. customer_name contains 'Stok Shopee' or null/unclaimed)
        const { data: availableKeys, error: fetchErr } = await this.supabase
          .from("license_keys")
          .select("*")
          .eq("status", "active")
          .like("customer_name", "%Stok Shopee%")
          .limit(1);

        if (!fetchErr && availableKeys && availableKeys.length > 0) {
          const targetKey = availableKeys[0];

          // Update the key with buyer's information
          const { data: updatedKey, error: updateErr } = await this.supabase
            .from("license_keys")
            .update({
              customer_name: `${customerName} (${buyerDetails.phone || buyerDetails.email})`,
              order_id: `ToyyibPay: ${billCode} / ${orderId}`,
              downloads_left: 4,
              download_count: 0
            })
            .eq("id", targetKey.id)
            .select();

          if (!updateErr && updatedKey && updatedKey.length > 0) {
            assignedKeyRecord = updatedKey[0];
            console.log("[Supabase] Berjaya Claim Kunci Sedia Ada:", assignedKeyRecord.key);
          }
        }
      } catch (err) {
        console.warn("Supabase fetch error, will fallback to new insert:", err);
      }
    }

    // 2. If no available stock key or error, generate a brand new key and insert to Supabase
    if (!assignedKeyRecord) {
      const freshKey = this.generateRandomKey("FZ26");
      const newRecord = {
        key: freshKey,
        customer_name: `${customerName} (${buyerDetails.phone || buyerDetails.email})`,
        order_id: `ToyyibPay: ${billCode} / ${orderId}`,
        downloads_left: 4,
        max_downloads: 4,
        download_count: 0,
        status: "active"
      };

      if (this.supabase) {
        try {
          const { data: inserted, error: insertErr } = await this.supabase
            .from("license_keys")
            .insert([newRecord])
            .select();

          if (!insertErr && inserted && inserted.length > 0) {
            assignedKeyRecord = inserted[0];
            console.log("[Supabase] Berjaya Jana & Simpan Kunci Baharu:", assignedKeyRecord.key);
          }
        } catch (e) {
          console.warn("Error inserting new key to Supabase:", e);
        }
      }

      // Fallback object if Supabase offline
      if (!assignedKeyRecord) {
        assignedKeyRecord = {
          ...newRecord,
          id: "local-" + Date.now(),
          created_at: new Date().toISOString()
        };
      }
    }

    // 3. Save to local storage cache for customer easy access
    this.saveToLocalPurchases(assignedKeyRecord, buyerDetails);

    return assignedKeyRecord;
  }

  /**
   * Look up a license key or buyer purchases
   */
  async lookupLicense(query) {
    if (!query) return [];
    query = query.trim().toUpperCase();

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from("license_keys")
          .select("*")
          .or(`key.ilike.%${query}%,customer_name.ilike.%${query}%,order_id.ilike.%${query}%`)
          .limit(10);

        if (!error && data) return data;
      } catch (err) {
        console.warn("Error searching Supabase:", err);
      }
    }

    // Fallback search in local purchases
    const localPurchases = this.getLocalPurchases();
    return localPurchases.filter(p => 
      (p.key && p.key.toUpperCase().includes(query)) ||
      (p.customer_name && p.customer_name.toUpperCase().includes(query)) ||
      (p.order_id && p.order_id.toUpperCase().includes(query))
    );
  }

  saveToLocalPurchases(keyRecord, buyerDetails) {
    try {
      const history = this.getLocalPurchases();
      history.unshift({
        ...keyRecord,
        buyerDetails: buyerDetails,
        purchasedAt: new Date().toISOString()
      });
      localStorage.setItem("sir_halim_store_orders", JSON.stringify(history));
    } catch (e) {
      console.warn("Failed to cache purchase locally:", e);
    }
  }

  getLocalPurchases() {
    try {
      const raw = localStorage.getItem("sir_halim_store_orders");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
}

window.licenseEngine = new LicenseEngine();
