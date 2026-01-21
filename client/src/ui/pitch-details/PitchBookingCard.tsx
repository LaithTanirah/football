import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { SlotPicker } from "@/components/SlotPicker";
import { Button } from "@/ui2/components/ui/Button";
import { Card, CardContent } from "@/ui2/components/ui/Card";
import { cn } from "@/lib/utils";

interface PitchBookingCardProps {
  pitchId: string;
  pricePerHour: number;
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onBook: () => void;
  isBooking: boolean;
  user: any;
}

export function PitchBookingCard({
  pitchId,
  pricePerHour,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeSelect,
  onBook,
  isBooking,
  user,
}: PitchBookingCardProps) {
  const { t } = useTranslation();
  const { dir } = useDirection();

  return (
    <section 
      className="animate-fade-in-up"
      style={{ animationDelay: '200ms', animationDuration: '800ms' }}
      dir={dir}
    >
      <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/50 shadow-[0_0_50px_rgba(6,182,212,0.3),0_0_80px_rgba(236,72,153,0.2)] overflow-hidden relative">
        {/* Animated glow border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-pink-500/20 to-purple-500/20 opacity-50 animate-pulse -z-10" />
        
        <CardContent className="p-6">
          <SlotPicker
            pitchId={pitchId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={onDateChange}
            onTimeSelect={onTimeSelect}
          />
        </CardContent>

        {/* Booking Summary */}
        {selectedDate && selectedTime && (
          <div className="border-t border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 p-6 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-cyan-300" />
              <h3 className="font-semibold text-foreground text-lg">
                {t("pitchDetail.bookingSummary")}
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-900/40 p-4 border border-cyan-400/20 backdrop-blur-sm">
                <span className="text-sm text-muted-foreground dark:text-gray-300 font-medium">
                  {t("pitchDetail.date")}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {format(selectedDate, "PPP")}
                </span>
              </div>
              
              <div className="flex items-center justify-between rounded-xl bg-slate-900/40 p-4 border border-cyan-400/20 backdrop-blur-sm">
                <span className="text-sm text-muted-foreground dark:text-gray-300 font-medium">
                  {t("pitchDetail.availableTimes")}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {selectedTime}
                </span>
              </div>
              
              <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-cyan-500/25 to-cyan-500/15 p-5 border-2 border-cyan-400/50 backdrop-blur-sm">
                <span className="font-bold text-foreground text-base">
                  {t("pitchDetail.total")}
                </span>
                <span className="text-3xl font-black text-cyan-300">
                  {pricePerHour} {t("common.currency")}
                </span>
              </div>
            </div>

            <Button
              className={cn(
                "w-full h-14 text-base font-bold shadow-xl hover:shadow-2xl transition-all",
                "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700",
                "text-foreground border-2 border-cyan-400/50",
                "hover:scale-[1.02] active:scale-[0.98]"
              )}
              style={{
                animation: "glowPulse 2s ease-in-out infinite"
              }}
              size="lg"
              onClick={onBook}
              disabled={isBooking}
            >
              {isBooking ? (
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5 animate-spin" />
                  {t("pitchDetail.booking")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t("pitchDetail.confirmBooking")}
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
}
