import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { pitchesApi, bookingsApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/ui2/components/ui/use-toast";
import { PitchDetailsUI } from "@/ui/pitch-details";
import { Button } from "@/ui2/components/ui/Button";
import { Card, CardContent } from "@/ui2/components/ui/Card";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import { format } from "date-fns";
import { Home } from "lucide-react";

export function PitchDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["pitch", id],
    queryFn: () => pitchesApi.getById(id!),
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("pitchDetail.bookingSuccess"),
      });
      navigate("/me/bookings");
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message || t("pitchDetail.bookingError"),
        variant: "destructive",
      });
    },
  });

  const pitch = data?.data.data;

  const handleBook = () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    if (!selectedDate || !selectedTime || !id) {
      toast({
        title: t("common.error"),
        description: t("pitchDetail.selectDateAndTimeError"),
        variant: "destructive",
      });
      return;
    }

    bookingMutation.mutate({
      pitchId: id,
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime: selectedTime,
      durationMinutes: 60,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-purple-950/30 to-pink-950/20">
        <div className="container mx-auto max-w-7xl px-4 pt-28 md:pt-32 pb-12 md:pb-16">
          <Skeleton className="mb-8 h-6 w-48 rounded-xl" />
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Skeleton className="h-[600px] w-full rounded-3xl" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <Skeleton className="h-16 w-3/4 rounded-xl" />
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 mt-8">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950/30 to-pink-950/20">
        <div className="container mx-auto max-w-[1200px] px-4 py-6 relative z-10">
          <Card className="glass-neon-strong rounded-3xl">
            <CardContent className="py-16 text-center">
              <Home className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="mb-6 text-lg text-muted-foreground dark:text-gray-300">
                {t("pitchDetail.pitchNotFound")}
              </p>
              <Button onClick={() => navigate("/pitches")} size="lg">
                {t("pitchDetail.backToPitches")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <PitchDetailsUI
      pitch={{
        id: pitch.id,
        name: pitch.name,
        address: pitch.address,
        city: pitch.city,
        type: pitch.type,
        indoor: pitch.indoor,
        images: pitch.images,
        openTime: pitch.openTime,
        closeTime: pitch.closeTime,
        pricePerHour: pitch.pricePerHour,
        description: pitch.description,
      }}
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      onDateChange={setSelectedDate}
      onTimeSelect={setSelectedTime}
      onBook={handleBook}
      isBooking={bookingMutation.isPending}
      user={user}
      breadcrumbLabel={t("nav.pitches")}
    />
  );
}
