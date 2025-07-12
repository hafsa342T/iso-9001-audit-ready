import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { AssessmentResult } from "@/data/iso9001Data";

interface CategoryChartProps {
  results: AssessmentResult[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ results }) => {
  const data = results.map(result => ({
    chapter: result.chapterId.replace(/([A-Z])/g, ' $1').trim().slice(0, 10) + "...",
    score: Math.round((result.score / result.maxScore) * 100),
    fullName: result.chapterId.replace(/([A-Z])/g, ' $1').trim(),
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="chapter" 
            angle={-45}
            textAnchor="end"
            height={80}
            className="text-xs fill-foreground"
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            domain={[0, 100]}
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 10 }}
          />
          <Bar 
            dataKey="score" 
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};