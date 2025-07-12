import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Question, AnswerValue, Answer } from "@/data/iso9001Data";
import { CheckCircle, XCircle, AlertCircle, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  answer?: Answer;
  onAnswerChange: (answer: Answer) => void;
  questionNumber: number;
}

export const QuestionCard = ({
  question,
  answer,
  onAnswerChange,
  questionNumber
}: QuestionCardProps) => {
  const [notes, setNotes] = useState(answer?.notes || "");
  const [showNotes, setShowNotes] = useState(false);

  const handleAnswerSelect = (value: AnswerValue) => {
    const newAnswer: Answer = {
      questionId: question.id,
      value,
      notes: notes
    };
    onAnswerChange(newAnswer);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    if (answer) {
      onAnswerChange({
        ...answer,
        notes: newNotes
      });
    }
  };

  const getAnswerIcon = (value: AnswerValue) => {
    switch (value) {
      case 'yes':
        return <CheckCircle className="w-4 h-4" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4" />;
      case 'no':
        return <XCircle className="w-4 h-4" />;
      case 'na':
        return <Minus className="w-4 h-4" />;
    }
  };

  const getAnswerVariant = (value: AnswerValue) => {
    switch (value) {
      case 'yes':
        return 'default';
      case 'partial':
        return 'secondary';
      case 'no':
        return 'destructive';
      case 'na':
        return 'outline';
    }
  };

  const getAnswerLabel = (value: AnswerValue) => {
    switch (value) {
      case 'yes':
        return 'Yes';
      case 'partial':
        return 'Partial';
      case 'no':
        return 'No';
      case 'na':
        return 'N/A';
    }
  };

  return (
    <Card className="w-full shadow-sm border-l-4 border-l-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold leading-relaxed">
              <span className="text-muted-foreground text-sm font-bold">
                {questionNumber}.{" "}
              </span>
              {question.text}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Weight: {question.weight}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {question.id}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(['yes', 'partial', 'no', 'na'] as AnswerValue[]).map((value) => (
            <Button
              key={value}
              variant={answer?.value === value ? getAnswerVariant(value) : 'outline'}
              size="sm"
              onClick={() => handleAnswerSelect(value)}
              className={cn(
                "flex items-center gap-2 h-10 transition-all",
                answer?.value === value && "ring-2 ring-ring"
              )}
            >
              {getAnswerIcon(value)}
              {getAnswerLabel(value)}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotes(!showNotes)}
            className="text-xs"
          >
            {showNotes ? 'Hide Notes' : 'Add Notes'}
          </Button>
        </div>

        {showNotes && (
          <div className="space-y-2">
            <Textarea
              placeholder="Add notes, observations, or action items..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="min-h-[80px] text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};