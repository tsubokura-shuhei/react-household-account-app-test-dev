import { format } from "date-fns";

//年と月を取得
export function formatMonth(date: Date): string {
  return format(date, "yyyy-MM");
}
//月を取得
export function formatMonthly(date: Date): string {
  return format(date, "MM");
}
//年を取得
export function formatYear(date: Date): string {
  return format(date, "yyyy");
}

//日本円に変換する関数
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("ja-JP");
}
