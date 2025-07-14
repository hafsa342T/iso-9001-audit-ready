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
  reportId?: string;
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

function generateHTMLReport(data: AssessmentData): string {
  const { userInfo, reportId, results, overallScore, overallPercentage } = data;
  
  // Debug logging
  console.log('Generating HTML report with data:', {
    userInfo,
    reportId,
    hasResults: !!results,
    overallPercentage
  });
  
  const readinessLevel = getReadinessLevel(overallPercentage || 0);
  
  // Generate chart data for radar chart
  const chartData = results.map(result => ({
    category: result.chapterTitle || `Chapter ${result.chapterId}`,
    score: result.percentage || 0
  }));

  // Generate SVG for radar chart
  const generateRadarChart = () => {
    const size = 300;
    const center = size / 2;
    const radius = 100;
    const categories = chartData.length;
    
    let svgPath = '';
    let points = '';
    let gridLines = '';
    let labels = '';
    
    // Generate grid circles
    for (let i = 1; i <= 5; i++) {
      const r = (radius * i) / 5;
      gridLines += `<circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="#e5e7eb" stroke-width="1"/>`;
    }
    
    // Generate category lines and labels
    chartData.forEach((item, index) => {
      const angle = (index * 2 * Math.PI) / categories - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      
      gridLines += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="#e5e7eb" stroke-width="1"/>`;
      
      // Position labels outside the circle
      const labelX = center + (radius + 25) * Math.cos(angle);
      const labelY = center + (radius + 25) * Math.sin(angle);
      const labelText = item.category.length > 15 ? item.category.substring(0, 15) + '...' : item.category;
      labels += `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="#374151">${labelText}</text>`;
      
      // Data points
      const dataRadius = (radius * item.score) / 100;
      const dataX = center + dataRadius * Math.cos(angle);
      const dataY = center + dataRadius * Math.sin(angle);
      
      if (index === 0) {
        points += `M ${dataX} ${dataY}`;
      } else {
        points += ` L ${dataX} ${dataY}`;
      }
    });
    
    points += ' Z'; // Close the path
    
    return `
      <svg width="${size}" height="${size + 40}" viewBox="0 0 ${size} ${size + 40}">
        ${gridLines}
        <path d="${points}" fill="rgba(37, 99, 235, 0.2)" stroke="#2563eb" stroke-width="2"/>
        ${labels}
      </svg>
    `;
  };

  // Generate bar chart for scores
  const generateBarChart = () => {
    const maxBarWidth = 160;
    const barHeight = 16;
    const spacing = 28;
    const chartHeight = results.length * spacing + 30;
    const leftMargin = 100;
    
    let bars = '';
    results.forEach((result, index) => {
      const y = index * spacing + 15;
      const barWidth = (result.percentage / 100) * maxBarWidth;
      const color = result.percentage >= 80 ? '#22c55e' : result.percentage >= 60 ? '#f59e0b' : '#ef4444';
      
      // Shorten chapter names for better display
      const chapterName = result.chapterTitle || `Ch. ${result.chapterId}`;
      const shortName = chapterName.length > 20 ? chapterName.substring(0, 18) + '...' : chapterName;
      
      bars += `
        <rect x="${leftMargin}" y="${y}" width="${maxBarWidth}" height="${barHeight}" fill="#e5e7eb" rx="2"/>
        <rect x="${leftMargin}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="2"/>
        <text x="${leftMargin - 5}" y="${y + 12}" text-anchor="end" font-size="9" fill="#374151">${shortName}</text>
        <text x="${leftMargin + maxBarWidth + 5}" y="${y + 12}" font-size="9" fill="#374151" font-weight="bold">${result.percentage}%</text>
      `;
    });
    
    return `
      <svg width="320" height="${chartHeight}" viewBox="0 0 320 ${chartHeight}" style="margin: 0 auto; display: block;">
        ${bars}
      </svg>
    `;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ISO 9001 Assessment Report${userInfo?.company ? ` - ${userInfo.company}` : ''}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #1f2937;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: white;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                padding: 30px;
                background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                color: white;
                border-radius: 12px;
                position: relative;
            }
            
            .logo {
                width: 200px;
                height: auto;
                margin-bottom: 20px;
                background: white;
                padding: 10px;
                border-radius: 8px;
            }
            
            .header h1 {
                margin: 0;
                font-size: 2.5rem;
                font-weight: 700;
            }
            
            .header p {
                margin: 10px 0 0 0;
                font-size: 1.2rem;
                opacity: 0.9;
            }
            
            .summary-section {
                background: #f8fafc;
                padding: 30px;
                border-radius: 12px;
                margin-bottom: 30px;
                border-left: 5px solid #2563eb;
            }
            
            .readiness-gauge {
                text-align: center;
                margin: 30px 0;
                padding: 40px;
                background: #f8fafc;
                border-radius: 12px;
                border-left: 5px solid ${readinessLevel.color};
            }
            
            .score-display {
                font-size: 4rem;
                font-weight: bold;
                color: ${readinessLevel.color};
                margin-bottom: 15px;
            }
            
            .readiness-level {
                font-size: 1.8rem;
                font-weight: 600;
                color: ${readinessLevel.color};
                margin-bottom: 15px;
            }
            
            .readiness-description {
                color: #6b7280;
                font-size: 1.1rem;
                margin-bottom: 0;
            }
            
            .readiness-level {
                font-size: 1.5rem;
                font-weight: 600;
                color: ${readinessLevel.color};
                margin-bottom: 10px;
            }
            
            .readiness-description {
                color: #6b7280;
                font-size: 1.1rem;
            }
            
            .charts-section {
                margin: 40px 0;
                text-align: center;
            }
            
            .chart-container {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                margin-bottom: 30px;
            }
            
            .chart-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                margin: 30px 0;
            }
            
            .results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            
            .result-card {
                background: white;
                padding: 25px;
                border-radius: 12px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                border-left: 4px solid #2563eb;
            }
            
            .result-title {
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 15px;
                color: #1f2937;
            }
            
            .progress-bar {
                width: 100%;
                height: 12px;
                background: #e5e7eb;
                border-radius: 6px;
                overflow: hidden;
                margin: 10px 0;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #059669);
                border-radius: 6px;
                transition: width 0.3s ease;
            }
            
            .score-text {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                font-size: 0.9rem;
                color: #6b7280;
            }
            
            .recommendations {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 12px;
                padding: 30px;
                margin: 30px 0;
            }
            
            .recommendations h3 {
                color: #92400e;
                margin-top: 0;
            }
            
            .recommendations ul {
                color: #92400e;
            }
            
            .footer {
                text-align: center;
                margin-top: 50px;
                padding: 30px;
                background: #f8fafc;
                border-radius: 12px;
                color: #6b7280;
            }
            
            .contact-info {
                background: #2563eb;
                color: white;
                padding: 25px;
                border-radius: 12px;
                margin: 30px 0;
                text-align: center;
            }
            
            .contact-info h3 {
                margin-top: 0;
                color: white;
            }
            
            .contact-info a {
                color: #bfdbfe;
                text-decoration: none;
            }
            
            @media print {
                body { margin: 0; padding: 15px; }
                .header { break-inside: avoid; }
                .result-card { break-inside: avoid; }
                .chart-container { break-inside: avoid; }
                .chart-grid { grid-template-columns: 1fr; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div style="width: 200px; height: 80px; margin: 0 auto 20px; background: white; padding: 15px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 24px; color: #2563eb;">
                QSE ACADEMY
            </div>
            <h1>ISO 9001 Assessment Report</h1>
            ${userInfo?.company ? `<p style="font-size: 1.3rem; font-weight: 600; margin: 10px 0; color: #374151;">for ${userInfo.company}</p>` : ''}
            <p>Comprehensive Readiness Analysis</p>
        </div>

        <div class="summary-section">
            <h2>Assessment Summary</h2>
            <p><strong>Participant:</strong> ${userInfo?.firstName || 'Anonymous'}</p>
            <p><strong>Company:</strong> ${userInfo?.company || 'No company provided'}</p>
            <p><strong>Email:</strong> ${userInfo?.email || 'Not provided'}</p>
            ${reportId ? `<p><strong>Report ID:</strong> <code style="background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-family: monospace;">${reportId}</code></p>` : ''}
            <p><strong>Completed:</strong> ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</p>
            <p><strong>Assessment Type:</strong> ISO 9001:2015 Readiness Assessment</p>
        </div>

        <div class="readiness-gauge">
            <h2>Overall Readiness Score</h2>
            <div class="score-display">${overallPercentage || 0}%</div>
            <div class="readiness-level">${readinessLevel.level}</div>
            <div class="readiness-description">${readinessLevel.description}</div>
        </div>

        <div class="charts-section">
            <h2>Performance Analysis</h2>
            <div class="chart-grid">
                <div class="chart-container">
                    <h3>Readiness Radar Chart</h3>
                    ${generateRadarChart()}
                    <p style="margin-top: 15px; color: #6b7280; font-size: 0.9rem;">
                        Visual representation of readiness across all categories
                    </p>
                </div>
                <div class="chart-container">
                    <h3>Chapter Scores</h3>
                    ${generateBarChart()}
                    <p style="margin-top: 15px; color: #6b7280; font-size: 0.9rem;">
                        Individual chapter performance breakdown
                    </p>
                </div>
            </div>
        </div>

        <div class="results-grid">
            ${results.map(result => {
                const chapter = result.chapterTitle || `Chapter ${result.chapterId}`;
                const percentage = result.percentage || 0;
                const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';
                
                return `
                    <div class="result-card">
                        <div class="result-title">${chapter}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%; background: ${color};"></div>
                        </div>
                        <div class="score-text">
                            <span>Score: ${result.score}/${result.maxScore}</span>
                            <span>${result.completedQuestions}/${result.totalQuestions} questions</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>

        <div class="recommendations">
            <h3>📋 Recommendations for Improvement</h3>
            <ul>
                ${results
                    .filter(result => (result.percentage || 0) < 80)
                    .slice(0, 5)
                    .map(result => `<li>Focus on improving <strong>${result.chapterTitle || `Chapter ${result.chapterId}`}</strong> - Current score: ${result.percentage || 0}%</li>`)
                    .join('')}
                ${results.every(result => (result.percentage || 0) >= 80) 
                    ? '<li>Excellent work! Your organization shows strong ISO 9001 readiness across all areas. Consider scheduling a formal assessment.</li>' 
                    : ''}
            </ul>
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Review detailed requirements for areas scoring below 80%</li>
                <li>Develop implementation plans for missing processes</li>
                <li>Consider professional ISO 9001 consultation</li>
                <li>Schedule regular progress reviews</li>
            </ul>
        </div>

        <div class="contact-info">
            <h3>Need Expert Guidance?</h3>
            <p>Our ISO 9001 specialists are ready to help you achieve certification.</p>
            <p>📧 <a href="mailto:support@qse-academy.com">support@qse-academy.com</a></p>
            <p>🌐 <a href="https://qse-academy.com">www.qse-academy.com</a></p>
        </div>

        <div class="footer">
            <p>This report was generated by QSE Academy's ISO 9001 Assessment Tool.</p>
            <p>© ${new Date().getFullYear()} QSE Academy. All rights reserved.</p>
            <p><em>This assessment provides an indication of ISO 9001 readiness and should be supplemented with professional consultation.</em></p>
        </div>
    </body>
    </html>
  `;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const assessmentData: AssessmentData = await req.json();
    console.log('=== COMPANY NAME DEBUG ===');
    console.log('userInfo:', assessmentData.userInfo);
    console.log('company field:', assessmentData.userInfo?.company);
    console.log('company type:', typeof assessmentData.userInfo?.company);
    console.log('company length:', assessmentData.userInfo?.company?.length);
    console.log('=========================');

    // Generate HTML report with charts and logo
    const htmlContent = generateHTMLReport(assessmentData);
    
    console.log('Report generated successfully, length:', htmlContent.length);
    
    return new Response(JSON.stringify({
      success: true,
      reportHtml: htmlContent,
      message: "Report generated successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to generate report' 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});