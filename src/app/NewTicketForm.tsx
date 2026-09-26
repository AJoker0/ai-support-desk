'use client';

import { useRef } from 'react';
import { createTicket } from './actions';
import { QUICK_TEMPLATES } from '@/lib/constants';
import { PlusCircle, Sparkles } from 'lucide-react';

export default function NewTicketForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  const fillTemplate = (name: string, content: string) => {
    if (nameInputRef.current) nameInputRef.current.value = name;
    if (contentInputRef.current) contentInputRef.current.value = content;
  };

  const handleSubmit = async (formData: FormData) => {
    await createTicket(formData);
    formRef.current?.reset();
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 md:p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-blue-400" />
          Створити нове звернення
        </h2>

        {/* Быстрые шаблоны для тестирования */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 mr-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400/80" /> Тест:
          </span>
          {QUICK_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.title}
              type="button"
              onClick={() => fillTemplate(tmpl.name, tmpl.content)}
              className="text-[11px] rounded-lg border border-slate-800 bg-slate-950/70 px-2 py-1 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
            >
              {tmpl.title}
            </button>
          ))}
        </div>
      </div>

      <form ref={formRef} action={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Клієнт
          </label>
          <input
            ref={nameInputRef}
            type="text"
            name="clientName"
            placeholder="Ім'я та прізвище"
            required
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Зміст повідомлення
          </label>
          <textarea
            ref={contentInputRef}
            name="content"
            rows={3}
            placeholder="Опишіть ситуацію, номер замовлення чи питання клієнта..."
            required
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition resize-none"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-2 text-xs md:text-sm font-medium text-white shadow-sm shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95"
          >
            Додати в чергу
          </button>
        </div>
      </form>
    </section>
  );
}