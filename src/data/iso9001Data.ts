export interface Question {
  id: string;
  text: string;
  weight: number; // Weight for scoring (1-5, where 5 is most critical)
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const iso9001Chapters: Chapter[] = [
  {
    id: "4",
    title: "Context of the Organization",
    description: "Understanding the organization and its context, stakeholders, and QMS scope",
    questions: [
      {
        id: "4.1.1",
        text: "Has the organization determined external and internal issues that are relevant to its purpose and strategic direction?",
        weight: 5
      },
      {
        id: "4.1.2", 
        text: "Are these issues monitored and reviewed regularly?",
        weight: 4
      },
      {
        id: "4.2.1",
        text: "Have all relevant interested parties been identified?",
        weight: 5
      },
      {
        id: "4.2.2",
        text: "Are the requirements of these interested parties determined and monitored?",
        weight: 4
      },
      {
        id: "4.3.1",
        text: "Is the scope of the QMS clearly defined and documented?",
        weight: 5
      },
      {
        id: "4.3.2",
        text: "Does the scope consider external and internal issues, interested parties, and products/services?",
        weight: 4
      },
      {
        id: "4.4.1",
        text: "Has the organization established, implemented, and maintained a QMS?",
        weight: 5
      },
      {
        id: "4.4.2",
        text: "Are QMS processes and their interactions clearly defined?",
        weight: 4
      }
    ]
  },
  {
    id: "5",
    title: "Leadership",
    description: "Leadership commitment, quality policy, and organizational roles and responsibilities",
    questions: [
      {
        id: "5.1.1",
        text: "Does top management demonstrate leadership and commitment to the QMS?",
        weight: 5
      },
      {
        id: "5.1.2",
        text: "Is top management taking accountability for QMS effectiveness?",
        weight: 5
      },
      {
        id: "5.2.1",
        text: "Has top management established, implemented and maintained a quality policy?",
        weight: 5
      },
      {
        id: "5.2.2",
        text: "Is the quality policy appropriate to the organization and its context?",
        weight: 4
      },
      {
        id: "5.3.1",
        text: "Are organizational roles, responsibilities and authorities assigned and communicated?",
        weight: 4
      },
      {
        id: "5.3.2",
        text: "Has management appointed a management representative for the QMS?",
        weight: 3
      }
    ]
  },
  {
    id: "6",
    title: "Planning",
    description: "Risk management, quality objectives, and planning for changes",
    questions: [
      {
        id: "6.1.1",
        text: "Has the organization determined risks and opportunities that need to be addressed?",
        weight: 5
      },
      {
        id: "6.1.2",
        text: "Are actions planned to address these risks and opportunities?",
        weight: 5
      },
      {
        id: "6.2.1",
        text: "Are quality objectives established at relevant functions and levels?",
        weight: 4
      },
      {
        id: "6.2.2",
        text: "Are quality objectives measurable, monitored, and communicated?",
        weight: 4
      },
      {
        id: "6.3.1",
        text: "Is there a systematic approach for planning changes to the QMS?",
        weight: 4
      }
    ]
  },
  {
    id: "7",
    title: "Support",
    description: "Resources, competence, awareness, communication, and documented information",
    questions: [
      {
        id: "7.1.1",
        text: "Has the organization determined and provided necessary resources for the QMS?",
        weight: 4
      },
      {
        id: "7.1.2",
        text: "Are infrastructure and environment suitable for process operations?",
        weight: 4
      },
      {
        id: "7.2.1",
        text: "Are competency requirements determined for persons affecting QMS performance?",
        weight: 4
      },
      {
        id: "7.2.2",
        text: "Is training provided where necessary to achieve required competence?",
        weight: 4
      },
      {
        id: "7.3.1",
        text: "Are persons aware of the quality policy and their contribution to QMS effectiveness?",
        weight: 3
      },
      {
        id: "7.4.1",
        text: "Are internal and external communications regarding the QMS determined?",
        weight: 3
      },
      {
        id: "7.5.1",
        text: "Is documented information required by the QMS maintained?",
        weight: 5
      },
      {
        id: "7.5.2",
        text: "Are documented information controls ensuring availability and protection?",
        weight: 4
      }
    ]
  },
  {
    id: "8",
    title: "Operation",
    description: "Operational planning, product/service requirements, design, production, and control",
    questions: [
      {
        id: "8.1.1",
        text: "Are processes needed to meet product and service requirements planned and controlled?",
        weight: 5
      },
      {
        id: "8.2.1",
        text: "Are customer requirements and applicable legal requirements determined?",
        weight: 5
      },
      {
        id: "8.2.2",
        text: "Is there a process for reviewing requirements before committing to supply?",
        weight: 4
      },
      {
        id: "8.3.1",
        text: "Is there a design and development process (if applicable)?",
        weight: 4
      },
      {
        id: "8.4.1",
        text: "Are externally provided processes, products and services controlled?",
        weight: 4
      },
      {
        id: "8.5.1",
        text: "Is production and service provision controlled?",
        weight: 5
      },
      {
        id: "8.6.1",
        text: "Are products and services verified against requirements?",
        weight: 5
      },
      {
        id: "8.7.1",
        text: "Is nonconforming output controlled and addressed?",
        weight: 5
      }
    ]
  },
  {
    id: "9",
    title: "Performance Evaluation",
    description: "Monitoring, measurement, analysis, internal audit, and management review",
    questions: [
      {
        id: "9.1.1",
        text: "Is QMS performance and effectiveness monitored and measured?",
        weight: 5
      },
      {
        id: "9.1.2",
        text: "Are customer satisfaction levels monitored?",
        weight: 5
      },
      {
        id: "9.1.3",
        text: "Is data analyzed to evaluate QMS performance and improvement opportunities?",
        weight: 4
      },
      {
        id: "9.2.1",
        text: "Are internal audits conducted at planned intervals?",
        weight: 5
      },
      {
        id: "9.2.2",
        text: "Do internal audits provide information on QMS conformity and effectiveness?",
        weight: 4
      },
      {
        id: "9.3.1",
        text: "Does top management review the QMS at planned intervals?",
        weight: 5
      },
      {
        id: "9.3.2",
        text: "Do management reviews consider all required inputs and produce defined outputs?",
        weight: 4
      }
    ]
  },
  {
    id: "10",
    title: "Improvement",
    description: "Continual improvement, nonconformity, and corrective action",
    questions: [
      {
        id: "10.1.1",
        text: "Are opportunities for improvement identified and selected?",
        weight: 4
      },
      {
        id: "10.2.1",
        text: "Are nonconformities identified and corrected?",
        weight: 5
      },
      {
        id: "10.2.2",
        text: "Are corrective actions taken to eliminate causes of nonconformities?",
        weight: 5
      },
      {
        id: "10.3.1",
        text: "Does the organization continually improve the QMS suitability and effectiveness?",
        weight: 4
      }
    ]
  }
];

export type AnswerValue = 'yes' | 'partial' | 'no' | 'na';

export interface Answer {
  questionId: string;
  value: AnswerValue;
  notes?: string;
}

export interface AssessmentResult {
  chapterId: string;
  score: number;
  maxScore: number;
  percentage: number;
  completedQuestions: number;
  totalQuestions: number;
}

export const getScoreForAnswer = (value: AnswerValue, weight: number): number => {
  switch (value) {
    case 'yes': return weight;
    case 'partial': return Math.round(weight * 0.5);
    case 'no': return 0;
    case 'na': return weight; // N/A questions are not counted against the score
    default: return 0;
  }
};

export const getMaxScoreForAnswer = (value: AnswerValue, weight: number): number => {
  return value === 'na' ? 0 : weight;
};

export const getReadinessLevel = (percentage: number): {
  level: string;
  color: string;
  description: string;
} => {
  if (percentage >= 90) {
    return {
      level: "Audit Ready",
      color: "success",
      description: "Your organization demonstrates excellent ISO 9001 compliance and is ready for certification audit."
    };
  } else if (percentage >= 75) {
    return {
      level: "Nearly Ready", 
      color: "primary",
      description: "Good compliance level. Address remaining gaps before scheduling your audit."
    };
  } else if (percentage >= 60) {
    return {
      level: "Moderate Readiness",
      color: "warning", 
      description: "Several areas need improvement. Focus on critical gaps before considering audit."
    };
  } else {
    return {
      level: "Not Ready",
      color: "destructive",
      description: "Significant work required. Consider engaging a consultant to address major compliance gaps."
    };
  }
};