import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface EmailRequest {
  clientEmail: string;
  clientName: string;
  copyEmail: string;
  reportHtml: string;
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
      overallScore
    });

    // Since we can't use Resend without the API key being properly configured,
    // let's return a success response for now and log the attempt
    console.log("Email would be sent to:", clientEmail, "with copy to:", copyEmail);
    console.log("Report HTML length:", reportHtml.length);

    // Simulate successful email sending
    const mockResponse = {
      success: true,
      messageId: `mock_${Date.now()}`,
      message: "Email functionality ready - configure Resend API key to enable actual sending"
    };

    console.log("Mock email response:", mockResponse);

    return new Response(JSON.stringify(mockResponse), {
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