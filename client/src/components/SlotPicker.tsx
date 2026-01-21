import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { pitchesApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useDirection } from "@/hooks/useDirection";
import { Button } from "@/ui2/components/ui/Button";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomDatePicker } from "./CustomDatePicker";
import styles from "./SlotPicker.module.css";

interface SlotPickerProps {
  pitchId: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

export function SlotPicker({
  pitchId,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeSelect,
}: SlotPickerProps) {
  const { t } = useTranslation();
  const { dir } = useDirection();
  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  
  // Format date for display in input
  const getFormattedDateDisplay = () => {
    if (!selectedDate) return "";
    return format(selectedDate, "MMM d, yyyy");
  };
  const chipRailRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["availability", pitchId, dateString],
    queryFn: () => pitchesApi.getAvailability(pitchId, dateString!),
    enabled: !!dateString,
  });

  useEffect(() => {
    if (dateString) {
      refetch();
    }
  }, [dateString, refetch]);

  const availableSlots = data?.data.data.availableSlots || [];

  // Generate next 7 days for quick selection
  const quickDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return t("common.today", "Today");
    if (isTomorrow(date)) return t("common.tomorrow", "Tomorrow");
    return format(date, "EEE, MMM d");
  };

  const getSelectedDateDisplay = () => {
    if (!selectedDate) return null;
    if (isToday(selectedDate)) return t("common.today", "Today");
    if (isTomorrow(selectedDate)) return t("common.tomorrow", "Tomorrow");
    return format(selectedDate, "EEEE, MMMM d, yyyy");
  };

  // Scroll selected chip into view and update fade edges
  useEffect(() => {
    const updateFadeEdges = () => {
      if (!chipRailRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = chipRailRef.current;
      setShowLeftFade(scrollLeft > 10);
      setShowRightFade(scrollLeft < scrollWidth - clientWidth - 10);
    };

    if (selectedDate && chipRailRef.current) {
      const selectedChip = chipRailRef.current.querySelector('[data-selected="true"]') as HTMLElement;
      if (selectedChip) {
        selectedChip.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }

    updateFadeEdges();
    const rail = chipRailRef.current;
    if (rail) {
      rail.addEventListener('scroll', updateFadeEdges);
      window.addEventListener('resize', updateFadeEdges);
      return () => {
        rail.removeEventListener('scroll', updateFadeEdges);
        window.removeEventListener('resize', updateFadeEdges);
      };
    }
  }, [selectedDate]);

  return (
    <div className={styles.bookingCard} dir={dir}>
      {/* Header Row */}
      <header className={styles.bookingHeader}>
        <div className={styles.headerContent}>
          <h3 className={styles.headerTitle}>
            {t("pitchDetail.bookThisPitch")}
          </h3>
          <p className={styles.headerSubtitle}>
            {t("pitchDetail.selectDate", "Select Date")}
          </p>
          {selectedDate && (
            <div className={styles.selectedPill}>
              <Calendar className={styles.selectedPillIcon} />
              <span>{getSelectedDateDisplay()}</span>
            </div>
          )}
        </div>
        <div className={styles.headerIcon}>
          <Calendar className="h-5 w-5 text-cyan-300" />
        </div>
      </header>

      {/* Quick Dates Rail */}
      <div 
        className={cn(
          styles.chipRail,
          !showLeftFade && !showRightFade && styles.chipRailFadeHidden
        )}
      >
        <div
          ref={chipRailRef}
          className={styles.chipRailContainer}
        >
          {quickDates.map((date) => {
            const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
            const dateKey = format(date, "yyyy-MM-dd");
            
            return (
              <button
                key={dateKey}
                data-selected={isSelected}
                onClick={() => {
                  onDateChange(date);
                  onTimeSelect("");
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onDateChange(date);
                    onTimeSelect("");
                  }
                }}
                aria-pressed={isSelected}
                className={cn(
                  styles.chip,
                  isSelected && styles.chipActive
                )}
              >
                <span className={styles.chipDayName}>
                  {format(date, "EEE")}
                </span>
                <span className={styles.chipDayNumber}>
                  {format(date, "d")}
                </span>
                <span className={styles.chipMonth}>
                  {format(date, "MMM")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <hr className={styles.divider} />

      {/* Manual Date Input */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>
          {t("pitchDetail.orSelectCustomDate", "Or pick a custom date")}
        </label>
        <div className={styles.inputWrap} style={{ position: 'relative' }} ref={inputRef}>
          {selectedDate && !showCustomPicker && (
            <span className={styles.inputDisplayValue}>
              {getFormattedDateDisplay()}
            </span>
          )}
          <input
            type="text"
            readOnly
            value={selectedDate ? getFormattedDateDisplay() : ""}
            onClick={() => setShowCustomPicker(true)}
            onFocus={() => setShowCustomPicker(true)}
            className={styles.input}
            placeholder={t("pitchDetail.selectDate", "Select Date")}
          />
          <button
            type="button"
            onClick={() => setShowCustomPicker(!showCustomPicker)}
            className={styles.inputIconBtn}
            aria-label="Open calendar"
          >
            <Calendar className="h-4 w-4" />
          </button>
          {showCustomPicker && inputRef.current && (
            <CustomDatePicker
              selectedDate={selectedDate}
              onDateChange={(date) => {
                onDateChange(date);
                onTimeSelect("");
                setShowCustomPicker(false);
              }}
              minDate={new Date()}
              onClose={() => setShowCustomPicker(false)}
              anchorElement={inputRef.current}
            />
          )}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div style={{ marginBlockStart: '24px' }}>
          <label className="mb-3 block text-sm font-semibold text-foreground">
            <Clock className="mr-2 inline h-4 w-4" />
            {t("pitchDetail.selectTime", "Select Time")}
            {selectedDate && (
              <span className="ml-2 text-xs font-normal text-muted-foreground dark:text-gray-300">
                ({getDateLabel(selectedDate)})
              </span>
            )}
          </label>
          
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="glass-neon-subtle rounded-xl border border-dashed border-cyan-400/15 p-8 text-center">
              <Clock className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                {t("pitchDetail.noSlotsAvailable")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70 dark:text-gray-400">
                {t("pitchDetail.tryAnotherDate", "Try selecting another date")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => onTimeSelect(slot)}
                      className={cn(
                        "group relative flex flex-col items-center justify-center gap-1 rounded-xl border-2 px-3 py-3 transition-all",
                        "hover:scale-105 hover:shadow-lg",
                        isSelected
                          ? "border-cyan-400/25 bg-cyan-500/15 text-foreground shadow-md ring-1 ring-cyan-400/15"
                          : "border-cyan-400/15 bg-glass-bg hover:border-cyan-400/20 hover:bg-cyan-500/10 hover:shadow-sm text-foreground"
                      )}
                    >
                      {isSelected && (
                        <CheckCircle2 className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-cyan-400 text-foreground shadow-soft" />
                      )}
                      <span className="text-lg font-bold">{slot}</span>
                      <span className="text-xs opacity-70">
                        {t("pitchDetail.hour", "hour")}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-xs text-muted-foreground dark:text-gray-300">
                {availableSlots.length} {t("pitchDetail.slotsAvailable", "slots available")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
