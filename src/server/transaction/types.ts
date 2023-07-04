import { z } from 'zod';

export const Transaction = z.object({
  id: z.string(),
  amount: z.number(),
  date: z.date(),
  description: z.string(),
  categoryId: z.string().nullable(),
  accountId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetTransactionsInput = z.object({
  accountId: z.string().optional(),
});
export const GetTransactionsOutput = z.array(Transaction);
export const CreateTransactionInput = Transaction.pick({
  amount: true,
  date: true,
  description: true,
  categoryId: true,
  accountId: true,
});
export const CreateTransactionOutput = Transaction;
export const UpdateTransactionInput = z.object({
  id: z.string(),
  amount: z.number().optional(),
  date: z.date().optional(),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
});
export const UpdateTransactionOutput = Transaction;
export const DeleteTransactionInput = z.object({
  id: z.string(),
});
export const DeleteTransactionOutput = z.void();

export type Transaction = z.infer<typeof Transaction>;
export type GetTransactionsInput = z.infer<typeof GetTransactionsInput>;
export type GetTransactionsOutput = z.infer<typeof GetTransactionsOutput>;
export type CreateTransactionInput = z.infer<typeof CreateTransactionInput>;
export type CreateTransactionOutput = z.infer<typeof CreateTransactionOutput>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionInput>;
export type UpdateTransactionOutput = z.infer<typeof UpdateTransactionOutput>;
export type DeleteTransactionInput = z.infer<typeof DeleteTransactionInput>;
export type DeleteTransactionOutput = z.infer<typeof DeleteTransactionOutput>;
