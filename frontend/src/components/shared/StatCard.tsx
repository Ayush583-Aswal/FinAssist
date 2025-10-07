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
        default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
        success: "bg-gradient-to-br from-green-500 to-green-600",
        warning: "bg-gradient-to-br from-amber-500 to-orange-500",
      };
    
      const iconClasses = {
        default: "text-blue-600 dark:text-blue-400",
        success: "text-white",
        warning: "text-white",
      };
    
      const textClasses = {
        default: "text-gray-950 dark:text-gray-50",
        success: "text-gray-900",
        warning: "text-gray-900",
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
