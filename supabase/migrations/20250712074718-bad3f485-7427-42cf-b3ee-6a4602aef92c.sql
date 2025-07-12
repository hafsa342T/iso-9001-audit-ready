-- Create assessments table to store user sessions and contact info
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  company TEXT,
  overall_progress DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessment_answers table to store individual question responses
CREATE TABLE public.assessment_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  answer_value TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 0,
  question_weight INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(assessment_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for assessments table (public access for this assessment tool)
CREATE POLICY "Anyone can create assessments" 
ON public.assessments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view assessments" 
ON public.assessments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update assessments" 
ON public.assessments 
FOR UPDATE 
USING (true);

-- Create policies for assessment_answers table
CREATE POLICY "Anyone can create assessment answers" 
ON public.assessment_answers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view assessment answers" 
ON public.assessment_answers 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update assessment answers" 
ON public.assessment_answers 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_answers_updated_at
  BEFORE UPDATE ON public.assessment_answers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_assessments_email ON public.assessments(email);
CREATE INDEX idx_assessments_created_at ON public.assessments(created_at);
CREATE INDEX idx_assessment_answers_assessment_id ON public.assessment_answers(assessment_id);
CREATE INDEX idx_assessment_answers_question_id ON public.assessment_answers(question_id);
CREATE INDEX idx_assessment_answers_chapter_id ON public.assessment_answers(chapter_id);