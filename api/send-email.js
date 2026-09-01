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
      <p>Order Confirmation & Official Digital License Key</p>
    </div>
    <div class="content">
      <div class="greeting">Hello, ${customerName || "Customer"}!</div>
      <p>Thank you for your purchase at Sir Halim Store. Your payment via ToyyibPay FPX has been successfully confirmed.</p>
      
      <div class="license-card">
        <div class="license-label">YOUR DIGITAL LICENSE KEY</div>
        <div class="license-key">${licenseKey}</div>
      </div>

      <a href="${portalLink}" class="btn-download" target="_blank">
        Open Portal & Access Download Now &rsaquo;
      </a>

      <p style="font-size: 13px; color: #6e6e73; text-align: center;">
        Or access directly via this link: <br>
        <a href="${portalLink}" style="color: #0071e3; word-break: break-all;">${portalLink}</a>
      </p>

      <div class="order-details">
        <div class="order-row"><span><strong>Order No:</strong></span> <span>${orderId || "N/A"} (${billCode || "ToyyibPay"})</span></div>
        <div class="order-row"><span><strong>Product:</strong></span> <span>${req.body.productTitle || "Official Digital License"}</span></div>
        <div class="order-row"><span><strong>Total Paid:</strong></span> <span style="color: #0071e3; font-weight: 700;">RM ${amount || "19.99"} (Paid)</span></div>
        <div class="order-row"><span><strong>Status:</strong></span> <span>Active & Ready to Use</span></div>
      </div>
    </div>
    <div class="footer">
      &copy; 2026 Sir Halim Store. All Rights Reserved.<br>
      For any inquiries, reach out to Sir Halim on Telegram: @halimroslan or WhatsApp: +60123456789
    </div>
  </div>
</body>
</html>
    `;

    // Dispatch via Web3Forms REST API
    const emailPayload = {
      access_key: "099a9b2a-c21d-4009-bf25-2efc8f307409",
      to_email: customerEmail,
      subject: `[Sir Halim Store] Digital License Key: ${licenseKey}`,
      from_name: "Sir Halim Store",
      message: `Hello ${customerName || "Customer"},\n\nThank you for your purchase!\n\nYOUR DIGITAL LICENSE KEY:\n${licenseKey}\n\nDOWNLOAD / PORTAL LINK (Click to Open):\n${portalLink}\n\nOrder No: ${orderId}\nTotal Paid: RM ${amount || "19.99"} (Paid)\n\nHappy learning & teaching!`,
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
