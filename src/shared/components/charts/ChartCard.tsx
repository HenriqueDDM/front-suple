import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  contentClassName?: string;
  className?: string;
}

export function ChartCard({
  title,
  description,
  children,
  contentClassName,
  className,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className={contentClassName}>
        <div className="h-72 w-full">{children}</div>
      </CardContent>
    </Card>
  );
}
