import Image from "next/image";

export function GalleryGrid({ urls, className }: { urls: string[]; className?: string }) {
  if (urls.length === 0) return null;

  return (
    <div className={className}>
      {urls.map((url, i) => (
        <div key={url + i} className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            src={url}
            alt={`Gallery photo ${i + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
