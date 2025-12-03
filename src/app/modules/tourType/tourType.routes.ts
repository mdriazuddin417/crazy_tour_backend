import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';
import { TourTypeController } from './tourType.controller';
import { createTourTypeZodSchema, updateTourTypeZodSchema } from './tourType.validation';


const router = Router();

router.post('/create',  checkAuth(Role.ADMIN), validateRequest(createTourTypeZodSchema), TourTypeController.createTourType);
router.get('/', TourTypeController.getAllTourTypes);
router.get('/:id', TourTypeController.getSingleTourType);
router.patch('/:id',  checkAuth(Role.ADMIN), validateRequest(updateTourTypeZodSchema), TourTypeController.updateTourType);
router.delete('/:id',  checkAuth(Role.ADMIN), TourTypeController.deleteTourType);

export default router;