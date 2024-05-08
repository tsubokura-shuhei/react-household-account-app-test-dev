import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import "../../calendar.css";
import { DatesSetArg, EventContentArg } from "@fullcalendar/core";
import { calculateDailyBalances } from "../../utils/financeCalculations";
import { Balance, CalendarContent, Transaction } from "../../types";
import { formatCurrency } from "../../utils/formatting";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useTheme } from "@mui/material";
import { isSameMonth } from "date-fns";
import { Height } from "@mui/icons-material";

interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  today: string;
  handleDateClick: (dateInfo: DateClickArg) => void;
}

const Calendar = ({
  monthlyTransactions,
  setCurrentMonth,
  setCurrentDay,
  currentDay,
  today,
  handleDateClick,
}: CalendarProps) => {
  const theme = useTheme();

  const events = [
    // { title: "Meeting", start: new Date() },
    { title: "Meeting", start: "2024-03-06" },
    {
      title: "sleeping",
      start: "2024-03-12",
      income: 300,
      expense: 200,
      balance: 100,
    },
  ];

  //日付ごとの支出を算出
  const dailyBalances = calculateDailyBalances(monthlyTransactions);
  // console.log(dailyBalances);

  //2.FullCalendar用のイベントを生成する関数
  const createCalendarEvents = (
    dailyBalances: Record<string, Balance>
  ): CalendarContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };

  const calendarEvents = createCalendarEvents(dailyBalances);

  const backgroundEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light,
  };

  const renderEvent = (eventInfo: EventContentArg) => {
    return (
      <div>
        <div className="money" id="event-income">
          {eventInfo.event.extendedProps.income}
        </div>
        <div className="money" id="event-expense">
          {eventInfo.event.extendedProps.expense}
        </div>
        <div className="money" id="event-balance">
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    );
  };

  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart;

    setCurrentMonth(datesetInfo.view.currentStart);

    //今日の日付のデータを取得
    const todayDate = new Date();
    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    }
    setCurrentDay(today);
  };

  return (
    <FullCalendar
      locale={jaLocale}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[...calendarEvents, backgroundEvent]}
      eventContent={renderEvent}
      datesSet={handleDateSet}
      dateClick={handleDateClick}
      contentHeight="auto"
    />
  );
};

export default Calendar;
