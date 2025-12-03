import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';
import { ListingController } from './listing.controller';
import { createTourSchema, updateTourSchema } from './listing.validation';


const router = Router();

router.post('/', checkAuth(Role.GUIDE, Role.ADMIN), validateRequest(createTourSchema), ListingController.createListing);
router.get('/', ListingController.getListings);
router.get('/:id', ListingController.getListingById);
router.patch('/:id', checkAuth(Role.GUIDE, Role.ADMIN), validateRequest(updateTourSchema), ListingController.updateListing);
router.delete('/:id', checkAuth(Role.GUIDE, Role.ADMIN), ListingController.deleteListing);

export default router;