import { CategoryInterface } from '../interfaces/category';

export class Category implements CategoryInterface {
  _id: string;
  name: string;
  isEnabled: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;

  constructor(params: CategoryInterface) {
    this._id = params._id;
    this.name = params.name;
    this.isEnabled = params.isEnabled;
    this.createdBy = params.createdBy;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}
