import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, FileText, Target, Clock, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">QSE Academy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            ISO 9001 Audit Readiness Tool
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Free interactive assessment tool to evaluate your organization's ISO 9001:2015 compliance readiness. 
            Identify gaps, assess risks, and get actionable insights with a comprehensive audit readiness report.
          </p>
          <Link to="/assessment">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Free Assessment
            </Button>
          </Link>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Completely Free</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">No Registration Required</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Who Should Use This Tool</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-3">Quality Managers</h3>
                <p className="text-muted-foreground text-justify">
                  Monitor QMS performance, prepare for internal audits, and ensure continuous compliance with ISO 9001 requirements across all organizational processes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-3">Compliance Officers</h3>
                <p className="text-muted-foreground text-justify">
                  Assess regulatory compliance, identify risk areas, and develop corrective action plans to maintain certification and meet stakeholder expectations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-3">ISO Consultants</h3>
                <p className="text-muted-foreground text-justify">
                  Provide clients with objective assessments, benchmark current state against best practices, and develop targeted improvement strategies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How the Assessment Works</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <h3 className="font-semibold mb-2">Comprehensive Question Set</h3>
                    <p className="text-muted-foreground">Answer questions covering all 10 clauses of ISO 9001:2015, from organizational context to improvement processes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <h3 className="font-semibold mb-2">Intelligent Scoring</h3>
                    <p className="text-muted-foreground">Our algorithm evaluates responses using industry best practices and assigns readiness scores for each process area.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <h3 className="font-semibold mb-2">Detailed Analysis</h3>
                    <p className="text-muted-foreground">Receive comprehensive reports with visual charts, gap analysis, and specific recommendations for improvement.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">15-20 Minutes</p>
                      <p className="text-sm text-muted-foreground">Average completion time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">50+ Questions</p>
                      <p className="text-sm text-muted-foreground">Covering all ISO 9001 clauses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold">Instant Results</p>
                      <p className="text-sm text-muted-foreground">Downloadable PDF report</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What is ISO 9001 Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding ISO 9001:2015</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-muted-foreground mb-4 text-justify">
                ISO 9001:2015 is the international standard for Quality Management Systems (QMS), trusted by over one million organizations worldwide. 
                This standard provides a framework for delivering consistent quality, improving customer satisfaction, and demonstrating continuous improvement.
              </p>
              <p className="text-muted-foreground mb-4 text-justify">
                The 2015 revision introduced risk-based thinking, leadership engagement, and process-based approaches, making it more relevant for modern organizations. 
                Understanding and implementing ISO 9001 requirements is crucial for maintaining certification and achieving operational excellence.
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-4 text-justify">
                Regular audit readiness assessments help organizations identify compliance gaps before external audits, reducing the risk of non-conformities 
                and ensuring smooth certification processes. Our tool evaluates all key clauses of the standard, providing comprehensive insights into your QMS maturity.
              </p>
              <p className="text-muted-foreground text-justify">
                Learn more about ISO 9001 standards and implementation best practices from the{" "}
                <a 
                  href="https://asq.org/quality-resources/iso-9001" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline"
                >
                  American Society for Quality (ASQ)
                </a>, a leading authority on quality management systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Audit Readiness Matters</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Reduce Audit Risks</h3>
              <p className="text-muted-foreground mb-6 text-justify">
                Proactive assessment helps identify potential non-conformities before they become audit findings. Organizations that regularly assess their 
                readiness experience 40% fewer major non-conformities during certification audits.
              </p>
              
              <h3 className="text-xl font-semibold mb-4">Continuous Improvement</h3>
              <p className="text-muted-foreground mb-6 text-justify">
                Regular readiness assessments support the Plan-Do-Check-Act cycle, enabling organizations to continuously enhance their QMS effectiveness 
                and demonstrate commitment to quality excellence.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Cost-Effective Preparation</h3>
              <p className="text-muted-foreground mb-6 text-justify">
                Early identification of gaps allows for strategic resource allocation and prevents costly audit delays or failures. 
                Investing in readiness assessment saves organizations an average of 30% in audit-related costs.
              </p>
              
              <h3 className="text-xl font-semibold mb-4">Stakeholder Confidence</h3>
              <p className="text-muted-foreground text-justify">
                Demonstrating audit readiness builds confidence with customers, suppliers, and regulatory bodies, enhancing your organization's 
                reputation and competitive advantage in the marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Development Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Enhance Your Quality Management Expertise</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            While our free assessment tool provides valuable insights into your current audit readiness, developing deep expertise in ISO 9001 
            implementation requires comprehensive training and practical experience.
          </p>
          <p className="text-muted-foreground mb-8">
            QSE Academy offers professional development courses designed by industry experts to help quality professionals master ISO standards, 
            audit techniques, and quality management best practices. Our{" "}
            <a 
              href="https://www.qse-academy.com/courses-2/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline"
            >
              comprehensive course catalog
            </a>{" "}
            includes certification programs, practical workshops, and advanced training modules tailored for quality managers, auditors, and consultants.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Assess Your ISO 9001 Readiness?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your free assessment now and get actionable insights to improve your Quality Management System
          </p>
          <Link to="/assessment">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-3">
              Begin Assessment
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;