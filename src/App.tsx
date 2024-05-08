import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Yearly from "./pages/Yearly";

import NoMatch from "./pages/NoMatch";
import AppLayout from "./pages/components/layout/AppLayout";
import { theme } from "./theme/theme";
import { ThemeProvider } from "@emotion/react";
import {
  CssBaseline,
  selectClasses,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Transaction, Year } from "./types/index";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { formatMonth, formatMonthly, formatYear } from "./utils/formatting";
import { Schema } from "./validations/schema";

function App() {
  //取引データを管理
  const [transaction, setTransaction] = useState<Transaction[]>([]);

  // 今月のデータを管理するState
  const [currentMonth, setCurrentMonth] = useState(new Date());

  //年間のデータを管理するState
  const [currentYear, setCurrentYear] = useState(new Date());

  //ローディング管理
  const [isLoading, setIsLoading] = useState(true);

  //firebaseエラーかどうかを判定する型ガード
  function isFireStoreError(
    err: unknown
  ): err is { code: string; message: string } {
    return typeof err === "object" && err !== null && "code" in err;
  }

  useEffect(() => {
    try {
      //firebaseのfirestoreからデータを全てのデータを取得する
      const allDate = async () => {
        const querySnapshot = await getDocs(collection(db, "Transactions"));
        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction;
        });
        // console.log(transactionsData);
        setTransaction(transactionsData);
      };
      allDate();
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("Firebaseに関するエラーは:", err);
        console.error("Firebaseのエラーメッセージは:", err.message);
        console.error("Firebaseのエラーコードは:", err.code);
      } else {
        console.error("一般的なエラーは:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  //今月のデータを取得
  const monthlyTransactions = transaction.filter((allDate) => {
    return allDate.date.startsWith(formatMonth(currentMonth));
  });
  // console.log(monthlyTransactions, "選択した月の金額リスト");
  // console.log(currentMonth, "選択中の月");
  // console.log(transaction, "年間の金額リスト");
  // console.log(formatMonth(currentMonth));

  //今年のデータを取得
  const yearTransactions = transaction.filter((allData) => {
    return allData.date.startsWith(formatYear(currentYear));
  });

  //取引を保存する処理
  const handleSaveTransaction = async (transactionData: Schema) => {
    try {
      // firestoreにデータを保存
      const docRef = await addDoc(collection(db, "Transactions"), {
        ...transactionData,
      });
      // console.log("Document written with ID: ", docRef.id);

      const newTransaction = {
        id: docRef.id,
        ...transactionData,
      } as Transaction;
      // console.log(newTransaction);
      setTransaction((prevTransaction) => [...prevTransaction, newTransaction]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("Firebaseに関するエラーは:", err);
        console.error("Firebaseのエラーメッセージは:", err.message);
        console.error("Firebaseのエラーコードは:", err.code);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    //firestoreのデータを削除
    try {
      //配列でデータを管理する
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];

      for (const id of idsToDelete) {
        await deleteDoc(doc(db, "Transactions", id));
      }

      //画面上にすぐに反映させる
      // const filterdTransactions = transaction.filter(
      //   (transactionDeleteDate) => transactionDeleteDate.id !== transactionId
      // );
      const filterdTransactions = transaction.filter(
        (transactionDeleteDate) =>
          !idsToDelete.includes(transactionDeleteDate.id)
      );

      setTransaction(filterdTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("Firebaseに関するエラーは:", err);
        console.error("Firebaseのエラーメッセージは:", err.message);
        console.error("Firebaseのエラーコードは:", err.code);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  const handleUpdateTransaction = async (
    transactionUpdata: Schema,
    transactionId: string
  ) => {
    try {
      //firestore更新処理
      const docRef = doc(db, "Transactions", transactionId);
      await updateDoc(docRef, transactionUpdata);

      //即反映の処理
      const updatedTransactions = transaction.map((t) =>
        t.id === transactionId ? { ...t, ...transactionUpdata } : t
      ) as Transaction[];

      setTransaction(updatedTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error("Firebaseに関するエラーは:", err);
        console.error("Firebaseのエラーメッセージは:", err.message);
        console.error("Firebaseのエラーコードは:", err.code);
      } else {
        console.error("一般的なエラーは:", err);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* ホーム */}
          <Route path="/" element={<AppLayout />}>
            <Route
              index
              element={
                <Home
                  monthlyTransactions={monthlyTransactions}
                  setCurrentMonth={setCurrentMonth}
                  onSaveTransaction={handleSaveTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                />
              }
            />
            {/* 月々の合計 */}
            <Route
              path="/report"
              element={
                <Report
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  monthlyTransactions={monthlyTransactions}
                  isLoading={isLoading}
                  onDeleteTransaction={handleDeleteTransaction}
                  transaction={transaction}
                  currentYear={currentYear}
                />
              }
            />
            {/* 年間の合計 */}
            <Route
              path="/yearly"
              element={
                <Yearly
                  currentYear={currentYear}
                  setCurrentYear={setCurrentYear}
                  isLoading={isLoading}
                  onDeleteTransaction={handleDeleteTransaction}
                  yearTransactions={yearTransactions}
                  monthlyTransactions={monthlyTransactions}
                  transaction={transaction}
                />
              }
            />
            {/* ページが存在しない場合 */}
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
