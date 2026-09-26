'use client';

import { useState, useTransition } from 'react';
import { analyzeTicket } from './actions';
import { PRIORITY_CONFIG, PriorityLevel } from '@/lib/constants';
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  Tag
} from 'lucide-react';

interface Ticket {
  id: string;
  clientName: string;
  content: string;
  priority: string | null;
  category: string | null;
  summary: string | null;
  draftReply: string | null;
  createdAt: Date;
}

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    setError(null);
    startTransition(async () => {
      const res = await analyzeTicket(ticket.id);
      if (!res.success && res.error) {
        setError(res.error);
      }
    });
  };

  const handleCopy = async () => {
    if (!ticket.draftReply) return;
    await navigator.clipboard.writeText(ticket.draftReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const priorityKey = (ticket.priority?.toLowerCase() || '') as PriorityLevel;
  const priorityStyle = PRIORITY_CONFIG[priorityKey] || {
    label: ticket.priority || 'Звичайний',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    dotClass: 'bg-slate-400',
  };

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 backdrop-blur-md transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80">
      <div>
        {/* Заголовок карточки */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 font-mono text-xs font-semibold text-blue-400 border border-blue-500/20">
              {ticket.clientName.charAt(0).toUpperCase()}
            </div>
            <h3 className="truncate text-sm font-medium text-slate-100">
              {ticket.clientName}
            </h3>
          </div>

          <time className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-slate-500">
            <Clock className="h-3 w-3" />
            {new Date(ticket.createdAt).toLocaleDateString('uk-UA', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
        </div>

        {/* Текст обращения */}
        <p className="mt-3.5 rounded-xl bg-slate-950/60 p-3.5 text-xs md:text-sm leading-relaxed text-slate-300 border border-slate-900/80">
          {ticket.content}
        </p>

        {/* Ошибка если упало */}
        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-900/40 bg-rose-950/20 p-2.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* AI-блок после анализа */}
        {ticket.summary ? (
          <div className="mt-4 space-y-3 rounded-xl border border-slate-800/90 bg-slate-950/40 p-3.5">
            {/* Теги */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase ${priorityStyle.badgeClass}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dotClass}`} />
                {priorityStyle.label}
              </span>

              {ticket.category && (
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-medium text-sky-300">
                  <Tag className="h-3 w-3 opacity-60" />
                  {ticket.category}
                </span>
              )}
            </div>

            {/* Саммари */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Суть звернення
              </span>
              <p className="text-xs leading-relaxed text-slate-200">
                {ticket.summary}
              </p>
            </div>

            {/* Черновик ответа */}
            {ticket.draftReply && (
              <div className="rounded-lg border border-blue-900/30 bg-blue-950/20 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                    Чернетка відповіді
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 rounded border border-slate-700/60 bg-slate-900/80 px-2 py-0.5 text-[11px] text-slate-300 hover:text-white transition"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Скопійовано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Копіювати</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs italic leading-relaxed text-slate-300">
                  «{ticket.draftReply}»
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Футер карточки */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3">
        <span className="font-mono text-[10px] text-slate-600">
          ID: {ticket.id.slice(0, 8)}
        </span>

        {!ticket.summary ? (
          <button
            onClick={handleAnalyze}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-500 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Аналізую...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Аналізувати (AI)
              </>
            )}
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Оброблено
          </span>
        )}
      </div>
    </article>
  );
}