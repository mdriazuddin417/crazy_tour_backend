import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ListingService } from "./listing.service";



export const ListingController = {
    createListing: catchAsync(async (req, res) => {
        const result = await ListingService.createListing(req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Tour listing created successfully",
            data: result
        });
    }),

    getListings: catchAsync(async (req, res) => {
        const result = await ListingService.getListings(req.query as Record<string, string>);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Listings retrieved successfully",
            data: result
        });
    }),

    getListingById: catchAsync(async (req, res) => {
        const result = await ListingService.getListingById(req.params.id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Listing retrieved",
            data: result
        });
    }),

    updateListing: catchAsync(async (req, res) => {
        const result = await ListingService.updateListing(req.params.id, req.body);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Listing updated",
            data: result
        });
    }),

    deleteListing: catchAsync(async (req, res) => {
        const result = await ListingService.deleteListing(req.params.id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Listing deleted",
            data: result
        });
    }),
};
