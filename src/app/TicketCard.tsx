'use client';

import { useTransition } from 'react';
import { analyzeTicket } from './actions';
import { Sparkles, Loader2, Clock, User, AlertCircle } from 'lucide-react';

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

  const handleAnalyze = () => {
    startTransition(async () => {
      try {
        await analyzeTicket(ticket.id);
      } catch (err) {
        alert('Помилка при виклику AI. Перевірте консоль розробника.');
        console.error(err);
      }
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'высокий':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'средний':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-lg shadow-black/20">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <User className="w-4 h-4 text-slate-400" />
            <span>{ticket.clientName}</span>
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 mb-4">
          {ticket.content}
        </p>

        {ticket.summary ? (
          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            <div className="flex flex-wrap gap-2 items-center">
              {ticket.priority && (
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium uppercase tracking-wider ${getPriorityBadge(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              )}
              {ticket.category && (
                <span className="text-xs px-2.5 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-400 font-medium">
                  {ticket.category}
                </span>
              )}
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold block mb-1">Підсумок:</span>
              <p className="text-slate-200">{ticket.summary}</p>
            </div>

            {ticket.draftReply && (
              <div className="bg-blue-950/20 border border-blue-800/30 p-3 rounded-xl text-xs">
                <span className="text-blue-400 font-semibold block mb-1">Чернетка відповіді:</span>
                <p className="text-slate-300 italic">«{ticket.draftReply}»</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
        {!ticket.summary ? (
          <button
            onClick={handleAnalyze}
            disabled={isPending}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-md disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Аналізую...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Аналізувати (AI)
              </>
            )}
          </button>
        ) : (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
            ✓ Оброблено AI
          </span>
        )}
      </div>
    </div>
  );
}