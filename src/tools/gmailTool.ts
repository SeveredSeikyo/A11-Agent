import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { sendMail } from "../utils/gmail.util";

export const sendEmail = tool(
  async ({ toMail, mailSubject, htmlContent }) => {
    console.log("📧 Gmail Tool calling...");

    const result = await sendMail({
      toMail,
      mailSubject,
      htmlContent,
    });

    console.log("Gmail Tool called");

    return {
      success: true,
      message: "Email sent successfully",
      to: toMail,
      subject: mailSubject,
      providerResponse: result,
    };
  },
  {
    name: "sendEmail",
    description:
      "Send an email using Gmail. Use this tool when the user asks to send, email, notify, or message someone via email. Supports HTML email content.",
    schema: z.object({
      toMail: z
        .email()
        .describe("Recipient email address (e.g. user@example.com)"),

      mailSubject: z
        .string()
        .min(1)
        .describe("Subject line of the email"),

      htmlContent: z
        .string()
        .min(1)
        .describe(
          "HTML content of the email body. Can include formatting like <p>, <b>, <ul>, links, etc."
        ),
    }),
  }
);
