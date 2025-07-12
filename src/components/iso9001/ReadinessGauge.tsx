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
    <div className="relative w-56 h-56 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius={70}
            outerRadius={90}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">{percentage}%</div>
          <div className="text-sm text-muted-foreground">Ready</div>
        </div>
      </div>
    </div>
  );
};