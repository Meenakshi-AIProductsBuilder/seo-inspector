import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function ScoreGauge({ score, size = "md" }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = size === "lg" ? 48 : size === "md" ? 36 : 24;
  const stroke = size === "lg" ? 8 : size === "md" ? 6 : 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  let colorClass = "text-destructive";
  if (animatedScore >= 90) colorClass = "text-green-500";
  else if (animatedScore >= 50) colorClass = "text-yellow-500";

  const sizeClass = size === "lg" ? "w-32 h-32" : size === "md" ? "w-24 h-24" : "w-16 h-16";
  const textClass = size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-xl";

  return (
    <div className={cn("relative flex items-center justify-center font-mono font-bold", sizeClass, colorClass)}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="opacity-20"
        />
        {/* Progress */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-in-out" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={textClass}>{Math.round(animatedScore)}</span>
      </div>
    </div>
  );
}
