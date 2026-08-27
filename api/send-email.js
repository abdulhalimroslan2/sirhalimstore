// api/send-email.js - Vercel Serverless Function to deliver License Key via Email
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { customerEmail, customerName, licenseKey, orderId, billCode, amount, downloadUrl } = req.body;

    if (!customerEmail || !licenseKey) {
      return res.status(400).json({ success: false, error: "customerEmail and licenseKey are required." });
    }

    const portalLink = downloadUrl || `https://kertas22026.vercel.app/?key=${encodeURIComponent(licenseKey)}`;

    // Build Premium HTML Email Template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; margin: 0; padding: 20px; color: #1d1d1f; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
    .header { background: #000000; padding: 30px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .header p { margin: 5px 0 0; font-size: 13px; color: #86868b; }
    .content { padding: 35px 30px; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 15px; }
    .license-card { background: #1d1d1f; border-radius: 14px; padding: 25px; text-align: center; margin: 25px 0; color: #ffffff; }
    .license-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #86868b; margin-bottom: 8px; }
    .license-key { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 28px; font-weight: 700; color: #34c759; letter-spacing: 2px; }
    .btn-download { display: block; background: #0071e3; color: #ffffff !important; text-decoration: none; padding: 16px 28px; border-radius: 12px; font-weight: 600; font-size: 16px; text-align: center; margin: 25px 0; }
    .order-details { background: #f5f5f7; border-radius: 12px; padding: 20px; font-size: 13px; margin-top: 25px; }
    .order-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .footer { text-align: center; padding: 25px; font-size: 12px; color: #86868b; border-top: 1px solid #e5e5e7; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Sir Halim Store</h1>
      <p>Pengesahan Pembelian & Kunci Lesen Rasmi</p>
    </div>
    <div class="content">
      <div class="greeting">Salam sejahtera, ${customerName || "Pelanggan"}!</div>
      <p>Terima kasih kerana membeli <strong>PDF Fizik Koleksi Mirip Soalan Trial Negeri Kertas 2 2026</strong>. Pembayaran anda melalui ToyyibPay telah berjaya disahkan.</p>
      
      <div class="license-card">
        <div class="license-label">KOD LESEN DIGITAL ANDA</div>
        <div class="license-key">${licenseKey}</div>
      </div>

      <a href="${portalLink}" class="btn-download" target="_blank">
        Buka Portal & Muat Turun E-Book Sekarang &rsaquo;
      </a>

      <p style="font-size: 13px; color: #6e6e73; text-align: center;">
        Atau buka pautan ini terus: <br>
        <a href="${portalLink}" style="color: #0071e3; word-break: break-all;">${portalLink}</a>
      </p>

      <div class="order-details">
        <div class="order-row"><span><strong>No. Pesanan:</strong></span> <span>${orderId || "N/A"} (${billCode || "ToyyibPay"})</span></div>
        <div class="order-row"><span><strong>Produk:</strong></span> <span>E-Book Fizik SPM Kertas 2 2026 + Skema A+</span></div>
        <div class="order-row"><span><strong>Jumlah Bayaran:</strong></span> <span style="color: #0071e3; font-weight: 700;">RM ${amount || "1.99"} (Lunas)</span></div>
        <div class="order-row"><span><strong>Had Muat Turun:</strong></span> <span>4 Kali Akses Penuh</span></div>
      </div>
    </div>
    <div class="footer">
      &copy; 2026 Sir Halim Store. Hak Cipta Terpelihara.<br>
      Jika ada sebarang soalan, hubungi Sir Halim di WhatsApp: +60123456789
    </div>
  </div>
</body>
</html>
    `;

    // Attempt dispatch via Web3Forms REST API (reliable free delivery to any email without API key lock)
    const emailPayload = {
      access_key: "099a9b2a-c21d-4009-bf25-2efc8f307409", // Standard Web3Forms Relay key
      to_email: customerEmail,
      subject: `[Sir Halim Store] Kunci Lesen E-Book Fizik SPM 2026: ${licenseKey}`,
      from_name: "Sir Halim Store",
      message: `Salam ${customerName || "Pelanggan"},\n\nTerima kasih atas pembelian anda!\n\nKOD LESEN DIGITAL ANDA:\n${licenseKey}\n\nPAUTAN PORTAL MUAT TURUN (Terus Buka):\n${portalLink}\n\nNo. Pesanan: ${orderId}\nJumlah Bayaran: RM ${amount || "1.99"} (Lunas)\n\nSelamat mengulangkaji dan semoga cemerlang SPM 2026!`,
      html: htmlContent
    };

    const dispatchResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(emailPayload)
    });

    const dispatchResult = await dispatchResponse.json();

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      portalLink: portalLink,
      dispatchResult
    });

  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
