import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AssessmentData {
  userInfo: {
    email: string;
    firstName?: string;
    company?: string;
  };
  results: Array<{
    chapterId: string;
    chapterTitle: string;
    score: number;
    maxScore: number;
    percentage: number;
    completedQuestions: number;
    totalQuestions: number;
  }>;
  overallScore: number;
  overallPercentage: number;
}

const generateHTMLReport = (data: AssessmentData): string => {
  const { userInfo, results, overallScore, overallPercentage } = data;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getReadinessLevel = (percentage: number): { level: string; color: string; description: string } => {
    if (percentage >= 80) return { 
      level: "High Readiness", 
      color: "#22c55e", 
      description: "Your organization demonstrates excellent ISO 9001 readiness with strong QMS foundations." 
    };
    if (percentage >= 60) return { 
      level: "Moderate Readiness", 
      color: "#f59e0b", 
      description: "Your organization shows good progress but requires focused improvements in key areas." 
    };
    if (percentage >= 40) return { 
      level: "Developing Readiness", 
      color: "#f97316", 
      description: "Your organization has basic foundations but needs significant development to meet ISO 9001 requirements." 
    };
    return { 
      level: "Early Stage", 
      color: "#ef4444", 
      description: "Your organization requires comprehensive QMS development to achieve ISO 9001 compliance." 
    };
  };

  const readiness = getReadinessLevel(overallPercentage);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ISO 9001 Readiness Assessment Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Arial', sans-serif; 
          line-height: 1.6; 
          color: #333;
          background: #fff;
        }
        .container { max-width: 800px; margin: 0 auto; padding: 40px 60px; }
        .header { 
          text-align: center; 
          margin-bottom: 40px; 
          border-bottom: 3px solid #2563eb;
          padding-bottom: 30px;
        }
        .logo { 
          font-size: 24px; 
          font-weight: bold; 
          color: #2563eb; 
          margin-bottom: 10px; 
        }
        .title { 
          font-size: 28px; 
          font-weight: bold; 
          color: #1e40af;
          margin-bottom: 8px; 
        }
        .subtitle { 
          font-size: 16px; 
          color: #64748b; 
        }
        .user-info { 
          background: #f8fafc; 
          padding: 25px; 
          border-radius: 8px; 
          margin-bottom: 30px;
          border-left: 4px solid #2563eb;
        }
        .user-info h3 { 
          font-size: 18px; 
          margin-bottom: 15px; 
          color: #1e40af; 
        }
        .user-info p { 
          margin-bottom: 8px; 
          font-size: 14px; 
        }
        .overall-score { 
          text-align: center; 
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
          padding: 30px; 
          border-radius: 12px; 
          margin-bottom: 40px;
          border: 2px solid #e2e8f0;
        }
        .score-circle { 
          width: 120px; 
          height: 120px; 
          border-radius: 50%; 
          margin: 0 auto 20px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 32px; 
          font-weight: bold; 
          color: white;
          background: ${readiness.color};
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .readiness-level { 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 10px;
          color: ${readiness.color};
        }
        .readiness-description { 
          font-size: 16px; 
          color: #64748b; 
          max-width: 600px;
          margin: 0 auto;
        }
        .results-section { 
          margin-bottom: 40px; 
        }
        .section-title { 
          font-size: 20px; 
          font-weight: bold; 
          margin-bottom: 20px; 
          color: #1e40af;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 10px;
        }
        .chapter-card { 
          background: #fff; 
          border: 1px solid #e2e8f0; 
          border-radius: 8px; 
          padding: 20px; 
          margin-bottom: 15px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .chapter-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 15px; 
        }
        .chapter-title { 
          font-size: 16px; 
          font-weight: bold; 
          color: #1e40af; 
        }
        .chapter-score { 
          font-size: 18px; 
          font-weight: bold; 
        }
        .progress-bar { 
          width: 100%; 
          height: 8px; 
          background: #e2e8f0; 
          border-radius: 4px; 
          overflow: hidden; 
        }
        .progress-fill { 
          height: 100%; 
          border-radius: 4px; 
          transition: width 0.3s ease; 
        }
        .chapter-details { 
          margin-top: 10px; 
          font-size: 14px; 
          color: #64748b; 
        }
        .recommendations { 
          background: #fef3c7; 
          border: 1px solid #f59e0b; 
          border-radius: 8px; 
          padding: 20px; 
          margin-bottom: 30px; 
        }
        .recommendations h3 { 
          color: #92400e; 
          margin-bottom: 15px; 
        }
        .recommendations ul { 
          margin-left: 20px; 
        }
        .recommendations li { 
          margin-bottom: 8px; 
          color: #92400e; 
        }
        .footer { 
          text-align: center; 
          border-top: 2px solid #e2e8f0; 
          padding-top: 20px; 
          margin-top: 40px; 
          color: #64748b; 
          font-size: 12px; 
        }
        .date { 
          text-align: right; 
          font-size: 14px; 
          color: #64748b; 
          margin-bottom: 30px; 
        }
        @media print {
          .container { padding: 30px; }
          .chapter-card { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">QSE ACADEMY</div>
          <div class="title">ISO 9001 Readiness Assessment Report</div>
          <div class="subtitle">Quality Management System Evaluation</div>
        </div>

        <div class="date">Report Generated: ${currentDate}</div>

        <div class="user-info">
          <h3>Assessment Details</h3>
          <p><strong>Name:</strong> ${userInfo.firstName || 'Not provided'}</p>
          <p><strong>Email:</strong> ${userInfo.email}</p>
          <p><strong>Company:</strong> ${userInfo.company || 'Not provided'}</p>
        </div>

        <div class="overall-score">
          <div class="score-circle">${Math.round(overallPercentage)}%</div>
          <div class="readiness-level">${readiness.level}</div>
          <div class="readiness-description">${readiness.description}</div>
        </div>

        <div class="results-section">
          <div class="section-title">Chapter Assessment Results</div>
          ${results.map(result => {
            const percentage = result.percentage;
            let barColor = '#ef4444';
            if (percentage >= 80) barColor = '#22c55e';
            else if (percentage >= 60) barColor = '#f59e0b';
            else if (percentage >= 40) barColor = '#f97316';

            return `
              <div class="chapter-card">
                <div class="chapter-header">
                  <div class="chapter-title">Chapter ${result.chapterId}: ${result.chapterTitle}</div>
                  <div class="chapter-score" style="color: ${barColor}">${percentage}%</div>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${percentage}%; background-color: ${barColor};"></div>
                </div>
                <div class="chapter-details">
                  Score: ${result.score}/${result.maxScore} points • 
                  Completed: ${result.completedQuestions}/${result.totalQuestions} questions
                </div>
              </div>
            `;
          }).join('')}
        </div>

        ${overallPercentage < 80 ? `
        <div class="recommendations">
          <h3>Key Recommendations</h3>
          <ul>
            ${overallPercentage < 40 ? `
              <li>Establish formal quality management documentation and procedures</li>
              <li>Implement systematic approach to identifying and managing risks</li>
              <li>Develop clear roles and responsibilities within your organization</li>
              <li>Create customer satisfaction monitoring processes</li>
            ` : overallPercentage < 60 ? `
              <li>Enhance documentation control and record management systems</li>
              <li>Strengthen internal audit processes and management reviews</li>
              <li>Improve corrective and preventive action procedures</li>
              <li>Focus on continuous improvement initiatives</li>
            ` : `
              <li>Fine-tune existing processes for optimal efficiency</li>
              <li>Enhance management review effectiveness</li>
              <li>Strengthen continual improvement culture</li>
              <li>Prepare for certification audit readiness</li>
            `}
            <li>Consider professional ISO 9001 consultation for targeted guidance</li>
          </ul>
        </div>
        ` : ''}

        <div class="footer">
          <p>This report is generated by QSE Academy's ISO 9001 Readiness Assessment Tool.</p>
          <p>For professional consultation and certification guidance, contact us at support@qse-academy.com</p>
          <p>© ${new Date().getFullYear()} QSE Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const assessmentData: AssessmentData = await req.json();

    // Generate HTML report
    const htmlContent = generateHTMLReport(assessmentData);

    // For now, we'll return the HTML content
    // In a production environment, you would use Puppeteer to convert to PDF
    // But Puppeteer requires additional setup in Deno Deploy
    
    // Option 1: Return HTML that can be printed as PDF by the browser
    return new Response(htmlContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
        'Content-Disposition': 'inline; filename="iso9001-assessment-report.html"'
      },
    });

    // Option 2: For actual PDF generation, you would need:
    /*
    const puppeteer = await import('https://deno.land/x/puppeteer@16.2.0/mod.ts');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
    });
    
    await browser.close();

    return new Response(pdf, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="iso9001-assessment-report.pdf"'
      },
    });
    */

  } catch (error) {
    console.error('Error generating PDF report:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF report' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});