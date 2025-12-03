
import bcryptjs from 'bcryptjs';
import { envVars } from '../../config/env';
import { generateToken } from '../../utils/jwt';
import { User } from '../testUser/user.modal';


export const AuthService = {
  register: async (payload: Record<string, string>) => {
    const exists = await User.findOne({ email: payload.email });
    if (exists) throw new Error('Email already exists');
    const hashed = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND));
    const user = await User.create({ ...payload, password: hashed });
    const token = generateToken({ email: user.email, role: user.role, _id: user._id }, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
    return { accessToken: token, user };
  },

  login: async (payload: Record<string, string>) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcryptjs.compare(payload.password, user.password);
    if (!ok) throw new Error('Invalid credentials');
    const token = generateToken({ email: user.email, role: user.role, _id: user._id }, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
    return { accessToken: token, user };
  }
};