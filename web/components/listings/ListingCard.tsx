
import Link from 'next/link';
import { MapPin, Bed, Bath, Move } from 'lucide-react';

interface ListingCardProps {
    listing: {
        id: string;
        title: string;
        price: number;
        address: string;
        images: string[];
        propertyType: string;
        beds?: number; // Optional as not in all schemas yet
        baths?: number; // Optional
        sqft?: number; // Optional
    };
    className?: string;
}

export default function ListingCard({ listing, className }: ListingCardProps) {
    // Parse images if they come as a JSON string (safety check)
    let images = listing.images;
    if (typeof images === 'string') {
        try {
            images = JSON.parse(images);
        } catch (e) {
            images = [];
        }
    }

    // Ensure images is an array
    if (!Array.isArray(images)) images = [];

    const mainImage = images.length > 0 ? images[0] : '/placeholder.jpg';

    return (
        <Link
            href={`/listings/${listing.id}`}
            className={`block bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group ${className}`}
        >
            <div className="relative h-48 bg-muted overflow-hidden">
                <img
                    src={mainImage}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm uppercase font-medium">
                    {listing.propertyType}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="text-white font-bold text-lg">
                        ${listing.price.toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-lg truncate mb-1 text-foreground" title={listing.title}>
                    {listing.title}
                </h3>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{listing.address}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                    <div className="flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5" />
                        <span>{listing.beds || '-'} Beds</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" />
                        <span>{listing.baths || '-'} Baths</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Move className="h-3.5 w-3.5" />
                        <span>{listing.sqft || '-'} m²</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
