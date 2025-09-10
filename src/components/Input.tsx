interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
  }

  export default function Input({ label, ...props }: InputProps) {
    return (
      <div className="flex flex-col w-full">
        <label className="text-sm mb-1">{label}</label>
        <input
          {...props}
          className="w-full px-3 py-2 rounded border dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }