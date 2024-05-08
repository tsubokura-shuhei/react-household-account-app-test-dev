import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
//アイコン
import NotesIcon from "@mui/icons-material/Notes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import DailySummary from "./DailySummary";
import { Transaction } from "../../types";
import { formatCurrency } from "../../utils/formatting";
import IconComponents from "./common/IconComponents";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import { format } from "date-fns";

interface TransactionMenuProps {
  dailyTransactions: Transaction[];
  currentDay: string;
  handleAddTransactionForm: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
  isMobile: boolean;
  isMobileDrawerOpen: boolean;
  handleCloseMobileDrawer: () => void;
}

const TransactionMenu = ({
  dailyTransactions,
  currentDay,
  handleAddTransactionForm,
  onSelectTransaction,
  isMobile,
  isMobileDrawerOpen,
  handleCloseMobileDrawer,
}: TransactionMenuProps) => {
  const menuDrawerWidth = 320;
  return (
    <Drawer
      sx={{
        width: isMobile ? "auto" : menuDrawerWidth,
        "& .MuiDrawer-paper": {
          width: isMobile ? "auto" : menuDrawerWidth,
          boxSizing: "border-box",
          p: 2,

          ...(isMobile && {
            height: "80vh",
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }),
          ...(!isMobile && {
            top: 64,
            height: `calc(100% - 64px)`, // AppBarの高さを引いたビューポートの高さ
          }),
        },
      }}
      variant={isMobile ? "temporary" : "permanent"}
      anchor={isMobile ? "bottom" : "right"}
      open={isMobileDrawerOpen}
      onClose={handleCloseMobileDrawer}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <Stack sx={{ height: "100%" }} spacing={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            fontWeight={"fontWeightBold"}
            sx={{ display: "flex", alignItems: "center" }}
          >
            日付： {currentDay}
          </Typography>
          {/* 閉じるボタン */}
          {isMobile ? (
            <>
              <IconButton
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
                onClick={handleCloseMobileDrawer}
              >
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <></>
          )}
        </Box>

        <DailySummary
          dailyTransactions={dailyTransactions}
          columns={isMobile ? 3 : 2}
        />
        {/* 内訳タイトル&内訳追加ボタン */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
          }}
        >
          {/* 左側のメモアイコンとテキスト */}
          <Box display="flex" alignItems="center">
            <NotesIcon sx={{ mr: 1 }} />
            <Typography variant="body1">内訳</Typography>
          </Box>
          {/* 右側の追加ボタン */}
          <Button
            startIcon={<AddCircleIcon />}
            color="primary"
            onClick={handleAddTransactionForm}
          >
            内訳を追加
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <List aria-label="取引履歴">
            <Stack spacing={2}>
              {dailyTransactions.map((transactionDate) => (
                <ListItem key={transactionDate.id} disablePadding>
                  <Card
                    sx={{
                      width: "100%",
                      backgroundColor:
                        transactionDate.type === "income"
                          ? (theme) => theme.palette.incomeColor.light
                          : (theme) => theme.palette.expenseColor.light,
                    }}
                    onClick={() => onSelectTransaction(transactionDate)}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                          wrap="wrap"
                        >
                          <Grid item xs={1}>
                            {/* icon */}

                            {IconComponents[transactionDate.category]}
                          </Grid>
                          <Grid item xs={2.5}>
                            <Typography
                              variant="caption"
                              display="block"
                              gutterBottom
                            >
                              {transactionDate.category}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" gutterBottom>
                              {transactionDate.content}
                            </Typography>
                          </Grid>
                          <Grid item xs={4.5}>
                            <Typography
                              gutterBottom
                              textAlign={"right"}
                              color="text.secondary"
                              sx={{
                                wordBreak: "break-all",
                              }}
                            >
                              ¥{formatCurrency(transactionDate.amount)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ListItem>
              ))}
            </Stack>
          </List>
        </Box>
      </Stack>
    </Drawer>
  );
};
export default TransactionMenu;
