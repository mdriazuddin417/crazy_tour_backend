import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { UserController } from './user.controller';


const router = Router();

router.get('/:id', UserController.getProfile);
router.patch('/:id', checkAuth(Role.ADMIN), UserController.updateProfile);
router.get('/',  checkAuth(Role.ADMIN), UserController.getAllUsers);

export default router;