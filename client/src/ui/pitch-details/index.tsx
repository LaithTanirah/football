import { PitchHero } from "./PitchHero";
import { PitchGallery } from "./PitchGallery";
import { PitchBookingCard } from "./PitchBookingCard";
import { PitchMetaGrid } from "./PitchMetaGrid";
import { PitchDescription } from "./PitchDescription";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

interface PitchDetailsUIProps {
  // Pitch data
  pitch: {
    id: string;
    name: string;
    address: string;
    city: string;
    type?: string;
    indoor?: boolean;
    images?: string[];
    openTime?: string;
    closeTime?: string;
    pricePerHour: number;
    description?: string;
  };
  
  // Booking state
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateChange: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onBook: () => void;
  isBooking: boolean;
  user: any;
  
  // Breadcrumbs
  breadcrumbLabel: string;
}

export function PitchDetailsUI({
  pitch,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeSelect,
  onBook,
  isBooking,
  user,
  breadcrumbLabel,
}: PitchDetailsUIProps) {
  const { dir, isRTL } = useDirection();

  return (
    <div 
      className={cn(
        "pitchDetailsPage min-h-screen relative",
        "bg-gradient-to-br from-slate-950 via-purple-950/30 to-pink-950/20",
        "dark:from-slate-950 dark:via-purple-950/30 dark:to-pink-950/20"
      )}
      dir={dir}
    >
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 pt-28 md:pt-32 pb-16 md:pb-24 relative z-10">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: breadcrumbLabel, href: "/pitches" },
              { label: pitch.name },
            ]}
          />
        </div>
        {/* Hero Section */}
        <div className="mb-12">
          <PitchHero
            name={pitch.name}
            address={pitch.address}
            city={pitch.city}
            type={pitch.type}
            indoor={pitch.indoor}
          />
        </div>

        {/* Gallery and Booking Layout */}
        <div className={cn(
          "grid gap-8 mb-12",
          "lg:grid-cols-12"
        )}>
          {/* Gallery - Takes more space on desktop */}
          <div className={cn(
            "lg:col-span-7",
            isRTL && "lg:order-2"
          )}>
            <PitchGallery
              images={pitch.images}
              name={pitch.name}
            />
          </div>

          {/* Booking Card - Floating on desktop */}
          <div className={cn(
            "lg:col-span-5",
            "lg:sticky lg:top-24 lg:h-fit",
            isRTL && "lg:order-1"
          )}>
            <PitchBookingCard
              pitchId={pitch.id}
              pricePerHour={pitch.pricePerHour}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateChange={onDateChange}
              onTimeSelect={onTimeSelect}
              onBook={onBook}
              isBooking={isBooking}
              user={user}
            />
          </div>
        </div>

        {/* Meta Grid */}
        <div className="mb-12">
          <PitchMetaGrid
            openTime={pitch.openTime}
            closeTime={pitch.closeTime}
            pricePerHour={pitch.pricePerHour}
          />
        </div>

        {/* Description */}
        {pitch.description && (
          <div className="mb-12">
            <PitchDescription description={pitch.description} />
          </div>
        )}
      </div>
    </div>
  );
}
