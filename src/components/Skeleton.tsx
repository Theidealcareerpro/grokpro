interface SkeletonProps {
    className?: string;
  }

  export default function Skeleton({ className }: SkeletonProps) {
    return <div className={`bg-gray-300 dark:bg-gray-700 animate-pulse rounded ${className || ''}`} />;
  }