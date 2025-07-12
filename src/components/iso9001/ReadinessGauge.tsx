import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ReadinessGaugeProps {
  percentage: number;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({ percentage }) => {
  const data = [
    { name: "Complete", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  const getColor = (percentage: number) => {
    if (percentage >= 85) return "hsl(var(--emerald-500))";
    if (percentage >= 70) return "hsl(var(--blue-500))";
    if (percentage >= 55) return "hsl(var(--amber-500))";
    return "hsl(var(--rose-500))";
  };

  const colors = [getColor(percentage), "hsl(var(--muted))"];

  return (
    <div className="relative w-64 h-64 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          {/* Add text directly to the SVG */}
          <text 
            x="50%" 
            y="45%" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="text-4xl font-bold fill-primary"
            style={{ fontSize: '32px', fontWeight: 'bold' }}
          >
            {percentage}%
          </text>
          <text 
            x="50%" 
            y="55%" 
            textAnchor="middle" 
            dominantBaseline="middle" 
            className="text-sm fill-muted-foreground"
            style={{ fontSize: '14px' }}
          >
            Ready
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};