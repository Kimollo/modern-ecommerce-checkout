export const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900';

export const fieldClass = `w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus-visible:border-stone-900 focus-visible:ring-2 focus-visible:ring-stone-900/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus-visible:ring-red-500/15`;

export const primaryButtonClass = `inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-stone-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-stone-950 disabled:active:scale-100 ${focusRing}`;

export const secondaryButtonClass = `inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`;

export const quietButtonClass = `inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-200/70 hover:text-stone-900 ${focusRing}`;

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}
