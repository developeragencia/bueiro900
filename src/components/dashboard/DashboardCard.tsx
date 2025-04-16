import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface DashboardCardProps {
  title: string;
  value: string | number;
  tooltip?: string;
  className?: string;
  valueClassName?: string;
}

export function DashboardCard({ title, value, tooltip, className, valueClassName }: DashboardCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 ml-2 inline-block cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-64">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
} 