import React, { useEffect, useState } from "react";
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
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
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
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { formatCurrency } from "../../utils/formatting";

ChartJS.register(ArcElement, Tooltip, Legend);

interface categoryProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
  transaction: Transaction[];
  currentYear: Date;
  currentMonth: Date;
}

const CategoryChartYear = ({
  monthlyTransactions,
  isLoading,
  transaction,
  currentYear,
  currentMonth,
}: categoryProps) => {
  const theme = useTheme();

  const [categoryType, setCategoryType] = useState<
    IncomeCategory | ExpenseCategory
  >("給与");

  const handleChangeCategory = (
    e: SelectChangeEvent<IncomeCategory | ExpenseCategory>
  ) => {
    setCategoryType(e.target.value as IncomeCategory | ExpenseCategory);
  };

  //毎月のカテゴリを選択
  const categorySelectMonth = monthlyTransactions.filter(
    (data) => data.category === categoryType
  );

  //毎月のカテゴリの合計
  const categorySumsMoth = monthlyTransactions
    .filter((data) => data.category === categoryType)
    .reduce<Record<IncomeCategory | ExpenseCategory, number>>(
      (acc, yearData) => {
        if (!acc[yearData.category]) {
          acc[yearData.category] = 0;
        }
        acc[yearData.category] += yearData.amount;
        return acc;
      },
      {} as Record<IncomeCategory | ExpenseCategory, number>
    );

  let dataTestArray: Transaction[] = [];

  categorySelectMonth.map((datas) => {
    dataTestArray.push(datas);
  });

  const categorySum = Object.values(categorySumsMoth);
  let [categoryItem] = categorySum;

  //日付を古い順に並び替え
  function compareDates(a: Transaction, b: Transaction): number {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }

  categorySelectMonth.sort(compareDates);

  return (
    <>
      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="type-select-label">カテゴリを選択</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={categoryType}
            label="カテゴリを選択"
            onChange={handleChangeCategory}
          >
            <MenuItem value={"給与"}>給与</MenuItem>
            <MenuItem value={"副収入"}>副収入</MenuItem>
            <MenuItem value={"お小遣い"}>お小遣い</MenuItem>
            <MenuItem value={"食費"}>食費</MenuItem>
            <MenuItem value={"日用品"}>日用品</MenuItem>
            <MenuItem value={"住居費"}>住居費</MenuItem>
            <MenuItem value={"交際費"}>交際費</MenuItem>
            <MenuItem value={"娯楽"}>娯楽</MenuItem>
            <MenuItem value={"雑貨"}>雑貨</MenuItem>
            <MenuItem value={"交通費"}>交通費</MenuItem>
            <MenuItem value={"医療費"}>医療費</MenuItem>
            <MenuItem value={"化粧品"}>化粧品</MenuItem>
            <MenuItem value={"カード払い"}>カード払い</MenuItem>
            <MenuItem value={"保険類"}>保険類</MenuItem>
            <MenuItem value={"衣類"}>衣類</MenuItem>
            <MenuItem value={"光熱費"}>光熱費</MenuItem>
            <MenuItem value={"農業経費"}>農業経費</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} display={"flex"} flexDirection={"column"}>
            <Card
              sx={{
                borderRadius: "10px",
                flexGrow: 1,
              }}
            >
              <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
                <Stack direction={"row"}>
                  <Typography fontWeight="bold">
                    {currentMonth.getMonth() + 1}月の{categoryType}の合計金額
                  </Typography>
                </Stack>
                <Typography
                  textAlign={"right"}
                  variant="h5"
                  fontWeight={"fontWeightBold"}
                  sx={{
                    wordBreak: "break-word",
                    fontSize: { xs: ".8rem", sm: "1rem", md: "1.2rem" },
                  }}
                >
                  {/* {formatCurrency(categorySumsYear.categorySum)}円 */}
                  {categoryItem ? formatCurrency(categoryItem) : 0}円
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : categorySelectMonth.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {categorySelectMonth.map((data, index) => (
              <Card
                key={index}
                sx={{
                  maxWidth: "100%",
                  marginBottom: "20px",
                  width: { xs: "100%", sm: "48%", lg: "23%" },
                  marginRight: { xs: "0%", sm: "1%", lg: "1%" },
                  marginLeft: { xs: "0%", sm: "1%", lg: "1%" },
                  backgroundColor:
                    data.type === "income"
                      ? theme.palette.incomeColor.light
                      : theme.palette.expenseColor.light,
                }}
              >
                <CardContent sx={{ display: "flex" }}>
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "7px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: "7px",
                          fontWeight: "bold",
                          fontSize: "18px",
                          marginRight: "7px",
                          whiteSpace: "nowrap",
                          width: "50%",
                        }}
                      >
                        日付
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "flex",
                          justifyContent: "right",
                          marginBottom: "7px",
                          width: "50%",
                          fontWeight: "bold",
                        }}
                      >
                        {data.date}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "7px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: "7px",
                          fontWeight: "bold",
                          fontSize: "18px",
                          marginRight: "7px",
                          whiteSpace: "nowrap",
                          width: "50%",
                        }}
                      >
                        収支
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: "7px",
                          width: "50%",
                          display: "flex",
                          justifyContent: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {data.type === "income" ? "収入" : "支出"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "7px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: "7px",
                          fontWeight: "bold",
                          fontSize: "18px",
                          marginRight: "7px",
                          whiteSpace: "nowrap",
                          width: "50%",
                        }}
                      >
                        カテゴリ
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: "7px",
                          width: "50%",
                          display: "flex",
                          justifyContent: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {data.category}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "7px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: "7px",
                          fontWeight: "bold",
                          fontSize: "18px",
                          marginRight: "7px",
                          whiteSpace: "nowrap",
                          width: "50%",
                        }}
                      >
                        内容
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: "7px",
                          width: "50%",
                          display: "flex",
                          justifyContent: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {data.content}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "7px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: "7px",
                          fontWeight: "bold",
                          fontSize: "18px",
                          marginRight: "7px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        金額
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          marginBottom: "7px",
                          width: "50%",
                          display: "flex",
                          justifyContent: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {formatCurrency(data.amount)}円
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography>データがありません</Typography>
        )}
      </Box>
    </>
  );
};

export default CategoryChartYear;
