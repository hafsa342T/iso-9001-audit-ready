import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ReadinessGaugeProps {
  percentage: number;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({ percentage }) => {
  // Create data for a proper gauge - background and filled portion
  const maxAngle = 270; // Use 270 degrees (3/4 circle) for the gauge
  const filledAngle = (percentage / 100) * maxAngle;
  
  const data = [
    { name: "Filled", value: percentage },
    { name: "Empty", value: 100 - percentage }
  ];

  const getColor = (percentage: number) => {
    if (percentage >= 85) return "hsl(142 76% 36%)"; // Green
    if (percentage >= 70) return "hsl(217 91% 60%)"; // Blue  
    if (percentage >= 55) return "hsl(43 96% 56%)"; // Amber
    return "hsl(0 84% 60%)"; // Red
  };

  const getReadinessLevel = (percentage: number) => {
    if (percentage >= 85) return "Excellent Readiness";
    if (percentage >= 70) return "Good Readiness";
    if (percentage >= 55) return "Moderate Readiness";
    return "Developing Readiness";
  };

  const primaryColor = getColor(percentage);
  const backgroundColor = "hsl(210 40% 90%)"; // Light gray for empty portion

  return (
    <div className="relative w-64 h-64 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Background arc (full gauge range) */}
          <Pie
            data={[{ value: 100 }]}
            cx="50%"
            cy="50%"
            startAngle={135} // Start from bottom-left
            endAngle={-135} // End at bottom-right (270 degrees total)
            innerRadius={75}
            outerRadius={95}
            dataKey="value"
            stroke="none"
            fill={backgroundColor}
          />
          {/* Filled arc (actual percentage) */}
          <Pie
            data={[{ value: percentage }]}
            cx="50%"
            cy="50%"
            startAngle={135} // Start from bottom-left
            endAngle={135 - (percentage / 100) * 270} // Calculate end based on percentage
            innerRadius={75}
            outerRadius={95}
            dataKey="value"
            stroke="none"
            fill={primaryColor}
          />
          {/* Center text */}
          <text 
            x="50%" 
            y="45%" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            style={{ 
              fontSize: '36px', 
              fontWeight: 'bold',
              fill: 'hsl(222.2 84% 4.9%)'
            }}
          >
            {percentage}%
          </text>
          <text 
            x="50%" 
            y="55%" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            style={{ 
              fontSize: '14px',
              fill: 'hsl(215.4 16.3% 46.9%)'
            }}
          >
            {getReadinessLevel(percentage)}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};