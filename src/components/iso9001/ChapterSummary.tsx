import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chapter, AssessmentResult } from "@/data/iso9001Data";
import { ProgressBar } from "./ProgressBar";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ChapterSummaryProps {
  chapter: Chapter;
  result: AssessmentResult;
}

export const ChapterSummary = ({ chapter, result }: ChapterSummaryProps) => {
  const getProgressVariant = () => {
    if (result.percentage >= 80) return 'success';
    if (result.percentage >= 60) return 'warning';
    return 'destructive';
  };

  const getStatusIcon = () => {
    if (result.percentage >= 80) {
      return <CheckCircle className="w-5 h-5 text-success" />;
    } else if (result.percentage >= 60) {
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    } else {
      return <XCircle className="w-5 h-5 text-destructive" />;
    }
  };

  const getStatusText = () => {
    if (result.percentage >= 80) return 'Good';
    if (result.percentage >= 60) return 'Needs Attention';
    return 'Critical';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Chapter {chapter.id}: {chapter.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant="outline">
              {getStatusText()}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {chapter.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ProgressBar
          value={result.score}
          max={result.maxScore}
          variant={getProgressVariant()}
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">
              {result.score}
            </p>
            <p className="text-xs text-muted-foreground">Points Scored</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">
              {result.maxScore}
            </p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">
              {result.percentage}%
            </p>
            <p className="text-xs text-muted-foreground">Compliance</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">
              {result.completedQuestions}/{result.totalQuestions}
            </p>
            <p className="text-xs text-muted-foreground">Questions</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};