import { useEffect, useState } from 'react';

  interface AnimatedCounterProps {
    value: number;
    label: string;
  }

  export default function AnimatedCounter({ value, label }: AnimatedCounterProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const end = value;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }, [value]);

    return (
      <div>
        <p className="text-3xl font-bold text-teal-600">{count}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
      </div>
    );
  }