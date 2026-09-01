/**
 * SIR HALIM STORE - MULTI-PRODUCT SUPABASE LICENSE AUTO-PICKUP ENGINE
 * 1. Physics SPM 2026 Portal (kertas22026.vercel.app / kertas2admin.vercel.app)
 * 2. CIDS Suites Pro (cidskey.vercel.app / sennodrfmsijorfcnrud.supabase.co)
 */

const DATABASES_CONFIG = {
  fizik: {
    url: "https://fhwtxkbnxpdgrqmajujr.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZod3R4a2JueHBkZ3JxbWFqdWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NjA3OTYsImV4cCI6MjEwMzIzNjc5Nn0.268UE9YfGwi_VNEfXN4mBhB7nMFvgDL1JHjQL3HLYt8",
    portalUrl: "https://kertas22026.vercel.app/",
    keyPrefix: "FZ26"
  },
  cids: {
    url: "https://sennodrfmsijorfcnrud.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbm5vZHJmbXNpam9yZmNucnVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE3MzY2NiwiZXhwIjoyMDk5NzQ5NjY2fQ.a2Ocfy4OQ-nPaEDeyzI9slDFzyT8OwFtz403G8uFcAY",
    portalUrl: "https://cidspro.vercel.app/",
    adminUrl: "https://cidskey.vercel.app/admin",
    keyPrefix: "CIDS"
  }
};

class LicenseEngine {
  constructor() {
    this.clients = {};
    this.initClients();
  }

  initClients() {
    try {
      if (window.supabase && typeof window.supabase.createClient === "function") {
        this.clients.fizik = window.supabase.createClient(DATABASES_CONFIG.fizik.url, DATABASES_CONFIG.fizik.key);
        this.clients.cids = window.supabase.createClient(DATABASES_CONFIG.cids.url, DATABASES_CONFIG.cids.key);
        console.log("[Supabase] Both Physics and CIDS Cloud Engines Connected.");
      } else {
        console.warn("Supabase SDK not ready yet. Will initialize on runtime.");
      }
    } catch (e) {
      console.warn("Failed to initialize Supabase clients:", e);
    }
  }

  getClient(engineType = "fizik") {
    if (!this.clients[engineType] && window.supabase) {
      const cfg = DATABASES_CONFIG[engineType] || DATABASES_CONFIG.fizik;
      this.clients[engineType] = window.supabase.createClient(cfg.url, cfg.key);
    }
    return this.clients[engineType];
  }

