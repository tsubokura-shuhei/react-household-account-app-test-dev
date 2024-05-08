import { Typography, Grid, Paper } from "@mui/material";
import React from "react";
import MonthSelector from "./components/MonthSelector";
import CategoryChart from "./components/CategoryChart";
import BarChart from "./components/BarChart";
import TransactionTable from "./components/TransactionTable";
import { Transaction } from "../types";
import CategoryChartYear from "./components/CategoryChartMonth";

interface ReportProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  monthlyTransactions: Transaction[];
  isLoading: boolean;
  transaction: Transaction[];
  onDeleteTransaction: (
    transactionId: string | readonly string[]
  ) => Promise<void>;
  currentYear: Date;
}

const Report = ({
  currentMonth,
  setCurrentMonth,
  monthlyTransactions,
  isLoading,
  onDeleteTransaction,
  transaction,
  currentYear,
}: ReportProps) => {
  const commonPaperStyle = {
    height: "400px",
    display: "flex",
    flexDirection: "column",
    p: 2,
  };
  const cardStyle = {
    height: "auto",
    display: "flex",
    flexDirection: "column",
    p: 2,
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {/* 日付 */}
        <MonthSelector
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={commonPaperStyle}>
          {/* カテゴリグラフ */}
          <CategoryChart
            monthlyTransactions={monthlyTransactions}
            isLoading={isLoading}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={commonPaperStyle}>
          {/* 棒グラフ */}
          <BarChart
            monthlyTransactions={monthlyTransactions}
            isLoading={isLoading}
            currentMonth={currentMonth}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        {/* テーブル */}
        <TransactionTable
          monthlyTransactions={monthlyTransactions}
          onDeleteTransaction={onDeleteTransaction}
        />
      </Grid>
      {/* カード */}
      <Grid item xs={12}>
        <Paper sx={cardStyle}>
          <CategoryChartYear
            monthlyTransactions={monthlyTransactions}
            isLoading={isLoading}
            transaction={transaction}
            currentYear={currentYear}
            currentMonth={currentMonth}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Report;
