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
import { Transaction } from "../../types";
import { calculateDailyBalances } from "../../utils/financeCalculations";
import { Box, Typography, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  endOfMonth,
  endOfWeek,
  getWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
  currentMonth: Date;
}

const BarChart = ({
  monthlyTransactions,
  isLoading,
  currentMonth,
}: BarChartProps) => {
  const theme = useTheme();

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
        text: "週ごとの収支",
      },
    },
  };

  //週ごとの集計（棒グラフ用）
  // 2024年4月21日の週の始まりの日付を取得する
  // const weekStart = setDate(currren);
  // const stHiduke = weekStart.toISOString();
  // console.log(stHiduke, "始まり");

  // 2024年4月21日の週の終わりの日付を取得する
  // var result2 = startOfWeek(new Date(2024, 2, 1));
  // var hiduke2 = result2.toISOString();
  // // console.log(Number(hiduke), "終わり");
  // console.log(hiduke2);

  const endDay = endOfMonth(new Date(currentMonth));
  const endDaySlice = Number(endDay.toISOString().slice(8, 10));

  const monthText = endDay.toISOString().slice(5, 7);
  const yearText = endDay.toISOString().slice(0, 4);

  // console.log(Math.trunc(Number(endDaySlice) / 7));
  // console.log(Math.trunc(Number(endDaySlice) % 7));

  // console.log(endDaySlice);

  function monthryBarChartIcome(monthlyDate: Transaction[]) {
    return monthlyDate.reduce(
      (acc, monthlyDate) => {
        if (monthlyDate.type === "income") {
          if (
            1 <= Number(monthlyDate.date.slice(8, 10)) &&
            7 >= Number(monthlyDate.date.slice(8, 10))
          ) {
            acc.weekOne += monthlyDate.amount;
          }
          if (
            8 <= Number(monthlyDate.date.slice(8, 10)) &&
            14 >= Number(monthlyDate.date.slice(8, 10))
          ) {
            acc.weekTwo += monthlyDate.amount;
          }
          if (
            15 <= Number(monthlyDate.date.slice(8, 10)) &&
            21 >= Number(monthlyDate.date.slice(8, 10))
          ) {
            acc.weekThree += monthlyDate.amount;
          }
          if (
            22 <= Number(monthlyDate.date.slice(8, 10)) &&
            endDaySlice >= Number(monthlyDate.date.slice(8, 10))
          ) {
            acc.weekFor += monthlyDate.amount;
          }
        }
        return acc;
      },
      {
        weekOne: 0,
        weekTwo: 0,
        weekThree: 0,
        weekFor: 0,
      }
    );
  }
  function monthryBarChartExpense(monthlyDate: Transaction[]) {
    return monthlyDate.reduce(
      (acc, monthlyDate) => {
        if (monthlyDate.type === "expense") {
          if (
            1 <= Number(monthlyDate.date.slice(8, 10)) &&
            7 >= Number(monthlyDate.date.slice(8, 10))
          ) {
            acc.weekOne += monthlyDate.amount;
          }
          if (
            8 <= Number(monthlyDate.date.slice(8, 10)) &&
            14 >= Number(monthlyDate.date.slice(8, 10))
          ) {
            acc.weekTwo += monthlyDate.amount;
          }
          if (
            15 <= Number(monthlyDate.date.slice(8, 10)) &&
            21 >= Number(monthlyDate.date.slice(8, 10))
          ) {
            acc.weekThree += monthlyDate.amount;
          }
          if (
            22 <= Number(monthlyDate.date.slice(8, 10)) &&
            endDaySlice >= Number(monthlyDate.date.slice(8, 10))
          ) {
            acc.weekFor += monthlyDate.amount;
          }
        }
        return acc;
      },
      {
        weekOne: 0,
        weekTwo: 0,
        weekThree: 0,
        weekFor: 0,
      }
    );
  }

  const allDataIcome = monthryBarChartIcome(monthlyTransactions);
  const allDataExpense = monthryBarChartExpense(monthlyTransactions);

  //日付ごとの収支の算出
  // const dailyBalances = calculateDailyBalances(monthlyTransactions);

  // console.log(dailyBalances);
  // console.log(dailyBalances);
  // console.log(monthlyTransactions, "1ヶ月分の取引データ");

  //ラベル（日付）を配列へ格納
  // const dateLabels = Object.keys(dailyBalances).sort();

  const dateAmountIcome = Object.values(allDataIcome);
  const dateAmountExpense = Object.values(allDataExpense);

  const labelsAll = [
    `${monthText}月1日〜${monthText}月7日`,
    `${monthText}月8日〜${monthText}月14日`,
    `${monthText}月15日〜${monthText}月21日`,
    `${monthText}月22日〜${monthText}月${endDaySlice}日`,
  ];

  //日付ごとの支出を配列へ格納
  // const expenseData = labelsAll.map((day) => allDataExpense[day].expense);

  // //日付ごとの収入を配列へ格納
  // const incomeData = labelsAll.map((day) => dailyBalances[day].income);

  //データ設定
  const data = {
    labels: labelsAll,
    datasets: [
      {
        label: "収入",
        data: dateAmountIcome,
        backgroundColor: theme.palette.incomeColor.light,
      },
      {
        label: "支出",
        data: dateAmountExpense,
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
      ) : monthlyTransactions.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <Typography>データがありません</Typography>
      )}
    </Box>
  );
};

export default BarChart;
