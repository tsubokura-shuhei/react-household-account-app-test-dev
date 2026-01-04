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
import { addMonths, startOfMonth } from "date-fns";
import { ja } from "date-fns/locale";
import React, { useState } from "react";

interface MonthProps {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onDeleteMonth?: () => void;
}

const MonthSelector = ({
  currentMonth,
  setCurrentMonth,
  onDeleteMonth,
}: MonthProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  //DatePicker内の日付をstateで管理
  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setCurrentMonth(newDate);
    }
  };

  //先月を取得
  const handlePreviousMonth = () => {
    const previousMonth = addMonths(currentMonth, -1);
    setCurrentMonth(previousMonth);
  };
  //次月を取得
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
  };

  //今日の月に戻る
  const handleToday = () => {
    setCurrentMonth(startOfMonth(new Date()));
  };

  //月削除ダイアログを開く
  const handleOpenDeleteDialog = () => {
    setOpenDialog(true);
  };

  //月削除ダイアログを閉じる
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //月削除の処理（確認後）
  const handleConfirmDelete = () => {
    if (onDeleteMonth) {
      onDeleteMonth();
      setOpenDialog(false);
    }
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
      dateFormats={{ monthAndYear: "yyyy年 MM月" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* スマホの時：ボタン行（先月、次月、今日、月削除） */}
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
                onClick={handlePreviousMonth}
              >
                先月
              </Button>
              <Button color={"primary"} variant="contained" onClick={handleNextMonth}>
                次月
              </Button>
              <Button
                color={"success"}
                variant="contained"
                onClick={handleToday}
              >
                今日
              </Button>
              {onDeleteMonth && (
                <Button
                  color={"error"}
                  variant="outlined"
                  onClick={handleOpenDeleteDialog}
                >
                  月削除
                </Button>
              )}
            </Box>
            <DatePicker
              onChange={handleDateChange}
              value={currentMonth}
              label="年月を選択"
              sx={{ width: "100%", background: "white", mt: 2 }}
              views={["year", "month"]}
              format="yyyy/MM"
              slotProps={{ toolbar: { toolbarFormat: "yyyy/MM", hidden: false } }}
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
                onClick={handlePreviousMonth}
              >
                先月
              </Button>
              <DatePicker
                onChange={handleDateChange}
                value={currentMonth}
                label="年月を選択"
                sx={{ mx: 2, background: "white" }}
                views={["year", "month"]}
                format="yyyy/MM"
                slotProps={{ toolbar: { toolbarFormat: "yyyy/MM", hidden: false } }}
              />
              <Button color={"primary"} variant="contained" onClick={handleNextMonth}>
                次月
              </Button>
              <Button
                color={"success"}
                variant="contained"
                onClick={handleToday}
              >
                今日
              </Button>
              {onDeleteMonth && (
                <Button
                  color={"error"}
                  variant="outlined"
                  onClick={handleOpenDeleteDialog}
                >
                  月削除
                </Button>
              )}
            </Box>
          </>
        )}
        {/* ダイアログ */}
        {onDeleteMonth && (
          <>
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-description"
            >
              <DialogTitle id="delete-dialog-title">
                月のデータを削除
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-dialog-description">
                  本当に削除してもいいですか？
                  <br />
                  選択されている月のすべての取引データが削除されます。
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

export default MonthSelector;
