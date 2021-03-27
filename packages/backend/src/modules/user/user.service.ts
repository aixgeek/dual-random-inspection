import { Injectable } from '@nestjs/common';
import { CloudBaseService } from '@/services';
import { Collection } from '@/constants';

@Injectable()
export class UserService {
  constructor(private readonly cloudbaseService: CloudBaseService) {}

  private readonly users: User[];

  async findOne(username: string): Promise<User | undefined> {
    const res = await this.cloudbaseService
      .collection(Collection.UsersV2)
      .where({ username: username })
      .get();
    return res.data.length > 0 ? res.data.shift() : null;
  }
}
