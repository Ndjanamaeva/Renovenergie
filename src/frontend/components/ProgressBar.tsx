import { useEffect, useState } from 'react';

type Props = { current: number; total: number; label: string };

export function ProgressBar({ current, total, label }: Props) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    const t = setTimeout(() => setWidth(pct), 60);
    return () => clearTimeout(t);
  }, [current, total]);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm font-medium">
        <span className="text-brand-800">{label}</span>
        <span className="text-slate-500">Étape {current} sur {total}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-eco-400 to-eco-600 transition-all duration-500 ease-out" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
