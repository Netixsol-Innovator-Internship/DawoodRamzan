"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface DateRangePickerProps {
  onDateRangeChange?: (range: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
}

type Value = [Date | null, Date | null];

const DateRangePicker = ({ onDateRangeChange }: DateRangePickerProps) => {
  const [value, setValue] = useState<Value>([
    new Date(2025, 0, 1),
    new Date(2025, 8, 5),
  ]);
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date: Date | null) =>
    date ? format(date, "MMM d, yyyy") : "";

  const handleDateChange = (newValue: Value) => {
    setValue(newValue);

    if (newValue[0] && newValue[1]) {
      setShowCalendar(false);
      onDateRangeChange?.({
        startDate: newValue[0],
        endDate: newValue[1],
      });
    }
  };

  const getDisplayText = () => {
    const [start, end] = value;
    return start && end
      ? `${formatDate(start)} - ${formatDate(end)}`
      : "Select date range";
  };

  return (
    <div className="relative">
      <div
        className="font-open-sans font-semibold text-base text-black cursor-pointer flex items-center gap-x-2"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <CalendarDays />
        {getDisplayText()}
      </div>

      {showCalendar && (
        <div className="absolute z-10 mt-1 right-1 bg-white rounded-lg shadow-lg">
          <Calendar
            onChange={(val) => handleDateChange(val as Value)}
            value={value}
            selectRange
            minDate={new Date(2025, 0, 1)}
            maxDate={new Date(2025, 7, 31)}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
