import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailOptInProps {
  onSubmit: (email: string, firstName?: string, company?: string) => void;
  isLoading?: boolean;
}

export const EmailOptIn: React.FC<EmailOptInProps> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced input validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (email.length > 254) {
      toast({
        title: "Email Too Long",
        description: "Please enter a shorter email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (firstName && firstName.length > 50) {
      toast({
        title: "Name Too Long",
        description: "Please enter a shorter first name.",
        variant: "destructive",
      });
      return;
    }
    
    if (company && company.length > 100) {
      toast({
        title: "Company Name Too Long",
        description: "Please enter a shorter company name.",
        variant: "destructive",
      });
      return;
    }

    // Send data to secure Zoho webhook endpoint
    try {
      const { data, error } = await supabase.functions.invoke('send-zoho-webhook', {
        body: {
          email: email.trim(),
          firstName: firstName.trim() || undefined,
          company: company.trim() || undefined,
        }
      });

      if (error) {
        console.error('Error sending to Zoho:', error);
        toast({
          title: "Error",
          description: "Failed to send data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Data sent to Zoho successfully:', data);
    } catch (error) {
      console.error('Error sending to Zoho:', error);
      toast({
        title: "Error",
        description: "Failed to send data. Please try again.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(email, firstName, company);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Get Your Personalized ISO 9001 Audit Readiness Report</CardTitle>
          <CardDescription className="text-base">
            Receive your detailed compliance analysis, actionable recommendations, and expert insights instantly via email.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">Detailed Score Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">Priority Action Items</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">Expert Recommendations</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name (Optional)</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full text-lg py-6"
              disabled={isLoading}
            >
              <Mail className="w-5 h-5 mr-2" />
              {isLoading ? "Generating Report..." : "Get My Report Now"}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Your information will only be used to send your report and occasional ISO 9001 insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};