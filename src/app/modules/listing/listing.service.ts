import { QueryBuilder } from "../../utils/QueryBuilder";
import { TourListing, tourListingSortableFields } from "./listing.model";

export const ListingService = {
    createListing: async (payload: Record<string, string>) => {
        return await TourListing.create(payload);
    },

    getListings: async (query: Record<string, string>) => {
        const qb = new QueryBuilder(TourListing.find({ isActive: true }), query);

        const listings = await qb.search(tourListingSortableFields)
            .filter()
            .sort()
            .fields()
            .paginate();

        const [data, meta] = await Promise.all([listings.build(), qb.getMeta()]);

        return { data, meta };
    },

    getListingById: async (id: string) => {
        return await TourListing.findById(id);
    },

    updateListing: async (id: string, payload: Record<string, string>) => {
        return await TourListing.findByIdAndUpdate(id, payload, { new: true });
    },

    deleteListing: async (id: string) => {
        return await TourListing.findByIdAndUpdate(id, { isActive: false }, { new: true });
    },
};
