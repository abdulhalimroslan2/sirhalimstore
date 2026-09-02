/**
 * SIR HALIM STORE - TOYYIBPAY CREATE BILL SERVERLESS ENDPOINT
 * Handles ToyyibPay API request server-to-server (No CORS issues)
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    amount,
    customerName,
    customerEmail,
    customerPhone,
    orderId,
    productTitle,
    returnUrl
  } = req.body || {};

  const userSecretKey = process.env.TOYYIBPAY_SECRET_KEY || "j3eykoye-lkcf-af90-dwcv-t0ad5e9d5ys8";
  const categoryCode = process.env.TOYYIBPAY_CATEGORY_CODE || "c5ysh3le";
  const amountInCents = Math.round(Number(amount || 25) * 100);

  try {
    const formData = new URLSearchParams();
    formData.append("userSecretKey", userSecretKey);
    formData.append("categoryCode", categoryCode);
    formData.append("billName", (productTitle || "Sir Halim Store Order").slice(0, 30));
    formData.append("billDescription", `Order #${orderId} - ${productTitle}`.slice(0, 100));
    formData.append("billPriceSetting", "1");
    formData.append("billPayorInfo", "1");
    formData.append("billAmount", amountInCents.toString());
    formData.append("billReturnUrl", returnUrl || "https://sirhalimstore.vercel.app/");
    formData.append("billCallbackUrl", returnUrl || "https://sirhalimstore.vercel.app/");
    formData.append("billExternalReferenceNo", orderId || `ORD-${Date.now()}`);
    formData.append("billTo", customerName || "Customer");
    formData.append("billEmail", customerEmail || "customer@gmail.com");
    formData.append("billPhone", customerPhone || "0123456789");
    formData.append("billSplitPayment", "0");
    formData.append("billPaymentChannel", "0");
    formData.append("billDisplayMerchant", "1");

    const response = await fetch("https://toyyibpay.com/index.php/api/createBill", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("[ToyyibPay API] Non-JSON Response:", text);
      return res.status(502).json({
        success: false,
        error: "Invalid response from ToyyibPay gateway",
        raw: text
      });
    }

    if (Array.isArray(result) && result[0] && result[0].BillCode) {
      const billCode = result[0].BillCode;
      console.log(`[ToyyibPay API] Successfully created bill ${billCode} for Order ${orderId}`);
      return res.status(200).json({
        success: true,
        billCode: billCode,
        paymentUrl: `https://toyyibpay.com/${billCode}`
      });
    } else {
      console.error("[ToyyibPay API] Bill creation failed:", result);
      return res.status(400).json({
        success: false,
        error: "ToyyibPay rejected bill creation",
        details: result
      });
    }
  } catch (err) {
    console.error("[ToyyibPay API] Server error:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
