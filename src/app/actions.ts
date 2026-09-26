'use server';

import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { APP_CONFIG } from '@/lib/constants';

export async function createTicket(formData: FormData) {
  const clientName = formData.get('clientName')?.toString().trim();
  const content = formData.get('content')?.toString().trim();

  if (!clientName || !content) {
    return;
  }

  await prisma.ticket.create({
    data: {
      clientName,
      content,
    },
  });

  revalidatePath('/');
}

export async function analyzeTicket(ticketId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return { success: false, error: 'Звернення не знайдено в базі' };
    }

    const { object } = await generateObject({
      model: google(APP_CONFIG.llmModel),
      schema: z.object({
        priority: z.enum(['низький', 'середній', 'високий']),
        category: z.string().describe('Коротка категорія: оплата, доставка, повернення, технічне, відгук'),
        summary: z.string().describe('Суть звернення клієнта рівно в 1 змістовне речення українською мовою'),
        draftReply: z.string().describe('Жива, ввічлива та конструктивна відповідь клієнту по суті без канцеляризмів'),
      }),
      prompt: `Ти — спеціаліст підтримки сервісу. Проаналізуй звернення.

Дані клієнта:
- Ім'я: ${ticket.clientName}
- Повідомлення: "${ticket.content}"

Вимоги:
1. Пріоритет:
   - "високий": списання грошей, конфліктні ситуації, непрацюючий оплачений сервіс
   - "середній": питання по доставці, повернення товару, затримки
   - "низький": консультації, прості питання, відгуки та подяки
2. Категорія: максимум 1-2 слова українською.
3. Підсумок: рівно 1 речення.
4. Чернетка: жива, людяна відповідь без шаблонів на мові звернення клієнта.`,
    });

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        priority: object.priority,
        category: object.category,
        summary: object.summary,
        draftReply: object.draftReply,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('AI Analysis error:', error);
    return {
      success: false,
      error: 'Не вдалося обробити через AI. Перевірте квоту або API ключ.',
    };
  }
}