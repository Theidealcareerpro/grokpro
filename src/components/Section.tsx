'use client';
import { ReactNode, useState, KeyboardEvent } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface SectionProps {
  title: string;
  children: ReactNode;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Section({ title, children, isCollapsed = false, onToggle }: SectionProps) {
  const [isOpen, setIsOpen] = useState(!isCollapsed);

  const handleToggle = () => {
    setIsOpen((v) => !v);
    onToggle?.();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="border rounded-lg bg-card text-card-foreground shadow-sm p-3 sm:p-4">
      {/* Clickable header */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={onKey}
        aria-expanded={isOpen}
        className="
          flex items-center justify-between
          rounded-md
          -mx-1 px-1 py-1.5 sm:py-2
          cursor-pointer select-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 ring-offset-background
        "
      >
        <h3 className="text-[15px] sm:text-base font-semibold text-[hsl(var(--secondary))]">
          {title}
        </h3>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 opacity-80" aria-hidden />
        ) : (
          <ChevronDownIcon className="h-4 w-4 opacity-80" aria-hidden />
        )}
      </div>

      {isOpen && <div className="mt-3 sm:mt-3 min-w-0">{children}</div>}
    </div>
  );
}
