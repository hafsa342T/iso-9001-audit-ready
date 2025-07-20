import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, FileText, Target, Clock, Shield, ArrowRight, BarChart3, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-section py-20 px-4 overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">QSE Academy</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
                ISO 9001 Audit 
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> 
                  Readiness Tool
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Free interactive assessment tool to evaluate your organization's ISO 9001:2015 compliance readiness. 
                Identify gaps, assess risks, and get actionable insights with a comprehensive audit readiness report.
              </p>
              <div className="mb-8">
                <Link to="/assessment">
                  <Button size="lg" className="text-lg px-10 py-4 h-auto group shadow-xl hover:shadow-2xl transition-all duration-300">
                    Start Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="feature-badge flex items-center gap-2 px-4 py-3 rounded-full">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-primary font-medium">Completely Free</span>
                </div>
                <div className="feature-badge flex items-center gap-2 px-4 py-3 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-primary font-medium">No Registration</span>
                </div>
                <div className="feature-badge flex items-center gap-2 px-4 py-3 rounded-full">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-primary font-medium">Instant Results</span>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <img 
                src={heroImage} 
                alt="Professional team working on ISO 9001 compliance assessment" 
                className="hero-image w-full h-auto max-w-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-primary mr-2" />
                <span className="text-4xl font-bold text-foreground">1M+</span>
              </div>
              <p className="text-muted-foreground">Organizations use ISO 9001 worldwide</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-accent mr-2" />
                <span className="text-4xl font-bold text-foreground">40%</span>
              </div>
              <p className="text-muted-foreground">Fewer non-conformities with readiness assessments</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-primary mr-2" />
                <span className="text-4xl font-bold text-foreground">30%</span>
              </div>
              <p className="text-muted-foreground">Cost savings on audit preparation</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is ISO 9001 Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Understanding ISO 9001:2015</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                ISO 9001:2015 is the international standard for Quality Management Systems (QMS), trusted by over one million organizations worldwide. 
                This standard provides a framework for delivering consistent quality, improving customer satisfaction, and demonstrating continuous improvement.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The 2015 revision introduced risk-based thinking, leadership engagement, and process-based approaches, making it more relevant for modern organizations. 
                Understanding and implementing ISO 9001 requirements is crucial for maintaining certification and achieving operational excellence.
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Regular audit readiness assessments help organizations identify compliance gaps before external audits, reducing the risk of non-conformities 
                and ensuring smooth certification processes. Our tool evaluates all key clauses of the standard, providing comprehensive insights into your QMS maturity.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Learn more about ISO 9001 standards and implementation best practices from the{" "}
                <a 
                  href="https://asq.org/quality-resources/iso-9001" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline font-medium transition-colors"
                >
                  American Society for Quality (ASQ)
                </a>, a leading authority on quality management systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Who Should Use This Tool</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-enhanced border-0 h-full">
              <CardContent className="p-8 text-center">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Quality Managers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor QMS performance, prepare for internal audits, and ensure continuous compliance with ISO 9001 requirements across all organizational processes.
                </p>
              </CardContent>
            </Card>
            <Card className="card-enhanced border-0 h-full">
              <CardContent className="p-8 text-center">
                <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Compliance Officers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Assess regulatory compliance, identify risk areas, and develop corrective action plans to maintain certification and meet stakeholder expectations.
                </p>
              </CardContent>
            </Card>
            <Card className="card-enhanced border-0 h-full">
              <CardContent className="p-8 text-center">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">ISO Consultants</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Provide clients with objective assessments, benchmark current state against best practices, and develop targeted improvement strategies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">How the Assessment Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="step-number w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Comprehensive Question Set</h3>
                  <p className="text-muted-foreground leading-relaxed">Answer questions covering all 10 clauses of ISO 9001:2015, from organizational context to improvement processes.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="step-number w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Intelligent Scoring</h3>
                  <p className="text-muted-foreground leading-relaxed">Our algorithm evaluates responses using industry best practices and assigns readiness scores for each process area.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="step-number w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Detailed Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed">Receive comprehensive reports with visual charts, gap analysis, and specific recommendations for improvement.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="card-enhanced border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-foreground">15-20 Minutes</p>
                      <p className="text-muted-foreground">Average completion time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-enhanced border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-foreground">50+ Questions</p>
                      <p className="text-muted-foreground">Covering all ISO 9001 clauses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-enhanced border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-foreground">Instant Results</p>
                      <p className="text-muted-foreground">Downloadable PDF report</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Why Audit Readiness Matters</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Reduce Audit Risks</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Proactive assessment helps identify potential non-conformities before they become audit findings. Organizations that regularly assess their 
                  readiness experience 40% fewer major non-conformities during certification audits.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Continuous Improvement</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Regular readiness assessments support the Plan-Do-Check-Act cycle, enabling organizations to continuously enhance their QMS effectiveness 
                  and demonstrate commitment to quality excellence.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Cost-Effective Preparation</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Early identification of gaps allows for strategic resource allocation and prevents costly audit delays or failures. 
                  Investing in readiness assessment saves organizations an average of 30% in audit-related costs.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Stakeholder Confidence</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Demonstrating audit readiness builds confidence with customers, suppliers, and regulatory bodies, enhancing your organization's 
                  reputation and competitive advantage in the marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Development Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Enhance Your Quality Management Expertise</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            While our free assessment tool provides valuable insights into your current audit readiness, developing deep expertise in ISO 9001 
            implementation requires comprehensive training and practical experience.
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            QSE Academy offers professional development courses designed by industry experts to help quality professionals master ISO standards, 
            audit techniques, and quality management best practices. Our{" "}
            <a 
              href="https://www.qse-academy.com/courses-2/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline font-medium transition-colors"
            >
              comprehensive course catalog
            </a>{" "}
            includes certification programs, practical workshops, and advanced training modules tailored for quality managers, auditors, and consultants.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-20 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Assess Your ISO 9001 Readiness?</h2>
          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Start your free assessment now and get actionable insights to improve your Quality Management System
          </p>
          <Link to="/assessment">
            <Button variant="secondary" size="lg" className="text-xl px-12 py-4 h-auto group shadow-2xl hover:shadow-3xl transition-all duration-300">
              Begin Assessment
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;