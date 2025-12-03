

import { QueryBuilder } from '../../utils/QueryBuilder';
import { userSearchableFields } from './user.constant';
import { IUser, User } from './user.modal';


export const UserService = {
  getProfile: async (id:string) => {
    return User.findById(id).select('-password');
  },

  updateProfile: async (id:string, payload:Partial<IUser>) => {
    return User.findByIdAndUpdate(id, payload, { new: true }).select('-password');
  },

  getAllUsers: async (query:Record<string, string>) => {
     const queryBuilder = new QueryBuilder(User.find(), query)
        const usersData = queryBuilder
            .filter()
            .search(userSearchableFields)
            .sort()
            .fields()
            .paginate();
    
        const [data, meta] = await Promise.all([
            usersData.build(),
            queryBuilder.getMeta()
        ])
    
        return {
            data,
            meta
        }
  }
};