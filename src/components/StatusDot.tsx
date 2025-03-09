import React from 'react';

const statusColors = {
  online: 'bg-green-500',
  idle: 'bg-yellow-500',
  dnd: 'bg-red-500',
  offline: 'bg-zinc-500',
} as const;

interface StatusDotProps {
  status: keyof typeof statusColors;
}

export function StatusDot({ status }: StatusDotProps) {
  return (
    <div className={`w-3 h-3 rounded-full ${statusColors[status]} absolute bottom-0 right-0 ring-2 ring-zinc-900`} />
  );
}