import { Camera, MessageCircle, Send, Video } from 'lucide-react';
import { SOCIAL_LINKS } from '../../lib/constants';
import { cn } from '../../lib/utils';

const SOCIAL_ICONS = {
  telegram: Send,
  instagram: Camera,
  youtube: Video,
  facebook: MessageCircle,
};

const TONE_CLASSES = {
  dark: 'bg-white/5 text-slate-300 hover:bg-emerald-600 hover:text-white',
  light: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-600 hover:text-white',
};

/** @param {{ tone?: keyof typeof TONE_CLASSES, className?: string }} props `tone` matches the background it sits on. */
export default function SocialLinks({ tone = 'dark', className }) {
  return (
    <ul className={cn('flex gap-2', className)} aria-label="Ми в соцмережах">
      {SOCIAL_LINKS.map((social) => {
        const Icon = SOCIAL_ICONS[social.id];
        return (
          <li key={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={cn('grid h-11 w-11 place-items-center rounded-full transition-colors', TONE_CLASSES[tone])}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
