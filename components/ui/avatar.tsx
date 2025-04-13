import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
  fallback?: string;
}

export function Avatar({ src, alt = '', className, fallback }: AvatarProps) {
  const initials = fallback?.slice(0, 2).toUpperCase() || '';

  if (!src) {
    return (
      <div className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-indigo-500',
        className
      )}>
        <span className="flex h-full w-full items-center justify-center text-sm font-medium text-white">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      'relative h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}>
      <Image
        src={src}
        alt={alt}
        className="aspect-square h-full w-full"
        width={40}
        height={40}
      />
    </div>
  );
} 