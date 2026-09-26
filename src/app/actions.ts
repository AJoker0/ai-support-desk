'use server';

import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function createTicket(formData: FormData) {
  const clientName = formData.get('clientName') as string;
  const content = formData.get('content') as string;

  if (!clientName?.trim() || !content?.trim()) {
    return;
  }

  await prisma.ticket.create({
    data: {
      clientName: clientName.trim(),
      content: content.trim(),
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
      return { success: false, error: 'Звернення не знайдено' };
    }

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: z.object({
        priority: z.enum(['низький', 'середній', 'високий']),
        category: z.string().describe('Категорія звернення: наприклад, оплата, доставка, скарга або інше'),
        summary: z.string().describe('Короткий підсумок проблеми клієнта рівно в 1 речення'),
        draftReply: z.string().describe('Ввічливий, конструктивний проєкт відповіді клієнту'),
      }),
      prompt: `Ти — кваліфікований AI-асистент служби підтримки клієнтів. Проаналізуй це звернення.
Ім'я клієнта: ${ticket.clientName}
Текст звернення: ${ticket.content}

Правила:
1. Визнач пріоритет: «низький» (запитання, подяка), «середній» (затримка, дрібні збої), «високий» (фінансові проблеми, звинувачення, агресивна скарга).
2. Визнач точну коротку категорію (оплата, доставка, скарга, технічний збій тощо).
3. Зроби короткий підсумок проблеми рівно в 1 речення.
4. Напиши готову чернетку відповіді клієнту на мові звернення.`,
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
    console.error('Помилка аналізу AI:', error);
    return { success: false, error: 'Помилка під час звернення до AI. Перевірте API ключ або модель' };
  }
}