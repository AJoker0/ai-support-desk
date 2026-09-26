import { prisma } from '@/lib/prisma';
import { createTicket } from './actions';
import TicketCard from './TicketCard';
import { MessageSquarePlus, Headset } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10 font-sans selection:bg-blue-600 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
                <Headset className="w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                AI Support Desk
              </h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Система інтелектуальної обробки та класифікації звернень клієнтів
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LLM: Gemini 2.5 Flash</span>
          </div>
        </header>

        <section className="bg-slate-900/60 border border-slate-800 p-6 md:p-7 rounded-2xl shadow-xl backdrop-blur-sm">
          <h2 className="text-base font-semibold mb-4 text-slate-100 flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-blue-400" />
            Нове звернення клієнта
          </h2>

          <form action={createTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Ім&apos;я клієнта
                </label>
                <input
                  type="text"
                  name="clientName"
                  placeholder="Олексій Коваленко"
                  required
                  className="w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-slate-100 border-slate-800 outline-none transition duration-150"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Текст звернення
                </label>
                <input
                  type="text"
                  name="content"
                  placeholder="Опишіть ситуацію, проблему або запитання..."
                  required
                  className="w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-sm text-slate-100 border-slate-800 outline-none transition duration-150"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs md:text-sm px-6 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Зберегти звернення
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">
              Вхідні звернення
              <span className="ml-2.5 text-xs font-mono font-normal bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {tickets.length}
              </span>
            </h2>
          </div>

          {tickets.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-slate-500">
              <p className="text-sm">Список порожній. Створіть перше звернення вище для тестування AI.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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