import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { RadarChart } from "./RadarChart";
import { CategoryChart } from "./CategoryChart";
import { ReadinessGauge } from "./ReadinessGauge";
import { AssessmentResult } from "@/data/iso9001Data";

interface EnhancedResultsProps {
  results: AssessmentResult[];
  userInfo?: {
    email: string;
    firstName?: string;
    company?: string;
  };
  onDownloadPDF: () => void;
  onBookConsult?: () => void;
}

export const EnhancedResults: React.FC<EnhancedResultsProps> = ({
  results,
  userInfo,
  onDownloadPDF,
  onBookConsult
}) => {
  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const maxScore = results.reduce((sum, result) => sum + result.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  const getReadinessLevel = (percentage: number) => {
    if (percentage >= 85) return { level: "Excellent", color: "emerald", badge: "default" };
    if (percentage >= 70) return { level: "Good", color: "blue", badge: "secondary" };
    if (percentage >= 55) return { level: "Fair", color: "amber", badge: "outline" };
    return { level: "Needs Improvement", color: "rose", badge: "destructive" };
  };

  const readiness = getReadinessLevel(percentage);
  
  const getTopRecommendations = () => {
    const weakAreas = results
      .filter(result => (result.score / result.maxScore) < 0.7)
      .sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore))
      .slice(0, 5);
      
    return weakAreas.map(area => ({
      chapter: area.chapterId,
      title: getChapterName(area.chapterId),
      score: Math.round((area.score / area.maxScore) * 100),
      recommendation: getRecommendationForChapter(area.chapterId)
    }));
  };

  const getChapterName = (chapterId: string) => {
    const chapterNames: Record<string, string> = {
      "4": "Chapter 4: Context of the Organization",
      "5": "Chapter 5: Leadership", 
      "6": "Chapter 6: Planning",
      "7": "Chapter 7: Support",
      "8": "Chapter 8: Operation",
      "9": "Chapter 9: Performance Evaluation",
      "10": "Chapter 10: Improvement"
    };
    return chapterNames[chapterId] || `Chapter ${chapterId}`;
  };

  const getRecommendationForChapter = (chapterId: string) => {
    const recommendations: Record<string, string> = {
      "4": "Develop stakeholder analysis and organizational context documentation",
      "5": "Establish clear quality policy and leadership commitment procedures", 
      "6": "Create comprehensive quality objectives and risk management processes",
      "7": "Implement resource allocation and competency management systems",
      "8": "Strengthen operational planning and process controls",
      "9": "Develop robust monitoring, measurement, and audit programs",
      "10": "Establish systematic nonconformity and improvement processes"
    };
    return recommendations[chapterId] || "Review and strengthen this area according to ISO 9001 requirements";
  };

  const topRecommendations = getTopRecommendations();

  // AI-generated comments based on results
  const getOverallComment = () => {
    if (percentage >= 85) {
      return "Excellent work! Your organization shows strong ISO 9001 compliance. Focus now on preparing comprehensive evidence and documentation for the audit. Ensure all processes are well-documented with clear records and proof of implementation.";
    } else if (percentage >= 70) {
      return "Good progress on ISO 9001 implementation. Address the identified gaps and strengthen your documentation. Remember, having processes in place is just the first step - you'll need to demonstrate evidence and proof of consistent implementation to the auditor.";
    } else if (percentage >= 55) {
      return "Your organization has made a fair start but significant work remains. Focus on the priority areas identified below and ensure you have robust evidence collection processes. The auditor will require proof of implementation, not just documented procedures.";
    } else {
      return "Substantial improvements needed before audit readiness. Prioritize the fundamental gaps identified and establish strong documentation practices. Consider postponing the audit until critical requirements are met and you have sufficient evidence to demonstrate compliance.";
    }
  };

  const getComplianceOverviewComment = () => {
    const scores = results.map(r => ({ id: r.chapterId, score: (r.score / r.maxScore) * 100 }));
    const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    const weakChapters = scores.filter(s => s.score < avgScore - 20);
    
    if (weakChapters.length > 0) {
      const weakChapterNames = weakChapters.map(c => getChapterName(c.id)).join(', ');
      return `Attention needed: ${weakChapterNames} significantly underperform compared to other areas. These chapters require immediate focus to achieve balanced compliance across all ISO 9001 requirements.`;
    }
    return "Compliance is relatively balanced across all chapters. Continue strengthening weaker areas while maintaining current performance levels.";
  };

  const getChapterBreakdownComment = () => {
    const scores = results.map(r => ({ id: r.chapterId, score: (r.score / r.maxScore) * 100, name: getChapterName(r.chapterId) }));
    const lowest = scores.reduce((min, current) => current.score < min.score ? current : min);
    const highest = scores.reduce((max, current) => current.score > max.score ? current : max);
    
    if (lowest.score < 50) {
      return `Critical attention needed for ${lowest.name} (${Math.round(lowest.score)}%). This fundamental area requires immediate improvement before proceeding with audit preparations.`;
    } else if (lowest.score < 70) {
      return `${lowest.name} (${Math.round(lowest.score)}%) needs focused attention. While other areas show good progress, this chapter could impact overall audit success.`;
    }
    return "All chapters show acceptable performance levels. Continue systematic improvement while preparing comprehensive evidence for audit verification.";
  };

  const getPriorityItemsComment = () => {
    if (topRecommendations.length === 0) {
      return "Excellent! All chapters meet acceptable standards. Focus on fine-tuning processes and gathering comprehensive evidence for audit day. Ensure all documentation is current and accessible.";
    } else if (topRecommendations.length <= 2) {
      return `Limited priority areas identified. Address the ${topRecommendations.length} chapter${topRecommendations.length > 1 ? 's' : ''} below and you'll be well-positioned for audit success.`;
    } else {
      return `Multiple chapters require attention. Focus on the top 3 priority areas first, as improvements here will have the greatest impact on your overall audit readiness.`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            ISO 9001 Audit Readiness Report
          </h1>
          {userInfo?.company && (
            <p className="text-xl text-muted-foreground">for {userInfo.company}</p>
          )}
          {userInfo?.firstName && (
            <p className="text-lg text-muted-foreground">Prepared for {userInfo.firstName}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Overall Score Card */}
        <Card className="shadow-xl border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl">Overall Readiness Score</CardTitle>
            <CardDescription>Your organization's ISO 9001 compliance level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left side - Score and Gauge */}
              <div className="space-y-6">
                <div className="flex justify-center">
                  <ReadinessGauge percentage={percentage} />
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-5xl font-bold text-primary">{percentage}%</div>
                  <Badge variant={readiness.badge as any} className="text-lg px-4 py-2">
                    {readiness.level}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-semibold text-primary">{totalScore}</div>
                    <div className="text-sm text-muted-foreground">Points Achieved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-muted-foreground">{maxScore}</div>
                    <div className="text-sm text-muted-foreground">Total Possible</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-accent">{results.length}</div>
                    <div className="text-sm text-muted-foreground">Chapters Assessed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-secondary">
                      {results.filter(r => (r.score / r.maxScore) >= 0.8).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Strong Areas</div>
                  </div>
                </div>
              </div>

              {/* Right side - AI Commentary */}
              <div className="bg-muted/30 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Assessment Commentary
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {getOverallComment()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Compliance Overview
              </CardTitle>
              <CardDescription>
                Strengths and gaps across all ISO 9001 areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadarChart results={results} />
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {getComplianceOverviewComment()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Chapter Breakdown
              </CardTitle>
              <CardDescription>
                Detailed scores by chapter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CategoryChart results={results} />
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {getChapterBreakdownComment()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Recommendations */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Priority Action Items
            </CardTitle>
            <CardDescription>
              Top areas requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-lg border border-rose-200 dark:border-rose-800 mb-4">
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  {getPriorityItemsComment()}
                </p>
              </div>
              
              {topRecommendations.map((rec, index) => (
                <div key={rec.chapter} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">
                      {index + 1}. {rec.title}
                    </h4>
                    <Badge variant="outline">{rec.score}% Complete</Badge>
                  </div>
                  <p className="text-muted-foreground">{rec.recommendation}</p>
                </div>
              ))}
              
              {topRecommendations.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p className="text-lg">All chapters meet acceptable performance standards!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onDownloadPDF}
            size="lg"
            className="text-lg px-8 py-6"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Full PDF Report
          </Button>
          
          {onBookConsult && (
            <Button 
              onClick={onBookConsult}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <FileText className="w-5 h-5 mr-2" />
              Book Free Consultation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};