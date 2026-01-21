import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { adminApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";
import { format } from "date-fns";

export function AdminBookings() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: () => adminApi.getBookings(),
  });

  const bookings = data?.data.data || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">{t("common.loading")}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("admin.allBookings")}</h1>

      {bookings.length === 0 ? (
        <Card className="glass-neon-strong rounded-2xl shadow-md">
          <CardContent className="py-12 text-center text-muted-foreground dark:text-gray-300">
            {t("admin.noBookingsFound")}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking: any) => (
            <Card key={booking.id} className="glass-neon-strong rounded-2xl hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-foreground">{booking.pitch?.name}</CardTitle>
                <CardDescription className="text-muted-foreground dark:text-gray-300">
                  {booking.pitch?.city} • User: {booking.userId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">{t("admin.date")}:</span>{" "}
                    {format(new Date(booking.date), "PPP")}
                  </p>
                  <p>
                    <span className="font-semibold">{t("admin.time")}:</span>{" "}
                    {booking.startTime} ({booking.durationMinutes}{" "}
                    {t("admin.minutes")})
                  </p>
                  <p>
                    <span className="font-semibold">{t("admin.status")}:</span>{" "}
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.status === "CONFIRMED"
                          ? "glass-neon-subtle bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 text-cyan-400"
                          : booking.status === "CANCELLED"
                          ? "glass-neon-subtle bg-gradient-to-r from-red-500/10 to-red-500/5 text-red-400"
                          : "glass-neon-subtle text-foreground dark:text-foreground"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
