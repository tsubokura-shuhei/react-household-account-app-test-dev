import {
  Palette,
  PaletteColor,
  PaletteColorOptions,
  createTheme,
} from "@mui/material";
import {
  amber,
  blue,
  cyan,
  deepOrange,
  green,
  lightBlue,
  lightGreen,
  pink,
  purple,
  red,
} from "@mui/material/colors";
import { ExpenseCategory, IncomeCategory } from "../types";

declare module "@mui/material/styles" {
  interface Palette {
    incomeColor: PaletteColor;
    expenseColor: PaletteColor;
    balanceColor: PaletteColor;
    incomeCategoryColor: Record<IncomeCategory, string>;
    expenseCategoryColor: Record<ExpenseCategory, string>;
  }

  interface PaletteOptions {
    incomeColor?: PaletteColorOptions;
    expenseColor?: PaletteColorOptions;
    balanceColor?: PaletteColorOptions;
    incomeCategoryColor?: Record<IncomeCategory, string>;
    expenseCategoryColor?: Record<ExpenseCategory, string>;
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP,Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  palette: {
    incomeColor: {
      main: blue[600],
      light: blue[100],
      dark: blue[700],
    },
    expenseColor: {
      main: red[600],
      light: red[100],
      dark: red[700],
    },
    balanceColor: {
      main: green[600],
      light: green[100],
      dark: green[700],
    },
    //収入カラー
    incomeCategoryColor: {
      給与: lightBlue[600],
      副収入: cyan[200],
      お小遣い: lightGreen["A700"],
    },
    //支出カラー
    expenseCategoryColor: {
      食費: deepOrange[600],
      日用品: lightGreen[500],
      住居費: amber[500],
      交際費: pink[300],
      娯楽: cyan[200],
      雑貨: deepOrange[400],
      交通費: purple[400],
      医療費: lightGreen[300],
      化粧品: pink[200],
      カード払い: amber[300],
      保険類: purple[200],
      衣類: cyan[600],
      光熱費: deepOrange[200],
      農業経費: pink[600],
    },
  },
});
