import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.repository';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
