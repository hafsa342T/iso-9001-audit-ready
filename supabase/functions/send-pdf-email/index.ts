import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface EmailRequest {
  clientEmail: string;
  clientName: string;
  copyEmail: string;
  reportHtml?: string;
  pdfData?: string;
  overallScore: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Email function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log('Handling CORS preflight');
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    console.log('Processing email request...');
    const { clientEmail, clientName, copyEmail, reportHtml, overallScore }: EmailRequest = await req.json();

    console.log("Email request details:", {
      to: clientEmail,
      cc: copyEmail,
      clientName,
      overallScore,
      hasReportHtml: !!reportHtml
    });

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.log("Resend API key not configured");
      return new Response(JSON.stringify({
        success: false,
        error: "Email service not configured"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const resend = new Resend(resendApiKey);

    if (!reportHtml) {
      throw new Error("No report content provided");
    }

    // Convert HTML to base64 for attachment
    const encoder = new TextEncoder();
    const htmlBytes = encoder.encode(reportHtml);
    const base64Html = btoa(String.fromCharCode(...htmlBytes));

    console.log("Sending email with HTML attachment...");

    // Send the actual email with HTML attachment
    const emailResponse = await resend.emails.send({
      from: "QSE Academy <noreply@qse-academy.com>",
      to: [clientEmail],
      cc: copyEmail ? [copyEmail] : undefined,
      subject: `ISO 9001 Assessment Report - ${clientName}`,
      html: `
        <h2>Your ISO 9001 Assessment Report is Ready!</h2>
        <p>Dear ${clientName},</p>
        <p>Thank you for completing the ISO 9001 readiness assessment. Your overall readiness score is <strong>${overallScore}%</strong>.</p>
        <p>Please find your detailed assessment report attached as an HTML file. You can open it in any web browser and print it to PDF if needed.</p>
        <br>
        <p>Best regards,<br>QSE Academy Team</p>
      `,
      attachments: [
        {
          filename: 'ISO9001-Assessment-Report.html',
          content: base64Html,
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      messageId: emailResponse.id,
      message: "Report sent successfully via email"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to process email request" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);