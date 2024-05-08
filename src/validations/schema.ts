import { X } from "@mui/icons-material";
import { z } from "zod";

export const transactionScheme = z.object({
  type: z.enum(["income", "expense"]),
  date: z.string().min(1, { message: "日付は必須です" }),
  amount: z.number().min(1, { message: "金額は1円以上必須です" }),
  content: z
    .string()
    .min(1, { message: "内容を入力してください" })
    .max(50, { message: "内容は50文字以内にしてください。" }),

  category: z
    .union([
      z.enum([
        "食費",
        "日用品",
        "住居費",
        "交際費",
        "娯楽",
        "雑貨",
        "交通費",
        "医療費",
        "化粧品",
        "カード払い",
        "保険類",
        "衣類",
        "光熱費",
        "農業経費",
      ]),
      z.enum(["給与", "副収入", "お小遣い"]),
      z.literal(""),
    ])
    .refine((val) => val !== "", {
      message: "カテゴリを選択してください",
    }),
});

export type Schema = z.infer<typeof transactionScheme>;
