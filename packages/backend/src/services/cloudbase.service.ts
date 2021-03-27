import { Injectable } from '@nestjs/common';
import { CollectionReference } from '@cloudbase/database';
import { getCloudBaseApp } from '@/utils';

@Injectable()
export class CloudBaseService {
  app: any;

  constructor() {
    this.app = getCloudBaseApp();
  }

  get db() {
    return this.app.database();
  }

  collection(collection: string): CollectionReference {
    return this.app.database().collection(collection);
  }

  auth() {
    return this.app.auth();
  }

  handleSearch = (search: Record<string, any>) => {
    let filter = {}
    const db = this.app.database()
    Object.keys(search)
      .filter((key) => typeof search[key] !== 'undefined' && search[key] !== null && search[key] !== '')
      .forEach((key) => {
        filter[key] = search[key]
          ? db.RegExp({
            options: 'g',
            regexp: String(search[key]),
          })
          : search[key]
      })
    return filter
  };
}
