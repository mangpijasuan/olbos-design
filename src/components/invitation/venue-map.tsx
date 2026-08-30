export function VenueMap({
  venueName,
  venueAddress,
  className,
}: {
  venueName?: string | null;
  venueAddress?: string | null;
  className?: string;
}) {
  if (!venueName && !venueAddress) return null;

  const query = encodeURIComponent([venueName, venueAddress].filter(Boolean).join(", "));

  return (
    <div className={className}>
      <iframe
        title="Venue map"
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        className="h-64 w-full rounded-lg border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
