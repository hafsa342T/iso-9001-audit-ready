import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ZohoWebhookRequest {
  email: string;
  firstName?: string;
  company?: string;
}

// Input validation and sanitization
const validateAndSanitizeInput = (data: ZohoWebhookRequest) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!data.email || !emailRegex.test(data.email)) {
    throw new Error("Invalid email format");
  }
  
  if (data.email.length > 254) {
    throw new Error("Email too long");
  }
  
  // Sanitize inputs to prevent XSS
  const sanitize = (str: string) => {
    return str.replace(/[<>\"'&]/g, "");
  };
  
  const sanitizedData = {
    email: sanitize(data.email.toLowerCase()),
    firstName: data.firstName ? sanitize(data.firstName.substring(0, 50)) : undefined,
    company: data.company ? sanitize(data.company.substring(0, 100)) : undefined,
  };
  
  return sanitizedData;
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Zoho webhook function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log('Handling CORS preflight');
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    console.log('Processing Zoho webhook request...');
    const requestData: ZohoWebhookRequest = await req.json();

    // Validate and sanitize input
    const sanitizedData = validateAndSanitizeInput(requestData);

    console.log("Zoho webhook request details:", {
      email: sanitizedData.email,
      hasFirstName: !!sanitizedData.firstName,
      hasCompany: !!sanitizedData.company
    });

    const zohoWebhookUrl = Deno.env.get("ZOHO_WEBHOOK_URL");
    
    if (!zohoWebhookUrl) {
      console.log("Zoho webhook URL not configured");
      return new Response(JSON.stringify({
        success: false,
        error: "Zoho webhook not configured"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Send data to Zoho webhook
    const formData = new URLSearchParams();
    formData.append('email', sanitizedData.email);
    if (sanitizedData.firstName) formData.append('firstName', sanitizedData.firstName);
    if (sanitizedData.company) formData.append('company', sanitizedData.company);

    console.log("Sending data to Zoho webhook...");

    const zohoResponse = await fetch(zohoWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    console.log("Zoho response status:", zohoResponse.status);

    return new Response(JSON.stringify({
      success: true,
      message: "Data sent to Zoho successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in Zoho webhook function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to process Zoho webhook request" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);