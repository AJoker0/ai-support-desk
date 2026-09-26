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
    throw new Error('Имя и текст обращения обязательны');
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
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new Error('Тикет не найден');
  }

  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: z.object({
      priority: z.enum(['низкий', 'средний', 'высокий']),
      category: z.string().describe('Категория: например, оплата, доставка, жалоба или другое'),
      summary: z.string().describe('Краткая суть строго в одно предложение'),
      draftReply: z.string().describe('Вежливый и емкий черновик ответа клиенту'),
    }),
    prompt: `Ты ассистент службы поддержки. Проанализируй входящее обращение клиента.
Имя клиента: ${ticket.clientName}
Текст обращения: ${ticket.content}

Определи приоритет (низкий, средний, высокий), определи категорию, напиши саммари ровно в 1 предложение и подготовь вежливый черновик ответа клиенту на языке обращения.`,
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
}