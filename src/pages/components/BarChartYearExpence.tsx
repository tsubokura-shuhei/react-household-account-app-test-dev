import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Transaction, Year } from "../../types";
import {
  calculateDailyBalances,
  financeCalculations,
} from "../../utils/financeCalculations";
import { Box, Typography, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { formatYear } from "../../utils/formatting";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  yearTransactions: Transaction[];
  isLoading: boolean;
  transaction: Transaction[];
  currentYear: Date;
}

const BarChartYearExpence = ({
  yearTransactions,
  isLoading,
  transaction,
  currentYear,
}: BarChartProps) => {
  const theme = useTheme();

  //年間の合計(支出)
  function YearCalculations(yearTransactionsData: Transaction[]): Year {
    return yearTransactionsData.reduce(
      (acc, yearTransactionsData) => {
        if (yearTransactionsData.type === "expense") {
          if (
            yearTransactionsData.date.slice(0, 4) === formatYear(currentYear)
          ) {
            if (yearTransactionsData.date.slice(5, 7) === "01") {
              acc.January += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "02") {
              acc.February += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "03") {
              acc.March += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "04") {
              acc.April += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "05") {
              acc.May += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "06") {
              acc.June += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "07") {
              acc.July += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "08") {
              acc.August += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "09") {
              acc.September += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "10") {
              acc.October += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "11") {
              acc.November += yearTransactionsData.amount;
            }
            if (yearTransactionsData.date.slice(5, 7) === "12") {
              acc.Decembe += yearTransactionsData.amount;
            }
          }
        }
        return acc;
      },
      {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        Decembe: 0,
      }
    );
  }
  const yearMonthlyData = YearCalculations(transaction);

  // オプション設定
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      // legend: {
      //   position: "top" as const,
      // },
      title: {
        display: true,
        text: "年間の支出",
      },
    },
  };

  //日付ごとの収支の算出
  // const dailyBalances = calculateDailyBalances(yearTransactions);
  // console.log(dailyBalances);

  //ラベル（日付）を配列へ格納
  const dateLabels = Object.keys(yearMonthlyData);

  //日付ごとの支出を配列へ格納
  const expenseData = Object.values(yearMonthlyData);

  //データ設定
  const data = {
    labels: dateLabels,
    datasets: [
      {
        label: "支出",
        data: expenseData,
        backgroundColor: theme.palette.expenseColor.light,
      },
    ],
  };

  return (
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
      ) : yearTransactions.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <Typography>データがありません</Typography>
      )}
    </Box>
  );
};

export default BarChartYearExpence;
