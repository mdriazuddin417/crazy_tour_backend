import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { TourTypeService } from './tourType.service';


export const TourTypeController = {
  createTourType: catchAsync(async (req: Request, res: Response) => {
    const data = await TourTypeService.createTourType(req.body);
    return sendResponse(res, { statusCode: 201, success: true, message: 'Tour type created', data });
  }),

  getAllTourTypes: catchAsync(async (req: Request, res: Response) => {
    const data = await TourTypeService.getAllTourTypes(req.query as Record<string, string>);
    return sendResponse(res, { statusCode: 200, success: true, message: 'Tour types retrieved successfully', data });
  }),

  getSingleTourType: catchAsync(async (req: Request, res: Response) => {
    const data = await TourTypeService.getSingleTourType(req.params.id);
    return sendResponse(res, { statusCode: 200, success: true, message: 'Tour type retrieved successfully', data });
  }),

  updateTourType: catchAsync(async (req: Request, res: Response) => {
    const data = await TourTypeService.updateTourType(req.params.id, req.body);
    return sendResponse(res, { statusCode: 200, success: true, message: 'Tour type updated successfully', data });
  }),

  deleteTourType: catchAsync(async (req: Request, res: Response) => {
    await TourTypeService.deleteTourType(req.params.id);
    return sendResponse(res, { statusCode: 200, success: true, message: 'Tour type deleted', data: null });
  })
};