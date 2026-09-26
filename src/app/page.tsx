import { prisma } from '@/lib/prisma';
import TicketCard from './TicketCard';
import NewTicketForm from './NewTicketForm';
import { APP_CONFIG } from '@/lib/constants';
import { Headphones, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const totalCount = tickets.length;
  const analyzedCount = tickets.filter((t) => t.summary !== null).length;
  const highPriorityCount = tickets.filter(
    (t) => t.priority?.toLowerCase() === 'високий'
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans selection:bg-blue-600 selection:text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* Хедер */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                {APP_CONFIG.name}
              </h1>
              <p className="text-xs text-slate-400">
                {APP_CONFIG.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 font-mono text-[11px] text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{APP_CONFIG.llmLabel}</span>
          </div>
        </header>

        {/* Метрики */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300 hidden sm:block">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Усього тікетів</span>
              <span className="text-lg font-semibold text-white">{totalCount}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hidden sm:block">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Оброблено AI</span>
              <span className="text-lg font-semibold text-emerald-400">{analyzedCount}</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hidden sm:block">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Високий пріоритет</span>
              <span className="text-lg font-semibold text-rose-400">{highPriorityCount}</span>
            </div>
          </div>
        </div>

        {/* Форма создания */}
        <NewTicketForm />

        {/* Список обращений */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-slate-200">
              Черга звернень ({tickets.length})
            </h2>
          </div>

          {tickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800/80 bg-slate-900/20 py-16 text-center text-slate-500">
              <p className="text-xs">
                Звернень немає. Створіть власне або виберіть тестовий шаблон угорі.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}