'use client';
  import { ReactNode, useState } from 'react';
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
      setIsOpen(!isOpen);
      if (onToggle) onToggle();
    };

    return (
      <div className="border rounded-lg p-4 bg-white dark:bg-zinc-800 shadow-md">
        <h3
          className="text-lg font-semibold text-teal-700 flex justify-between items-center cursor-pointer"
          onClick={handleToggle}
        >
          {title}
          {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </h3>
        {isOpen && <div className="mt-4">{children}</div>}
      </div>
    );
  }