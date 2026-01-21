import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { bookingsApi } from "@/lib/api";
import { useToast } from "@/ui2/components/ui/use-toast";
import { Button } from "@/ui2/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";
import { Badge } from "@/ui2/components/ui/Badge";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui2/components/ui/Dialog";
import { EmptyState } from "@/components/EmptyState";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { format, isPast, parseISO } from "date-fns";
import { Calendar, Clock, MapPin, X, ExternalLink, Trash2 } from "lucide-react";

export function MyBookings() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["myBookings"],
    queryFn: () => bookingsApi.getMyBookings(),
  });

  const cancelMutation = useMutation({
    mutationFn: bookingsApi.cancel,
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("bookings.cancelSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description: error.response?.data?.message || t("bookings.cancelError"),
        variant: "destructive",
      });
    },
  });

  const bookings = data?.data.data || [];

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const upcomingBookings: any[] = [];
    const pastBookings: any[] = [];

    bookings.forEach((booking: any) => {
      const bookingDateTime = parseISO(`${booking.date}T${booking.startTime}`);
      if (
        isPast(bookingDateTime) ||
        booking.status === "CANCELLED" ||
        booking.status === "COMPLETED"
      ) {
        pastBookings.push(booking);
      } else {
        upcomingBookings.push(booking);
      }
    });

    return {
      upcoming: upcomingBookings.sort((a, b) => {
        const dateA = parseISO(`${a.date}T${a.startTime}`);
        const dateB = parseISO(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      }),
      past: pastBookings.sort((a, b) => {
        const dateA = parseISO(`${a.date}T${a.startTime}`);
        const dateB = parseISO(`${b.date}T${b.startTime}`);
        return dateB.getTime() - dateA.getTime();
      }),
    };
  }, [bookings]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success">{t("bookings.confirmed")}</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">{t("bookings.cancelled")}</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">{t("bookings.completed")}</Badge>;
      case "PENDING":
        return <Badge variant="outline">{t("bookings.pending")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelMutation.mutate(bookingToCancel);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-[1200px] px-4 py-6 relative">
        <Skeleton className="mb-6 h-8 w-48 rounded-xl" />
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 rounded-xl" />
                <Skeleton className="mt-2 h-4 w-32 rounded-xl" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-6 relative">
      {/* Floating Football Spheres */}
      <div className="football-sphere" style={{ top: '8%', right: '5%', animationDelay: '0s', width: '120px', height: '120px' }} />
      <div className="football-sphere" style={{ bottom: '10%', left: '8%', animationDelay: '6s', width: '100px', height: '100px' }} />
      
      <div className="relative z-10">
        <Breadcrumbs items={[{ label: t("bookings.title") }]} className="mb-6" />

        <div className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 p-6 mb-8 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <h1 className="text-3xl font-bold text-foreground">{t("bookings.title")}</h1>
        </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-12 w-12" />}
          title={t("bookings.noBookingsYet")}
          description={t("bookings.noBookingsDesc")}
          action={{
            label: t("bookings.browsePitches"),
            href: "/pitches",
          }}
        />
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                {t("bookings.upcomingBookings")}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {upcoming.map((booking: any) => (
                  <Card
                    key={booking.id}
                    className="glass-neon-strong rounded-2xl border-2 border-cyan-400/20 hover:border-cyan-400/40 transition-all overflow-hidden hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    {booking.pitch?.images?.[0] && (
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={booking.pitch.images[0]}
                          alt={booking.pitch.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle>
                          {booking.pitch?.name || "Unknown Pitch"}
                        </CardTitle>
                        {getStatusBadge(booking.status)}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {booking.pitch?.city}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(booking.date), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {booking.startTime} ({booking.durationMinutes} min)
                          </span>
                        </div>
                        {booking.pitch && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                              {booking.pitch.type || (booking.pitch.indoor ? t("pitches.indoor") : t("pitches.outdoor"))}
                            </span>
                            <span>•</span>
                            <span>{booking.pitch.pricePerHour} {t("pitches.pricePerHour")}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      {booking.pitch && (
                        <Link
                          to={`/pitches/${booking.pitch.id}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t("pitches.title")}
                          </Button>
                        </Link>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelClick(booking.id)}
                          disabled={cancelMutation.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("common.cancel")}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                {t("bookings.pastBookings")}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {past.map((booking: any) => (
                  <Card
                    key={booking.id}
                    className="glass-neon-subtle rounded-2xl border-2 border-cyan-400/10 overflow-hidden opacity-75"
                  >
                    {booking.pitch?.images?.[0] && (
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={booking.pitch.images[0]}
                          alt={booking.pitch.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle>
                          {booking.pitch?.name || "Unknown Pitch"}
                        </CardTitle>
                        {getStatusBadge(booking.status)}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {booking.pitch?.city}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(booking.date), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.startTime}</span>
                        </div>
                      </div>
                    </CardContent>
                    {booking.pitch && (
                      <CardFooter>
                        <Link
                          to={`/pitches/${booking.pitch.id}`}
                          className="w-full"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            {t("pitches.title")}
                          </Button>
                        </Link>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("bookings.cancelBooking")}</DialogTitle>
            <DialogDescription>
              {t("bookings.cancelBookingConfirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              {t("bookings.keepBooking")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending
                ? t("bookings.cancelling")
                : t("bookings.cancelBooking")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
