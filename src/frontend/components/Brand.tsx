import { Leaf } from 'lucide-react';

/**
 * Centralized brand logo / wordmark.
 * Reused in both the navbar and the footer.
 */
export function Brand({ className = '', iconClass = 'text-eco-400' }: { className?: string; iconClass?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Leaf className={`h-6 w-6 ${iconClass}`} />
      <span className="text-lg font-bold">RénovÉnergie</span>
    </div>
  );
}
