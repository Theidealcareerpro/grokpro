import { ReactNode } from 'react';

  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
  }

  export default function Button({ children, ...props }: ButtonProps) {
    return (
      <button
        {...props}
        className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition text-sm ${props.className || ''}`}
      >
        {children}
      </button>
    );
  }