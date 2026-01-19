"use client";

import dynamic from 'next/dynamic';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { useMemo } from 'react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const kebabName = name
    .replace(/([a-z])([A-Z0-9])/g, '$1-$2')
    .toLowerCase();

  const IconName = kebabName as keyof typeof dynamicIconImports;

  const Icon = useMemo(() => {
    const importFn = dynamicIconImports[IconName];
    if (!importFn) return null;
    return dynamic(importFn, { 
      loading: () => <div className="w-6 h-6 bg-gray-700/50 rounded-full animate-pulse" /> 
    });
  }, [IconName]);

  if (!Icon) {
    return <div className="w-6 h-6 bg-red-500/20 rounded-full" title={`Icon ${name} not found`} />;
  }

  return <Icon {...props} />;
};
