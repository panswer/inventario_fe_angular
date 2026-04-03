import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { RequestService } from './request.service';
import { Category } from '../models/category';

interface GetAllCategoriesResponse {
  categories: Category[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private requestService = inject(RequestService);

  getAllCategories(onlyEnabled = true): Observable<Category[]> {
    const query: Record<string, string> = {};
    if (onlyEnabled) {
      query['onlyEnabled'] = 'true';
    }

    return this.requestService
      .getRequest({
        path: '/category',
        query,
      })
      .pipe(
        switchMap((result: GetAllCategoriesResponse) => {
          const categories = result.categories.map(
            (cat: Category) => new Category(cat)
          );
          return of(categories);
        }),
        catchError(() => {
          return of([]);
        })
      );
  }
}
