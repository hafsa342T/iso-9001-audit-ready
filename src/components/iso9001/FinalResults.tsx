import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssessmentResult, getReadinessLevel, iso9001Chapters } from "@/data/iso9001Data";
import { ProgressBar } from "./ProgressBar";
import { Download, Award, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

interface FinalResultsProps {
  results: AssessmentResult[];
  onExportReport: () => void;
}

export const FinalResults = ({ results, onExportReport }: FinalResultsProps) => {
  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const totalMaxScore = results.reduce((sum, result) => sum + result.maxScore, 0);
  const overallPercentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
  
  const readiness = getReadinessLevel(overallPercentage);
  
  const totalQuestions = results.reduce((sum, result) => sum + result.totalQuestions, 0);
  const completedQuestions = results.reduce((sum, result) => sum + result.completedQuestions, 0);

  const getChapterName = (chapterId: string) => {
    const chapter = iso9001Chapters.find(ch => ch.id === chapterId);
    return chapter ? `${chapter.title}` : `Chapter ${chapterId}`;
  };

  const getReadinessIcon = () => {
    switch (readiness.color) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-success" />;
      case 'primary':
        return <Award className="w-8 h-8 text-primary" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-warning" />;
      default:
        return <XCircle className="w-8 h-8 text-destructive" />;
    }
  };

  const getVariantFromColor = (color: string) => {
    switch (color) {
      case 'success':
        return 'default';
      case 'primary':
        return 'default';
      case 'warning':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {getReadinessIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">
            ISO 9001 Audit Readiness Assessment
          </CardTitle>
          <div className="flex justify-center">
            <Badge 
              variant={getVariantFromColor(readiness.color)}
              className="text-base px-4 py-2"
            >
              {readiness.level}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground mb-2">
              {overallPercentage}%
            </div>
            <p className="text-muted-foreground">
              Overall Compliance Score
            </p>
          </div>

          <ProgressBar
            value={totalScore}
            max={totalMaxScore}
            variant={readiness.color as any}
            className="max-w-md mx-auto"
          />

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-center text-sm text-muted-foreground">
              {readiness.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {totalScore}
              </p>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {totalMaxScore}
              </p>
              <p className="text-xs text-muted-foreground">Max Points</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {completedQuestions}
              </p>
              <p className="text-xs text-muted-foreground">Answered</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">
                {results.length}
              </p>
              <p className="text-xs text-muted-foreground">Chapters</p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={onExportReport} size="lg" className="gap-2">
              <Download className="w-4 h-4" />
              Export Assessment Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chapter Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={result.chapterId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {result.chapterId}
                  </Badge>
                  <span className="font-medium">
                    {getChapterName(result.chapterId)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {result.completedQuestions}/{result.totalQuestions} questions
                  </span>
                  <Badge variant={result.percentage >= 80 ? 'default' : result.percentage >= 60 ? 'secondary' : 'destructive'}>
                    {result.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};