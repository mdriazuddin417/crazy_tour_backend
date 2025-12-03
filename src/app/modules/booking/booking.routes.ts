import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';
import { BookingController } from './booking.controller';
import { createBookingSchema } from './booking.validation';


const router = Router();

router.post('/', checkAuth(Role.TOURIST), validateRequest(createBookingSchema), BookingController.createBooking);
router.patch('/:id', checkAuth(Role.TOURIST, Role.GUIDE, Role.ADMIN), BookingController.updateBooking);
router.get('/:id', checkAuth(Role.TOURIST, Role.GUIDE, Role.ADMIN), BookingController.getBookingById);
router.get('/', checkAuth(Role.TOURIST, Role.GUIDE, Role.ADMIN), BookingController.getBookings);

export default router;