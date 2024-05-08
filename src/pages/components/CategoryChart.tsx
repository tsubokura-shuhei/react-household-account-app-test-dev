import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ExpenseCategory,
  IncomeCategory,
  Transaction,
  TransactionType,
} from "../../types";
import { object } from "zod";
import CircularProgress from "@mui/material/CircularProgress";
import { financeCalculations } from "../../utils/financeCalculations";

ChartJS.register(ArcElement, Tooltip, Legend);

interface categoryProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

const CategoryChart = ({ monthlyTransactions, isLoading }: categoryProps) => {
  const theme = useTheme();

  const [selectedType, setSelectedType] = useState<TransactionType>("expense");

  const handleChange = (e: SelectChangeEvent<TransactionType>) => {
    setSelectedType(e.target.value as TransactionType);
  };

  //カテゴリごとの合計を計算
  const categorySums = monthlyTransactions
    .filter((data) => data.type === selectedType)
    .reduce<Record<IncomeCategory | ExpenseCategory, number>>(
      (acc, transactionData) => {
        if (!acc[transactionData.category]) {
          acc[transactionData.category] = 0;
        }
        acc[transactionData.category] += transactionData.amount;
        return acc;
      },
      {} as Record<IncomeCategory | ExpenseCategory, number>
    );

  //ラベルを配列へ格納
  const categoryLabel = Object.keys(categorySums) as (
    | IncomeCategory
    | ExpenseCategory
  )[];

  //ラベルの金額を配列へ格納
  const categoryValues = Object.values(categorySums);

  // オプション設定
  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  //カテゴリーごとの色分け
  const incomeCategoryColor: Record<IncomeCategory, string> = {
    給与: theme.palette.incomeCategoryColor.給与,
    副収入: theme.palette.incomeCategoryColor.副収入,
    お小遣い: theme.palette.incomeCategoryColor.お小遣い,
  };
  const expenseCategoryColor: Record<ExpenseCategory, string> = {
    食費: theme.palette.expenseCategoryColor.食費,
    日用品: theme.palette.expenseCategoryColor.日用品,
    住居費: theme.palette.expenseCategoryColor.住居費,
    交際費: theme.palette.expenseCategoryColor.交際費,
    娯楽: theme.palette.expenseCategoryColor.娯楽,
    雑貨: theme.palette.expenseCategoryColor.雑貨,
    交通費: theme.palette.expenseCategoryColor.交通費,
    医療費: theme.palette.expenseCategoryColor.医療費,
    化粧品: theme.palette.expenseCategoryColor.化粧品,
    カード払い: theme.palette.expenseCategoryColor.カード払い,
    保険類: theme.palette.expenseCategoryColor.保険類,
    衣類: theme.palette.expenseCategoryColor.衣類,
    光熱費: theme.palette.expenseCategoryColor.光熱費,
    農業経費: theme.palette.expenseCategoryColor.農業経費,
  };

  //カテゴリーごとに色分けする関数
  const getCategoryColor = (
    category: IncomeCategory | ExpenseCategory
  ): string => {
    if (selectedType === "income") {
      return incomeCategoryColor[category as IncomeCategory];
    } else {
      return expenseCategoryColor[category as ExpenseCategory];
    }
  };

  const data: ChartData<"pie"> = {
    labels: categoryLabel,
    datasets: [
      {
        data: categoryValues,
        // backgroundColor: [
        //   "rgba(255, 99, 132, 0.2)",
        //   "rgba(54, 162, 235, 0.2)",
        //   "rgba(255, 206, 86, 0.2)",
        //   "rgba(75, 192, 192, 0.2)",
        //   "rgba(153, 102, 255, 0.2)",
        //   "rgba(255, 159, 64, 0.2)",
        // ],
        backgroundColor: categoryLabel.map((category) =>
          getCategoryColor(category)
        ),
        borderColor: categoryLabel.map((category) =>
          getCategoryColor(category)
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {/* <TextField
        id="outlined-basic"
        label="収支の種類"
        InputLabelProps={{
          htmlFor: "type-select-label",
        }}
        inputProps={{ id: "type-select-label" }}
        select
        fullWidth
        value={selectedType}
        onChange={handleChange}
      >
        <MenuItem value={"income"}>収入</MenuItem>
        <MenuItem value={"expense"}>支出</MenuItem>
      </TextField> */}

      <FormControl fullWidth>
        <InputLabel id="type-select-label">収支の種類</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={selectedType}
          label="収支の種類"
          onChange={handleChange}
        >
          <MenuItem value={"income"}>収入</MenuItem>
          <MenuItem value={"expense"}>支出</MenuItem>
        </Select>
      </FormControl>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : monthlyTransactions.length > 0 ? (
          <Pie options={options} data={data} />
        ) : (
          <Typography>データがありません</Typography>
        )}
      </Box>
    </>
  );
};

export default CategoryChart;
