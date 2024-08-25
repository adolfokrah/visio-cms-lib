import { cn } from '@/lib/utils';
import React from 'react';

type RepeaterProps = {
  pageBlockId: string;
  propName: string;
  className?: string;
  children: React.ReactNode;
  component?: string;
};

export default function Repeater({
  pageBlockId,
  propName,
  className,
  children,
  component = 'ul',
  ...props
}: RepeaterProps) {
  if (component == '') {
    return React.Children.map(children, (child, index) => (
      <>{React.cloneElement(child as React.ReactElement, { propName: `${propName}.${index}`, pageBlockId })}</>
    ));
  }

  return React.createElement(
    component,
    {
      ...props,
      id: propName,
      className: cn(className),
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
      },
    },
    React.Children.map(children, (child, index) => (
      <>{React.cloneElement(child as React.ReactElement, { propName: `${propName}.${index}`, pageBlockId })}</>
    )),
  );
}
