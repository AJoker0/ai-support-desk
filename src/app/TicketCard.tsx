'use client';

import { useState, useTransition } from 'react';
import { analyzeTicket } from './actions';
import { 
  Sparkles, 
  Loader2, 
  Clock, 
  User, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  CheckCircle2
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await analyzeTicket(ticket.id);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    });
  };

  const handleCopyReply = async () => {
    if (!ticket.draftReply) return;
    await navigator.clipboard.writeText(ticket.draftReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPriorityStyle = (priority: string) => {
    const p = priority.toLowerCase();
    if (p.includes('висок')) {
      return {
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        icon: <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-400" />
      };
    }
    if (p.includes('середн')) {
      return {
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
      };
    }
    return {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: <Info className="w-3.5 h-3.5 mr-1 text-emerald-400" />
    };
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:border-slate-700 transition duration-200">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-semibold text-xs">
              {ticket.clientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-slate-100 font-semibold text-sm block">
                {ticket.clientName}
              </span>
            </div>
          </div>

          <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {new Date(ticket.createdAt).toLocaleDateString('uk-UA', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 mb-4">
          <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
            {ticket.content}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {ticket.summary ? (
          <div className="space-y-3.5 pt-4 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              {ticket.priority && (
                <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border font-medium uppercase tracking-wider ${getPriorityStyle(ticket.priority).badge}`}>
                  {getPriorityStyle(ticket.priority).icon}
                  {ticket.priority}
                </span>
              )}
              {ticket.category && (
                <span className="text-xs px-2.5 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 font-medium">
                  #{ticket.category}
                </span>
              )}
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold block mb-1">Підсумок звернення:</span>
              <p className="text-slate-200 leading-relaxed">{ticket.summary}</p>
            </div>

            {ticket.draftReply && (
              <div className="bg-blue-950/30 border border-blue-800/40 p-3.5 rounded-xl text-xs relative group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-blue-400 font-semibold block">Чернетка відповіді:</span>
                  <button
                    onClick={handleCopyReply}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Скопійовано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Копіювати</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed italic">«{ticket.draftReply}»</p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex justify-between items-center">
        <span className="text-[11px] font-mono text-slate-600">
          ID: {ticket.id.slice(0, 8)}
        </span>

        {!ticket.summary ? (
          <button
            onClick={handleAnalyze}
            disabled={isPending}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-md shadow-blue-900/30 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Аналіз через AI...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                Аналізувати (AI)
              </>
            )}
          </button>
        ) : (
          <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Оброблено AI
          </span>
        )}
      </div>
    </div>
  );
}