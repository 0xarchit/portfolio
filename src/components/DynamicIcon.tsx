"use client";

import dynamic from 'next/dynamic';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { useMemo } from 'react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

function toKebab(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c >= 'A' && c <= 'Z') {
      if (i > 0) result += '-';
      result += c.toLowerCase();
    } else if (c >= '0' && c <= '9') {
      if (i > 0 && str[i - 1] >= 'a' && str[i - 1] <= 'z') result += '-';
      result += c;
    } else {
      result += c;
    }
  }
  return result;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const kebabName = toKebab(name) as keyof typeof dynamicIconImports;

  const Icon = useMemo(() => {
    const importFn = dynamicIconImports[kebabName];
    if (!importFn) return null;
    return dynamic(importFn, { 
      loading: () => <div className="w-6 h-6 bg-gray-700/50 rounded-full animate-pulse" /> 
    });
  }, [kebabName]);

  if (!Icon) {
    return <div className="w-6 h-6 bg-red-500/20 rounded-full" title={`Icon ${name} not found`} />;
  }

  return <Icon {...props} />;
};
