import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  iso9001Chapters, 
  Answer, 
  AssessmentResult, 
  getScoreForAnswer, 
  getMaxScoreForAnswer 
} from "@/data/iso9001Data";
import { QuestionCard } from "./QuestionCard";
import { ChapterSummary } from "./ChapterSummary";
import { FinalResults } from "./FinalResults";
import { ProgressBar } from "./ProgressBar";
import { EmailOptIn } from "./EmailOptIn";
import { EnhancedResults } from "./EnhancedResults";
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  CheckCircle,
  Award,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ViewMode = 'assessment' | 'summary' | 'email-optin' | 'results';

export const ISO9001Assessment = () => {
  const { toast } = useToast();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('assessment');
  const [userInfo, setUserInfo] = useState<{
    email: string;
    firstName?: string;
    company?: string;
  } | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const currentChapter = iso9001Chapters[currentChapterIndex];
  const totalChapters = iso9001Chapters.length;
  
  // Calculate progress
  const totalQuestions = iso9001Chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const overallProgress = (answeredQuestions / totalQuestions) * 100;

  const handleAnswerChange = (answer: Answer) => {
    setAnswers(prev => ({
      ...prev,
      [answer.questionId]: answer
    }));
  };

  const calculateChapterResult = (chapterId: string): AssessmentResult => {
    const chapter = iso9001Chapters.find(c => c.id === chapterId);
    if (!chapter) {
      return {
        chapterId,
        score: 0,
        maxScore: 0,
        percentage: 0,
        completedQuestions: 0,
        totalQuestions: 0
      };
    }

    let score = 0;
    let maxScore = 0;
    let completedQuestions = 0;

    chapter.questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        completedQuestions++;
        score += getScoreForAnswer(answer.value, question.weight);
        maxScore += getMaxScoreForAnswer(answer.value, question.weight);
      } else {
        maxScore += question.weight;
      }
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    return {
      chapterId,
      score,
      maxScore,
      percentage,
      completedQuestions,
      totalQuestions: chapter.questions.length
    };
  };

  const getAllResults = (): AssessmentResult[] => {
    return iso9001Chapters.map(chapter => calculateChapterResult(chapter.id));
  };

  const isChapterComplete = (chapterIndex: number) => {
    const chapter = iso9001Chapters[chapterIndex];
    return chapter.questions.every(question => answers[question.id]);
  };

  const getChapterProgress = (chapterIndex: number) => {
    const chapter = iso9001Chapters[chapterIndex];
    const answeredInChapter = chapter.questions.filter(q => answers[q.id]).length;
    return (answeredInChapter / chapter.questions.length) * 100;
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < totalChapters - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    } else {
      setViewMode('summary');
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleEmailSubmit = async (email: string, firstName?: string, company?: string) => {
    setIsGeneratingReport(true);
    
    // Store user info
    setUserInfo({ email, firstName, company });
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Report Generated!",
      description: "Your ISO 9001 readiness report has been generated and sent to your email.",
    });
    
    setIsGeneratingReport(false);
    setViewMode('results');
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "Your detailed PDF report is being prepared for download.",
    });
  };

  const handleBookConsult = () => {
    toast({
      title: "Consultation Request",
      description: "We'll contact you shortly to schedule your free ISO 9001 consultation.",
    });
  };

  const currentChapterProgress = getChapterProgress(currentChapterIndex);
  const currentResult = calculateChapterResult(currentChapter.id);

  // Email opt-in view
  if (viewMode === 'email-optin') {
    return (
      <EmailOptIn 
        onSubmit={handleEmailSubmit}
        isLoading={isGeneratingReport}
      />
    );
  }

  // Enhanced results view
  if (viewMode === 'results') {
    return (
      <EnhancedResults 
        results={getAllResults()}
        userInfo={userInfo || undefined}
        onDownloadPDF={handleDownloadPDF}
        onBookConsult={handleBookConsult}
      />
    );
  }

  if (viewMode === 'summary') {
    const allResults = getAllResults();
    
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setViewMode('assessment')}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Assessment
            </Button>
            <h1 className="text-2xl font-bold">Chapter Summary</h1>
          </div>
          <Button 
            onClick={() => setViewMode('email-optin')} 
            className="gap-2"
            size="lg"
          >
            <Award className="w-4 h-4" />
            Get Final Results
          </Button>
        </div>

        <div className="grid gap-6">
          {allResults.map((result, index) => (
            <ChapterSummary 
              key={result.chapterId} 
              chapter={iso9001Chapters[index]} 
              result={result}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/1a14d669-33f7-46ab-86aa-cbce13007181.png" 
          alt="QSE Academy" 
          className="h-16 w-auto"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ISO 9001 Audit Readiness</h1>
          <p className="text-muted-foreground">Quality Management System Assessment</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <BookOpen className="w-3 h-3" />
            Chapter {currentChapter.id}
          </Badge>
          <Badge variant="secondary">
            {currentChapterIndex + 1} of {totalChapters}
          </Badge>
        </div>
      </div>

      {/* Overall Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {answeredQuestions} of {totalQuestions} questions
            </span>
          </div>
          <ProgressBar value={answeredQuestions} max={totalQuestions} />
        </CardContent>
      </Card>

      {/* Chapter Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={handlePrevChapter}
          disabled={currentChapterIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <div className="flex-1 text-center">
          <h2 className="text-xl font-semibold">
            Chapter {currentChapter.id}: {currentChapter.title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {currentChapter.description}
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={handleNextChapter}
          className="gap-2"
        >
{currentChapterIndex === totalChapters - 1 ? (
            <>
              Complete Assessment <FileText className="w-4 h-4" />
            </>
          ) : (
            <>
              Next <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Chapter Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Chapter Progress</span>
            <div className="flex items-center gap-2">
              {isChapterComplete(currentChapterIndex) && (
                <CheckCircle className="w-4 h-4 text-success" />
              )}
              <span className="text-sm text-muted-foreground">
                {Math.round(currentChapterProgress)}%
              </span>
            </div>
          </div>
          <ProgressBar 
            value={currentResult.completedQuestions} 
            max={currentResult.totalQuestions}
            variant={currentChapterProgress === 100 ? 'success' : 'default'}
          />
        </CardContent>
      </Card>

      {/* Questions */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-6">
          {currentChapter.questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              answer={answers[question.id]}
              onAnswerChange={handleAnswerChange}
              questionNumber={index + 1}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handlePrevChapter}
            disabled={currentChapterIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button 
            variant="ghost"
            onClick={() => setViewMode('summary')}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            View Summary
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Chapter {currentChapterIndex + 1} of {totalChapters}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalChapters }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentChapterIndex 
                      ? 'bg-primary' 
                      : isChapterComplete(i) 
                        ? 'bg-success' 
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleNextChapter}
            className="gap-2"
          >
            {currentChapterIndex === totalChapters - 1 ? (
              <>
                Complete Assessment <FileText className="w-4 h-4" />
              </>
            ) : (
              <>
                Next <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-8 -mx-6 px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/1a14d669-33f7-46ab-86aa-cbce13007181.png" 
              alt="QSE Academy" 
              className="h-8 w-auto"
            />
            <span className="font-semibold text-foreground">QSE ACADEMY</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} QSE Academy. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Support: <a href="mailto:support@qse-academy.com" className="text-primary hover:underline">support@qse-academy.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};