  generateRandomKey(prefix = "FZ26") {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    if (prefix === "CIDS") {
      const seg1 = Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
      const seg2 = Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
      const seg3 = Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
      return `CIDS-${seg1}-${seg2}-${seg3}`;
    } else {
      const part1 = Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
      const part2 = Array.from({ length: 4 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
      return `${prefix}-${part1}-${part2}`;
    }
  }

  /**
   * Auto Pick Up an Available License Key from Supabase according to Product Engine
   * @param {Object} buyerDetails { name, email, phone, orderId, billCode, engineType }
   * @returns {Promise<Object>} The assigned license key record
   */
  async autoClaimLicenseKey(buyerDetails) {
    const engineType = buyerDetails.engineType === "cids" ? "cids" : "fizik";
    const client = this.getClient(engineType);
    const customerName = buyerDetails.name || "Customer";
    const orderId = buyerDetails.orderId || `ORD-${Date.now()}`;
    const billCode = buyerDetails.billCode || "TOYYIB-PAID";

    let assignedKeyRecord = null;

    if (engineType === "cids") {
      // CIDS SUITES PRO KEY PICKUP
      if (client) {
        try {
          // Look for an unused active key without notes (or unassigned)
          const { data: availableKeys, error: fetchErr } = await client
            .from("license_keys")
            .select("*")
            .eq("is_active", true)
            .is("notes", null)
            .limit(1);

          if (!fetchErr && availableKeys && availableKeys.length > 0) {
            const targetKey = availableKeys[0];
            const notesText = `ToyyibPay: ${billCode} / ${orderId} - ${customerName} (${buyerDetails.phone || buyerDetails.email}) - 1-Year License`;

            const { data: updatedKey, error: updateErr } = await client
              .from("license_keys")
              .update({
                notes: notesText
              })
              .eq("id", targetKey.id)
              .select();

            if (!updateErr && updatedKey && updatedKey.length > 0) {
              assignedKeyRecord = {
                ...updatedKey[0],
                productType: "cids",
                portalUrl: "https://cidspro.vercel.app/"
              };
              console.log("[Supabase CIDS] Claimed existing key:", assignedKeyRecord.key);
            }
          }
        } catch (err) {
          console.warn("CIDS fetch error, fallback to fresh insert:", err);
        }
      }

      if (!assignedKeyRecord) {
        const freshKey = this.generateRandomKey("CIDS");
        const newRecord = {
          key: freshKey,
          max_devices: 2,
          is_active: true,
          notes: `ToyyibPay: ${billCode} / ${orderId} - ${customerName} (${buyerDetails.phone || buyerDetails.email}) - 1-Year License`
        };

        if (client) {
          try {
            const { data: inserted, error: insErr } = await client
              .from("license_keys")
              .insert([newRecord])
              .select();

            if (!insErr && inserted && inserted.length > 0) {
              assignedKeyRecord = {
                ...inserted[0],
                productType: "cids",
                portalUrl: "https://cidspro.vercel.app/"
              };
              console.log("[Supabase CIDS] Generated & stored new key:", assignedKeyRecord.key);
            }
          } catch (e) {
            console.warn("Error inserting CIDS key:", e);
          }
        }

        if (!assignedKeyRecord) {
          assignedKeyRecord = {
            ...newRecord,
            id: "local-" + Date.now(),
            productType: "cids",
            portalUrl: "https://cidspro.vercel.app/",
            created_at: new Date().toISOString()
          };
        }
      }
    } else {
      // PHYSICS SPM KEY PICKUP
      if (client) {
        try {
          const { data: availableKeys, error: fetchErr } = await client
            .from("license_keys")
            .select("*")
            .eq("status", "active")
            .like("customer_name", "%Stok Shopee%")
            .limit(1);

          if (!fetchErr && availableKeys && availableKeys.length > 0) {
            const targetKey = availableKeys[0];
            const { data: updatedKey, error: updateErr } = await client
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
              assignedKeyRecord = {
                ...updatedKey[0],
                productType: "fizik",
                portalUrl: `https://kertas22026.vercel.app/?key=${encodeURIComponent(updatedKey[0].key)}`
              };
              console.log("[Supabase Physics] Claimed existing key:", assignedKeyRecord.key);
            }
          }
        } catch (err) {
          console.warn("Physics fetch error, fallback:", err);
        }
      }

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

        if (client) {
          try {
            const { data: inserted, error: insertErr } = await client
              .from("license_keys")
              .insert([newRecord])
              .select();

            if (!insertErr && inserted && inserted.length > 0) {
              assignedKeyRecord = {
                ...inserted[0],
                productType: "fizik",
                portalUrl: `https://kertas22026.vercel.app/?key=${encodeURIComponent(inserted[0].key)}`
              };
              console.log("[Supabase Physics] Generated & stored new key:", assignedKeyRecord.key);
            }
          } catch (e) {
            console.warn("Error inserting Physics key:", e);
          }
        }

        if (!assignedKeyRecord) {
          assignedKeyRecord = {
            ...newRecord,
            id: "local-" + Date.now(),
            productType: "fizik",
            portalUrl: `https://kertas22026.vercel.app/?key=${encodeURIComponent(freshKey)}`,
            created_at: new Date().toISOString()
          };
        }
      }
    }

    this.saveToLocalPurchases(assignedKeyRecord, buyerDetails);
    return assignedKeyRecord;
  }

  saveToLocalPurchases(keyRecord, buyerDetails) {
    try {
      const list = JSON.parse(localStorage.getItem("sirhalim_purchases") || "[]");
      list.unshift({
        key: keyRecord.key,
        orderId: buyerDetails.orderId,
        billCode: buyerDetails.billCode,
        customerName: buyerDetails.name,
        customerEmail: buyerDetails.email,
        customerPhone: buyerDetails.phone,
        productType: keyRecord.productType || "fizik",
        portalUrl: keyRecord.portalUrl,
        date: new Date().toISOString()
      });
      localStorage.setItem("sirhalim_purchases", JSON.stringify(list.slice(0, 30)));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  }

  async lookupLicense(query) {
    if (!query) return [];
    query = query.trim().toUpperCase();
    const results = [];

    // Search Physics Supabase
    const fizikClient = this.getClient("fizik");
    if (fizikClient) {
      try {
        const { data } = await fizikClient
          .from("license_keys")
          .select("*")
          .or(`key.ilike.%${query}%,customer_name.ilike.%${query}%,order_id.ilike.%${query}%`)
          .limit(10);
        if (data) {
          data.forEach(d => results.push({ ...d, productType: "fizik", portalUrl: `https://kertas22026.vercel.app/?key=${encodeURIComponent(d.key)}` }));
        }
      } catch (e) {}
    }

    // Search CIDS Supabase
    const cidsClient = this.getClient("cids");
    if (cidsClient) {
      try {
        const { data } = await cidsClient
          .from("license_keys")
          .select("*")
          .or(`key.ilike.%${query}%,notes.ilike.%${query}%`)
          .limit(10);
        if (data) {
          data.forEach(d => results.push({
            ...d,
            customer_name: d.notes || "CIDS Suites Pro User",
            downloads_left: "2 Devices (1 Year)",
            productType: "cids",
            portalUrl: `https://cidspro.vercel.app/`
          }));
        }
      } catch (e) {}
    }

    return results;
  }
}

window.licenseEngine = new LicenseEngine();
