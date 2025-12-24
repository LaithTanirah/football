import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { adminApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t("admin.noBookingsFound")}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking: any) => (
            <Card key={booking.id}>
              <CardHeader>
                <CardTitle>{booking.pitch?.name}</CardTitle>
                <CardDescription>
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
                      className={`inline-block rounded px-2 py-1 text-xs ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : booking.status === "CANCELLED"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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
