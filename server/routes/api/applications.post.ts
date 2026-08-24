export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const {
    fullName,
    email,
    phone,
    specialty,
    currentLocation,
    workAuthorization,
    availability,
    yearsExperience,
    resumeUrl,
    portfolioUrl,
    linkedinUrl,
  } = body;

  // Validate required fields
  if (!fullName || !email || !specialty) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  const atsEndpoint = process.env.ATS_ENDPOINT_URL;
  const atsApiKey = process.env.ATS_API_KEY;

  if (!atsEndpoint || !atsApiKey) {
    console.error("ATS endpoint or API key not configured");
    throw createError({
      statusCode: 500,
      statusMessage: "ATS integration not configured",
    });
  }

  try {
    // Send to ATS system
    const atsResponse = await $fetch(atsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${atsApiKey}`,
      },
      body: {
        source: "website",
        timestamp: new Date().toISOString(),
        applicationType: "candidate-profile",
        personalInfo: {
          name: fullName,
          email,
          phone: phone || null,
          linkedinUrl: linkedinUrl || null,
        },
        profile: {
          specialty,
          location: currentLocation,
          workAuthorization,
          availability,
          yearsExperience,
        },
        attachments: {
          resume: resumeUrl || null,
          portfolio: portfolioUrl || null,
        },
      },
    });

    // Send notification email
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (notificationEmail) {
      try {
        await sendEmail({
          to: notificationEmail,
          subject: `New Candidate Profile from ${fullName}`,
          template: "candidate-notification",
          data: {
            fullName,
            email,
            specialty,
            availability,
          },
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        // Don't fail the request if email fails
      }
    }

    return {
      success: true,
      message: "Thank you! Your profile has been added to our talent network. We'll reach out when relevant opportunities arise.",
      profileId: atsResponse?.id,
    };
  } catch (error) {
    console.error("ATS API error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to process application. Please try again.",
    });
  }
});
