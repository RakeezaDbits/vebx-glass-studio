import nodemailer from "nodemailer";

const RECIPIENTS = [
  "support@vebx.run",
  "aimanmaqsoodahmed@gmail.com",
  "rakeezasattar53@gmail.com",
];

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
}

export async function sendContactNotification(data) {
  const { name, email, subject, message } = data;
  const transporter = getTransporter();
  const text = [
    `New Contact Form Submission`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject || "(none)"}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject || "(none)"}</p>
    <p><strong>Message:</strong></p>
    <pre>${message}</pre>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: RECIPIENTS.join(", "),
    subject: `[vebx.run] Contact: ${subject || name}`,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendQuoteNotification(data) {
  const {
    name,
    email,
    phone,
    service_slug,
    sub_type_id,
    tech_ids,
    tier_id,
    reference_link,
  } = data;
  const transporter = getTransporter();
  const techList = Array.isArray(tech_ids) ? tech_ids.join(", ") : tech_ids || "-";

  const text = [
    `New Get a Quote Submission`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "(none)"}`,
    `Service: ${service_slug}`,
    `Sub-type: ${sub_type_id || "(none)"}`,
    `Technologies: ${techList}`,
    `Plan/Tier: ${tier_id || "(none)"}`,
    `Reference: ${reference_link || "(none)"}`,
  ].join("\n");

  const html = `
    <h2>New Get a Quote Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "-"}</p>
    <p><strong>Service:</strong> ${service_slug}</p>
    <p><strong>Sub-type:</strong> ${sub_type_id || "-"}</p>
    <p><strong>Technologies:</strong> ${techList}</p>
    <p><strong>Plan:</strong> ${tier_id || "-"}</p>
    <p><strong>Reference link:</strong> ${reference_link ? `<a href="${reference_link}">${reference_link}</a>` : "-"}</p>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: RECIPIENTS.join(", "),
    subject: `[vebx.run] Get a Quote: ${name} - ${service_slug}`,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
}

/** Notify admins when a visitor sends a live chat message (SMTP via env). */
export async function sendLiveChatNotification({ sessionId, visitorName, visitorEmail, preview, adminUrl }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_APP_PASSWORD) {
    console.warn("Live chat email skipped: set SMTP_USER and SMTP_APP_PASSWORD");
    return;
  }
  const transporter = getTransporter();
  const safePreview = (preview || "(no text)").slice(0, 500);
  const text = [
    `New live chat message`,
    ``,
    `Session #${sessionId}`,
    `Visitor: ${visitorName || "(anonymous)"}`,
    `Email: ${visitorEmail || "(none)"}`,
    ``,
    `Preview: ${safePreview}`,
    ``,
    `Open admin: ${adminUrl}`,
  ].join("\n");

  const html = `
    <h2>New live chat message</h2>
    <p><strong>Session</strong> #${sessionId}</p>
    <p><strong>Visitor</strong> ${visitorName || "(anonymous)"}</p>
    <p><strong>Email</strong> ${visitorEmail || "(none)"}</p>
    <p><strong>Preview</strong></p>
    <pre style="white-space:pre-wrap">${safePreview.replace(/</g, "&lt;")}</pre>
    <p><a href="${adminUrl}">Open live chat in admin</a></p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: RECIPIENTS.join(", "),
    subject: `[vebx.run] Live chat — session #${sessionId}`,
    text,
    html,
  });
}
