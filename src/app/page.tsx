import { prisma } from '@/lib/prisma';
import { createTicket } from './actions';
import TicketCard from './TicketCard';
import { Inbox, Send } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Заголовок */}
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Inbox className="w-8 h-8 text-blue-500" />
            AI Support Desk
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Система автоматизованої обробки звернень служби підтримки
          </p>
        </header>

        {/* Форма создания */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">Додати нове звернення</h2>
          <form action={createTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Ім&apos;я клієнта
              </label>
              <input
                type="text"
                name="clientName"
                placeholder="напр. Олексій Коваленко"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Текст звернення
              </label>
              <textarea
                name="content"
                rows={3}
                placeholder="Опишіть проблему або питання клієнта..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20"
            >
              <Send className="w-4 h-4" />
              Зберегти звернення
            </button>
          </form>
        </section>

        {/* Список обращений */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-200">
              Список звернень ({tickets.length})
            </h2>
          </div>

          {tickets.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl text-slate-500">
              Поки що немає звернень. Додайте перше звернення вище!
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