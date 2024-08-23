import { cn } from '@/lib/utils';
import React from 'react';

type RepeaterProps = {
  pageBlockId: string;
  propName: string;
  className?: string;
  children: React.ReactNode;
};

export default function Repeater({ pageBlockId, propName, className, children, ...props }: RepeaterProps) {
  return (
    <ul {...props} id={propName} className={cn(className)}>
      {React.Children.map(children, (child, index) => (
        <>{React.cloneElement(child as React.ReactElement, { propName: `${propName}.${index}`, pageBlockId })}</>
      ))}
    </ul>
  );
}
