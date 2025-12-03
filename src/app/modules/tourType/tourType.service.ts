import { QueryBuilder } from '../../utils/QueryBuilder';
import { ITourType, TourType } from './tourType.modal';

export const tourTypeSearchableFields = ['name', 'description', 'icon'];

export const TourTypeService = {
    createTourType: async (payload: ITourType) => {
        return await TourType.create(payload);
    },

    getAllTourTypes: async (query: Record<string, string>) => {
        const qb = new QueryBuilder(TourType.find(), query);
        const docs = await qb.search(tourTypeSearchableFields).filter().sort().fields().paginate().build();
        const meta = await qb.getMeta();
        return { data: docs, meta };
    },

    getSingleTourType: async (id: string) => {
        return await TourType.findById(id);
    },

    updateTourType: async (id: string, payload: ITourType) => {
        return await TourType.findByIdAndUpdate(id, payload, { new: true });
    },

    deleteTourType: async (id: string) => {
        return await TourType.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }
};