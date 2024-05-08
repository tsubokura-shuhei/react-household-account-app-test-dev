import { increment } from "firebase/firestore";

export type TransactionType = "income" | "expense";

export type IncomeCategory = "給与" | "副収入" | "お小遣い";
export type ExpenseCategory =
  | "食費"
  | "日用品"
  | "住居費"
  | "交際費"
  | "娯楽"
  | "雑貨"
  | "交通費"
  | "医療費"
  | "化粧品"
  | "カード払い"
  | "保険類"
  | "衣類"
  | "光熱費"
  | "農業経費";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  content: string;
  type: TransactionType;
  category: IncomeCategory | ExpenseCategory;
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}

export interface Year {
  January: number;
  February: number;
  March: number;
  April: number;
  May: number;
  June: number;
  July: number;
  August: number;
  September: number;
  October: number;
  November: number;
  Decembe: number;
}

export interface CalendarContent {
  start: string;
  income: string;
  expense: string;
  balance: string;
}

// export interface TypeCategory {
//   給与: string;
//   副収入: string;
//   お小遣い: string;
//   食費: string;
//   日用品: string;
//   住居費: string;
//   交際費: string;
//   娯楽: string;
//   交通費: string;
//   医療費: string;
//   化粧品: string;
// }
