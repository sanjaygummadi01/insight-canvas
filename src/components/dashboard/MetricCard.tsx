import React from 'react';
import { Icon, IconName } from '@/components/icons/Icon';
import { MetricCardData } from '@/types/analytics';

interface MetricCardProps {
  data: MetricCardData;
  delay?: number;
}

const iconMap: Record<string, IconName> = {
  sales: 'dollar',
  revenue: 'bar-chart',
  users: 'users',
  growth: 'percent',
};

export const MetricCard: React.FC<MetricCardProps> = ({ data, delay = 0 }) => {
  const iconName = iconMap[data.icon];
  const isPositive = data.change >= 0;

  return (
    <div 
      className="metric-card opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{data.title}</p>
          <h3 className="text-2xl font-bold text-foreground">{data.value}</h3>
        </div>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon name={iconName} className="w-5 h-5 text-primary" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        <span 
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-success' : 'text-destructive'
          }`}
        >
          <Icon name={isPositive ? 'trending-up' : 'trending-down'} className="w-4 h-4" />
          {Math.abs(data.change)}%
        </span>
        <span className="text-sm text-muted-foreground">{data.changeLabel}</span>
      </div>
    </div>
  );
};
