import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

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
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const currentChapter = iso9001Chapters[currentChapterIndex];
  const totalChapters = iso9001Chapters.length;
  
  // Calculate progress
  const totalQuestions = iso9001Chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const overallProgress = (answeredQuestions / totalQuestions) * 100;

  // Auto-save progress when answers change
  useEffect(() => {
    if (assessmentId && Object.keys(answers).length > 0) {
      updateAssessmentProgress();
    }
  }, [answers, assessmentId]);

  const updateAssessmentProgress = async () => {
    if (!assessmentId) return;
    
    try {
      await supabase
        .from('assessments')
        .update({ 
          overall_progress: overallProgress,
          updated_at: new Date().toISOString()
        })
        .eq('id', assessmentId);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const startNewAssessment = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .insert({
          email: 'anonymous@temp.com', // Temporary email until user provides one
          overall_progress: 0,
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;
      setAssessmentId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Error",
        description: "Failed to create assessment. Please refresh the page.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Start a new assessment on component mount
  useEffect(() => {
    if (!assessmentId) {
      startNewAssessment();
    }
  }, []);

  const handleAnswerChange = async (answer: Answer) => {
    setAnswers(prev => ({
      ...prev,
      [answer.questionId]: answer
    }));

    // Ensure we have an assessment ID before saving
    let currentAssessmentId = assessmentId;
    if (!currentAssessmentId) {
      currentAssessmentId = await startNewAssessment();
    }

    // Save to database if we have an assessment ID
    if (currentAssessmentId) {
      await saveAnswerToDatabase(answer);
    } else {
      toast({
        title: "Error",
        description: "Failed to create assessment. Please refresh the page and try again.",
        variant: "destructive"
      });
    }
  };

  const saveAnswerToDatabase = async (answer: Answer) => {
    try {
      console.log('Saving answer:', answer);
      
      let questionData = null;
      let chapterId = '';

      // Find the question and its chapter
      for (const chapter of iso9001Chapters) {
        const question = chapter.questions.find(q => q.id === answer.questionId);
        if (question) {
          questionData = question;
          chapterId = chapter.id;
          break;
        }
      }
      
      if (!questionData) {
        console.error('Question not found for answer:', answer);
        return;
      }

      console.log('Found question data:', questionData, 'Chapter:', chapterId);

      const score = getScoreForAnswer(answer.value, questionData.weight);
      const maxScore = getMaxScoreForAnswer(answer.value, questionData.weight);

      console.log('Calculated scores - score:', score, 'maxScore:', maxScore);

      const { error } = await supabase
        .from('assessment_answers')
        .upsert({
          assessment_id: assessmentId,
          question_id: answer.questionId,
          chapter_id: chapterId,
          answer_value: answer.value,
          score,
          max_score: maxScore,
          question_weight: questionData.weight
        }, {
          onConflict: 'assessment_id,question_id'
        });

      if (error) {
        console.error('Database error saving answer:', error);
        toast({
          title: "Error",
          description: `Failed to save answer: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Answer saved successfully');
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    }
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
    
    try {
      // Calculate overall progress
      const allResults = getAllResults();
      const calculatedOverallProgress = allResults.length > 0 
        ? Math.round(allResults.reduce((sum, result) => sum + result.percentage, 0) / allResults.length)
        : 0;

      // Create or update assessment record
      let currentAssessmentId = assessmentId;
      
      if (!currentAssessmentId) {
        console.log('Creating new assessment...');
        const { data, error } = await supabase
          .from('assessments')
          .insert({
            email,
            first_name: firstName,
            company,
            overall_progress: calculatedOverallProgress,
            status: 'completed'
          })
          .select()
          .single();

        if (error) throw error;
        currentAssessmentId = data.id;
        setAssessmentId(currentAssessmentId);
        console.log('Assessment created:', currentAssessmentId);
      } else {
        console.log('Updating existing assessment:', currentAssessmentId);
        // Update existing assessment
        const { error } = await supabase
          .from('assessments')
          .update({
            email,
            first_name: firstName,
            company,
            overall_progress: calculatedOverallProgress,
            status: 'completed'
          })
          .eq('id', currentAssessmentId);

        if (error) throw error;
        console.log('Assessment updated successfully');
      }

      // Store user info
      setUserInfo({ email, firstName, company });
      
      // Save all answers to database
      console.log('Saving answers to database...');
      const answerValues = Object.values(answers);
      console.log('Number of answers to save:', answerValues.length);
      
      for (const answer of answerValues) {
        await saveAnswerToDatabase(answer);
      }
      console.log('All answers saved successfully');
      
      // Generate and email the report
      console.log('Generating and emailing report...');
      await handleDownloadAndEmailPDF(email, firstName || 'User');
      
      setViewMode('results');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: `Failed to save your assessment: ${error.message || 'Unknown error'}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleDownloadAndEmailPDF = async (clientEmail: string, clientName: string) => {
    try {
      setIsLoading(true);
      
      const allResults = getAllResults();
      const overallScore = allResults.reduce((sum, result) => sum + result.score, 0);
      const overallMaxScore = allResults.reduce((sum, result) => sum + result.maxScore, 0);
      const overallPercentage = overallMaxScore > 0 ? Math.round((overallScore / overallMaxScore) * 100) : 0;

      // Prepare data for PDF generation
      const assessmentData = {
        userInfo: { ...userInfo, email: clientEmail, firstName: clientName },
        results: allResults.map(result => {
          const chapter = iso9001Chapters.find(c => c.id === result.chapterId);
          return {
            ...result,
            chapterTitle: chapter?.title || `Chapter ${result.chapterId}`
          };
        }),
        overallScore,
        overallPercentage
      };

      console.log('Generating report and sending email...');

      // Generate the HTML report
      const reportResponse = await supabase.functions.invoke('generate-pdf-report', {
        body: assessmentData
      });

      console.log('Report response:', reportResponse);

      if (reportResponse.error) {
        console.error('Report generation error:', reportResponse.error);
        throw new Error(`Report generation failed: ${reportResponse.error.message}`);
      }

      if (!reportResponse.data?.reportHtml) {
        console.error('No report HTML in response:', reportResponse.data);
        throw new Error('No report content generated');
      }

      // Send email with the report
      const emailResponse = await supabase.functions.invoke('send-pdf-email', {
        body: {
          clientEmail,
          clientName,
          copyEmail: 'support@qse-academy.com',
          reportHtml: reportResponse.data.reportHtml,
          overallScore: overallPercentage
        }
      });

      console.log('Email response:', emailResponse);

      if (emailResponse.error) {
        throw new Error(emailResponse.error.message);
      }

      // Also provide download option
      if (reportResponse.data?.reportHtml) {
        const blob = new Blob([reportResponse.data.reportHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ISO9001-Assessment-Report-${clientName}-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Report Sent!",
        description: `Your ISO 9001 assessment report has been emailed to ${clientEmail} with a copy sent to your email.`,
      });

    } catch (error) {
      console.error('Error generating and sending report:', error);
      toast({
        title: "Send Failed",
        description: "There was an error generating and sending your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!userInfo) {
      toast({
        title: "Error",
        description: "User information is required to generate the PDF report.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const allResults = getAllResults();
      const overallScore = allResults.reduce((sum, result) => sum + result.score, 0);
      const overallMaxScore = allResults.reduce((sum, result) => sum + result.maxScore, 0);
      const overallPercentage = overallMaxScore > 0 ? Math.round((overallScore / overallMaxScore) * 100) : 0;

      // Prepare data for PDF generation
      const assessmentData = {
        userInfo,
        results: allResults.map(result => {
          const chapter = iso9001Chapters.find(c => c.id === result.chapterId);
          return {
            ...result,
            chapterTitle: chapter?.title || `Chapter ${result.chapterId}`
          };
        }),
        overallScore,
        overallPercentage
      };

      const response = await supabase.functions.invoke('generate-pdf-report', {
        body: assessmentData
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // For HTML response (Option 1)
      if (response.data) {
        const blob = new Blob([response.data], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ISO9001-Assessment-Report-${userInfo.firstName || 'User'}-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Report Downloaded!",
          description: "Your ISO 9001 assessment report has been downloaded. You can print it as PDF from your browser.",
        });
      }

      // For future PDF response (Option 2)
      /*
      if (response.data) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ISO9001-Assessment-Report-${userInfo.firstName || 'User'}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "PDF Downloaded!",
          description: "Your detailed ISO 9001 assessment report has been downloaded.",
        });
      }
      */

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookConsult = () => {
    window.open("https://www.qse-academy.com/live-iso-consultation/", "_blank");
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

    </div>
  );
};