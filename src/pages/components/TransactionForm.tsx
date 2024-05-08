import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import FastfoodIcon from "@mui/icons-material/Fastfood"; //食事アイコン
import AlarmIcon from "@mui/icons-material/Alarm";
import AddHomeIcon from "@mui/icons-material/AddHome";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import MedicationIcon from "@mui/icons-material/Medication";
import WorkIcon from "@mui/icons-material/Work";
import SavingsIcon from "@mui/icons-material/Savings";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { watch } from "fs";
import { ExpenseCategory, IncomeCategory, Transaction } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schema, transactionScheme } from "../../validations/schema";
import CreditCardSharpIcon from "@mui/icons-material/CreditCardSharp";
import EnhancedEncryptionSharpIcon from "@mui/icons-material/EnhancedEncryptionSharp";

import CheckroomIcon from "@mui/icons-material/Checkroom";
import TungstenIcon from "@mui/icons-material/Tungsten";
import EvStationIcon from "@mui/icons-material/EvStation";
import YardIcon from "@mui/icons-material/Yard";
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';

interface transactionProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  selectedTransaction: Transaction | null;
  onDeleteTransaction: (
    transactionId: string | readonly string[]
  ) => Promise<void>;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  onUpdateTransaction: (
    transaction: Schema,
    transactionId: string
  ) => Promise<void>;
  isMobile: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type IncomeExpense = "income" | "expense";

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element;
}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  onSaveTransaction,
  selectedTransaction,
  onDeleteTransaction,
  setSelectedTransaction,
  onUpdateTransaction,
  isMobile,
  isDialogOpen,
  setIsDialogOpen,
}: transactionProps) => {
  const formWidth = 320;

  const expenseCategories: CategoryItem[] = [
    { label: "食費", icon: <FastfoodIcon fontSize="small" /> },
    { label: "日用品", icon: <AlarmIcon fontSize="small" /> },
    { label: "住居費", icon: <AddHomeIcon fontSize="small" /> },
    { label: "交際費", icon: <Diversity3Icon fontSize="small" /> },
    { label: "娯楽", icon: <SportsTennisIcon fontSize="small" /> },
    { label: "雑貨", icon: <TableRestaurantIcon fontSize="small" /> },
    { label: "交通費", icon: <TrainIcon fontSize="small" /> },
    { label: "医療費", icon: <MedicationIcon fontSize="small" /> },
    { label: "化粧品", icon: <AutoFixHighIcon fontSize="small" /> },
    { label: "カード払い", icon: <CreditCardSharpIcon fontSize="small" /> },
    { label: "保険類", icon: <EnhancedEncryptionSharpIcon fontSize="small" /> },
    { label: "衣類", icon: <CheckroomIcon fontSize="small" /> },
    { label: "光熱費", icon: <TungstenIcon fontSize="small" /> },
    { label: "農業経費", icon: <YardIcon fontSize="small" /> },
  ];

  const incomeCategories: CategoryItem[] = [
    { label: "給与", icon: <WorkIcon fontSize="small" /> },
    { label: "副収入", icon: <AddBusinessIcon fontSize="small" /> },
    { label: "お小遣い", icon: <SavingsIcon fontSize="small" /> },
  ];

  const [categories, setCategories] = useState(expenseCategories);

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Schema>({
    defaultValues: {
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: "",
    },
    resolver: zodResolver(transactionScheme),
  });

  // console.log(errors, "：エラーメッセージ");

  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue("type", type);
    setValue("category", "");
  };

  const currentType = watch("type");
  // console.log(currentType);

  useEffect(() => {
    const newCategories =
      currentType === "expense" ? expenseCategories : incomeCategories;
    setCategories(newCategories);
  }, [currentType]);

  useEffect(() => {
    setValue("date", currentDay);
  }, [currentDay]);

  //送信処理
  const onSubmin: SubmitHandler<Schema> = (data) => {
    // console.log(data);

    //データの更新
    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
        .then(() => {
          // console.log("更新が完了しました。");
          setSelectedTransaction(null);
          if (isMobile) {
            setIsDialogOpen(false);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      onSaveTransaction(data)
        .then(() => {
          console.log("保存しました。");
        })
        .catch((error) => {
          console.error(error);
        });
    }
    reset({
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: "",
    });
  };

  const handleDeleate = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id);
      if (isMobile) {
        setIsDialogOpen(false);
      }
      setSelectedTransaction(null);
    }
  };

  useEffect(() => {
    //カテゴリの選択肢が更新されたか確認
    if (selectedTransaction) {
      const categoryExists = categories.some(
        (category) => category.label === selectedTransaction.category
      );
      // console.log(categories, "categories");
      // console.log(categoryExists, "categoryExists");
      setValue("category", categoryExists ? selectedTransaction.category : "");
    }
  }, [selectedTransaction, categories]);

  useEffect(() => {
    if (selectedTransaction) {
      setValue("type", selectedTransaction.type);
      setValue("date", selectedTransaction.date);
      setValue("amount", selectedTransaction.amount);
      setValue("content", selectedTransaction.content);
    } else {
      reset({
        type: "expense",
        date: currentDay,
        amount: 0,
        category: "",
        content: "",
      });
    }
  }, [selectedTransaction]);

  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={onCloseForm}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={"form"} onSubmit={handleSubmit(onSubmin)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              return (
                <ButtonGroup fullWidth>
                  <Button
                    variant={
                      field.value === "expense" ? "contained" : "outlined"
                    }
                    color="error"
                    onClick={() => incomeExpenseToggle("expense")}
                  >
                    支出
                  </Button>
                  <Button
                    onClick={() => incomeExpenseToggle("income")}
                    color="primary"
                    variant={
                      field.value === "income" ? "contained" : "outlined"
                    }
                  >
                    収入
                  </Button>
                </ButtonGroup>
              );
            }}
          />

          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              // <TextField
              //   error={!!errors.category}
              //   helperText={errors.category?.message}
              //   InputLabelProps={{
              //     htmlFor: "category",
              //   }}
              //   inputProps={{ id: "category" }}
              //   {...field}
              //   id="カテゴリ"
              //   label="カテゴリ"
              //   select
              // >
              //   {categories.map((categorie, index) => (
              //     <MenuItem key={index} value={categorie.label}>
              //       <ListItemIcon>{categorie.icon}</ListItemIcon>
              //       {categorie.label}
              //     </MenuItem>
              //   ))}
              // </TextField>

              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-select-label">カテゴリ</InputLabel>
                <Select
                  {...field}
                  labelId="category-select-label"
                  id="type-select"
                  label="カテゴリ"
                >
                  {categories.map((categorie, index) => (
                    <MenuItem key={index} value={categorie.label}>
                      <ListItemIcon>{categorie.icon}</ListItemIcon>
                      {categorie.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.category?.message}</FormHelperText>
              </FormControl>
            )}
          />
          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => {
              // console.log(field);
              return (
                <TextField
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  {...field}
                  value={field.value === 0 ? "" : field.value}
                  onChange={(e) => {
                    const newValue = parseInt(e.target.value, 10) || 0;
                    field.onChange(newValue);
                  }}
                  label="金額"
                  type="number"
                />
              );
            }}
          />
          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.content}
                helperText={errors.content?.message}
                label="内容"
                type="text"
              />
            )}
          />
          {/* 保存ボタン */}
          <Button
            type="submit"
            variant="contained"
            color={currentType === "income" ? "primary" : "error"}
            fullWidth
          >
            {selectedTransaction ? "更新" : "保存"}
          </Button>
          {/* 削除ボタン */}
          {selectedTransaction && (
            <Button
              onClick={() => handleDeleate()}
              variant="outlined"
              color={"secondary"}
              fullWidth
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          {/* mobile */}
          <Dialog
            open={isDialogOpen}
            onClose={onCloseForm}
            fullWidth
            maxWidth={"sm"}
          >
            <DialogContent>{formContent}</DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          {/* PC */}
          <Box
            sx={{
              position: "fixed",
              top: 64,
              right: isEntryDrawerOpen ? formWidth : "-2%", // フォームの位置を調整
              width: formWidth,
              height: "100%",
              bgcolor: "background.paper",
              zIndex: (theme) => theme.zIndex.drawer - 1,
              transition: (theme) =>
                theme.transitions.create("right", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              p: 2, // 内部の余白
              boxSizing: "border-box", // ボーダーとパディングをwidthに含める
              boxShadow: "0px 0px 15px -5px #777777",
            }}
          >
            {formContent}
          </Box>
        </>
      )}
    </>
  );
};
export default TransactionForm;
