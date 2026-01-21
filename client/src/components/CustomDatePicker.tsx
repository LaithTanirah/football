import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import styles from "./CustomDatePicker.module.css";

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  onClose?: () => void;
  anchorElement?: HTMLElement | null;
}

export function CustomDatePicker({
  selectedDate,
  onDateChange,
  minDate = new Date(),
  onClose,
  anchorElement,
}: CustomDatePickerProps) {
  const { t } = useTranslation();
  const { dir, isRTL } = useDirection();
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const pickerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const daysInMonth = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weekDays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const weekDaysRTL = ['س', 'ج', 'ث', 'أ', 'إ', 'ح', 'ن'];

  const handleDateClick = (date: Date) => {
    if (date < minDate && !isSameDay(date, minDate)) {
      return;
    }
    onDateChange(date);
    onClose?.();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateChange(today);
    onClose?.();
  };

  const handleClear = () => {
    // Don't clear, just close - clearing would break the booking flow
    onClose?.();
  };

  // Calculate position relative to anchor element
  useEffect(() => {
    if (anchorElement && pickerRef.current) {
      const rect = anchorElement.getBoundingClientRect();
      const pickerHeight = 400; // Approximate height
      const pickerWidth = 320;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      let top = rect.bottom + 8;
      let left = rect.left;
      
      // Adjust if would go off bottom of screen
      if (top + pickerHeight > viewportHeight) {
        top = rect.top - pickerHeight - 8;
      }
      
      // Adjust if would go off right side
      if (left + pickerWidth > viewportWidth) {
        left = viewportWidth - pickerWidth - 16;
      }
      
      // Adjust if would go off left side
      if (left < 16) {
        left = 16;
      }
      
      // For RTL, adjust from right
      if (isRTL) {
        left = rect.right - pickerWidth;
        if (left < 16) {
          left = viewportWidth - pickerWidth - 16;
        }
      }
      
      setPosition({ top, left });
    }
  }, [anchorElement, isRTL]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        if (anchorElement && !anchorElement.contains(event.target as Node)) {
          onClose?.();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorElement]);

  const calendarContent = (
    <div 
      ref={pickerRef}
      className={styles.calendarPopup}
      dir={dir}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Header */}
      <div className={styles.calendarHeader}>
        {isRTL ? (
          <>
            <button
              onClick={handleNextMonth}
              className={styles.navButton}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className={styles.monthYear}>
              <span className={styles.monthYearText}>
                {format(currentMonth, "MMMM yyyy")}
              </span>
            </div>
            <button
              onClick={handlePrevMonth}
              className={styles.navButton}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handlePrevMonth}
              className={styles.navButton}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className={styles.monthYear}>
              <span className={styles.monthYearText}>
                {format(currentMonth, "MMMM yyyy")}
              </span>
            </div>
            <button
              onClick={handleNextMonth}
              className={styles.navButton}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Week Days */}
      <div className={styles.weekDays}>
        {(isRTL ? weekDaysRTL : weekDays).map((day, index) => (
          <div key={index} className={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendarGrid}>
        {daysInMonth.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const isDisabled = date < minDate && !isSameDay(date, minDate);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={cn(
                styles.dateCell,
                !isCurrentMonth && styles.dateCellOtherMonth,
                isSelected && styles.dateCellSelected,
                isTodayDate && !isSelected && styles.dateCellToday,
                isDisabled && styles.dateCellDisabled
              )}
            >
              <span className={styles.dateNumber}>
                {format(date, "d")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className={styles.calendarFooter}>
        <button
          onClick={handleClear}
          className={styles.footerButton}
        >
          <X className="h-3.5 w-3.5" />
          <span>{t("common.clear", "Clear")}</span>
        </button>
        <button
          onClick={handleToday}
          className={cn(styles.footerButton, styles.footerButtonPrimary)}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>{t("common.today", "Today")}</span>
        </button>
      </div>
    </div>
  );

  // Render in portal to escape card overflow constraints
  return createPortal(calendarContent, document.body);
}
