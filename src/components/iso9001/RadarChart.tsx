import React from "react";
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { AssessmentResult } from "@/data/iso9001Data";

interface RadarChartProps {
  results: AssessmentResult[];
}

export const RadarChart: React.FC<RadarChartProps> = ({ results }) => {
  const data = results.map(result => ({
    chapter: result.chapterId.replace(/([A-Z])/g, ' $1').trim(),
    score: Math.round((result.score / result.maxScore) * 100),
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid className="stroke-muted" />
          <PolarAngleAxis 
            dataKey="chapter" 
            className="text-xs fill-foreground"
            tick={{ fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 10 }}
          />
          <Radar
            name="Compliance Score"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};