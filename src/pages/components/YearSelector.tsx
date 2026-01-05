import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { addYears, format } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useState } from "react";
import { Transaction } from "../../types";
import DownloadIcon from "@mui/icons-material/Download";

interface YearProps {
  currentYear: Date;
  setCurrentYear: React.Dispatch<React.SetStateAction<Date>>;
  onDeleteYear?: () => void;
  yearTransactions: Transaction[];
}

const YearSelector = ({
  currentYear,
  setCurrentYear,
  onDeleteYear,
  yearTransactions,
}: YearProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  //DatePicker内の日付をstateで管理
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setCurrentYear(newDate);
    }
  };

  //去年を取得
  const handlePreviousYear = () => {
    const previousYear = addYears(currentYear, -1);
    setCurrentYear(previousYear);
    // console.log(previousYear);
  };
  //来年を取得
  const handleNextYear = () => {
    const nextYear = addYears(currentYear, 1);
    setCurrentYear(nextYear);
  };

  //年削除ダイアログを開く
  const handleOpenDeleteDialog = () => {
    setOpenDialog(true);
  };

  //年削除ダイアログを閉じる
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //年削除の処理（確認後）
  const handleConfirmDelete = () => {
    if (onDeleteYear) {
      onDeleteYear();
      setOpenDialog(false);
    }
  };

  //CSVエクスポートの処理
  const handleExportCSV = () => {
    // CSVヘッダー
    const headers = ["日付", "種類", "カテゴリ", "内容", "金額"];

    // データをCSV形式に変換
    const csvRows = [
      headers.join(","),
      ...yearTransactions.map((transaction: Transaction) => {
        const type = transaction.type === "income" ? "収入" : "支出";
        return [
          transaction.date,
          type,
          transaction.category,
          `"${transaction.content.replace(/"/g, '""')}"`, // ダブルクォートをエスケープ
          transaction.amount.toString(),
        ].join(",");
      }),
    ];

    // CSV文字列を作成
    const csvContent = csvRows.join("\n");

    // BOMを追加してUTF-8でエンコード（Excelで正しく開くため）
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // ダウンロードリンクを作成
    const link = document.createElement("a");
    const yearStr = format(currentYear, "yyyy");
    link.href = URL.createObjectURL(blob);
    link.download = `家計簿_${yearStr}年.csv`;
    link.click();

    // メモリを解放
    URL.revokeObjectURL(link.href);
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
      dateFormats={{ year: "yyyy年" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* スマホの時：ボタン行（去年、来年、年削除） */}
        {isMobile ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                width: "100%",
              }}
            >
              <Button
                color={"error"}
                variant="contained"
                onClick={handlePreviousYear}
              >
                去年
              </Button>
              <Button
                color={"primary"}
                variant="contained"
                onClick={handleNextYear}
              >
                来年
              </Button>
              {onDeleteYear && (
                <Button
                  color={"error"}
                  variant="outlined"
                  onClick={handleOpenDeleteDialog}
                >
                  年削除
                </Button>
              )}
            </Box>
            <DatePicker
              onChange={handleDateChange}
              value={currentYear}
              label="年を選択"
              sx={{ width: "100%", background: "white", mt: 2 }}
              views={["year"]}
              format={`yyyy年`}
              slotProps={{
                toolbar: { toolbarFormat: "yyyy年", hidden: false },
              }}
            />
          </>
        ) : (
          <>
            {/* PCの時：横並び */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Button
                color={"error"}
                variant="contained"
                onClick={handlePreviousYear}
              >
                去年
              </Button>
              <DatePicker
                onChange={handleDateChange}
                value={currentYear}
                label="年を選択"
                sx={{ mx: 2, background: "white" }}
                views={["year"]}
                format={`yyyy年`}
                slotProps={{
                  toolbar: { toolbarFormat: "yyyy年", hidden: false },
                }}
              />
              <Button
                color={"primary"}
                variant="contained"
                onClick={handleNextYear}
              >
                来年
              </Button>
              {/* PCのみ表示：データ保存ボタン */}
              <Button
                color={"success"}
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExportCSV}
                disabled={yearTransactions.length === 0}
              >
                データ保存
              </Button>
              {onDeleteYear && (
                <Button
                  color={"error"}
                  variant="outlined"
                  onClick={handleOpenDeleteDialog}
                >
                  年削除
                </Button>
              )}
            </Box>
          </>
        )}
        {/* ダイアログ */}
        {onDeleteYear && (
          <>
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              aria-labelledby="delete-year-dialog-title"
              aria-describedby="delete-year-dialog-description"
            >
              <DialogTitle id="delete-year-dialog-title">
                年のデータを削除
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-year-dialog-description">
                  本当に削除してもいいですか？
                  <br />
                  選択されている年のすべての取引データが削除されます。
                  <br />
                  この操作は取り消せません。
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  キャンセル
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  color="error"
                  variant="contained"
                  autoFocus
                >
                  削除
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default YearSelector;
