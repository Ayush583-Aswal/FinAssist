import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "success" | "warning";
}

export const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => {
  const variantClasses = {
    default: "bg-card",
    success: "bg-gradient-success",
    warning: "bg-gradient-to-br from-warning/10 to-warning/5",
  };

  const iconClasses = {
    default: "text-primary",
    success: "text-white",
    warning: "text-warning",
  };

  const textClasses = {
    default: "text-card-foreground",
    success: "text-white",
    warning: "text-foreground",
  };

  return (
    <Card className={`${variantClasses[variant]} shadow-md transition-smooth hover:shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${textClasses[variant]}`}>
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${iconClasses[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textClasses[variant]}`}>{value}</div>
        {trend && (
          <p className={`text-xs ${variant === "success" ? "text-white/80" : "text-muted-foreground"} mt-1`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
