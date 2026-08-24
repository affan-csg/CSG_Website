export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const {
    name,
    email,
    subject,
    message,
  } = body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  const notificationEmail = process.env.NOTIFICATION_EMAIL;

  if (!notificationEmail) {
    console.error("Notification email not configured");
    throw createError({
      statusCode: 500,
      statusMessage: "Email service not configured",
    });
  }

  try {
    // Send inquiry email to support
    await sendEmail({
      to: notificationEmail,
      subject: `Contact Form Inquiry: ${subject}`,
      template: "inquiry-notification",
      data: {
        name,
        email,
        subject,
        message,
        receivedAt: new Date().toISOString(),
      },
    });

    // Send confirmation to user
    await sendEmail({
      to: email,
      subject: "We received your inquiry",
      template: "inquiry-confirmation",
      data: {
        name,
      },
    });

    return {
      success: true,
      message: "Thank you for reaching out. We've received your message and will respond as soon as possible.",
    };
  } catch (error) {
    console.error("Email service error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to send message. Please try again later.",
    });
  }
});
