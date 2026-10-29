import { Download, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

const DISMISSED_STORAGE_KEY = 'gurman-install-dismissed';

const readIsDismissed = () => {
  try {
    return localStorage.getItem(DISMISSED_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

export default function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [isDismissed, setIsDismissed] = useState(readIsDismissed);

  if (!canInstall || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISSED_STORAGE_KEY, '1');
    } catch {
      // Storage can be unavailable (private mode / quota); dismissal then lasts for this session only.
    }
  };

  const handleInstall = async () => {
    try {
      const outcome = await promptInstall();
      if (outcome === 'accepted') toast.success('GURMAN додано на головний екран');
    } catch {
      toast.error('Не вдалося відкрити встановлення');
    }
  };

  return (
    <aside aria-label="Встановлення застосунку" className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-emerald-100">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
        <Download className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">Встановіть GURMAN</p>
        <p className="text-xs text-slate-500">Швидкий доступ з головного екрана</p>
      </div>
      <button
        type="button"
        onClick={handleInstall}
        className="min-h-11 shrink-0 rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white active:scale-95"
      >
        Встановити
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Закрити пропозицію встановлення"
        className="-ml-1 grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full text-slate-400 active:scale-95"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </aside>
  );
}
