import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ReportMovementsInput,
  ReportMovementsSummaryInput,
  ReportTransfersInput,
} from '../interfaces/services/report-service';
import { ReportPath } from '../enums/api/report';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private requestService = inject(RequestService);

  getMovements(params: ReportMovementsInput): Observable<Blob> {
    const query: Record<string, string> = this.buildQuery(params);
    return this.requestService.getBlobRequest({
      path: ReportPath.MOVEMENTS,
      query,
    });
  }

  getMovementsSummary(params: ReportMovementsSummaryInput): Observable<Blob> {
    const query: Record<string, string> = this.buildQuery(params);
    return this.requestService.getBlobRequest({
      path: ReportPath.MOVEMENTS_SUMMARY,
      query,
    });
  }

  getTransfers(params: ReportTransfersInput): Observable<Blob> {
    const query: Record<string, string> = this.buildQuery(params);
    return this.requestService.getBlobRequest({
      path: ReportPath.TRANSFERS,
      query,
    });
  }

  private buildQuery(params: {
    productId?: string;
    warehouseId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Record<string, string> {
    const query: Record<string, string> = {};

    if (params.productId) {
      query['productId'] = params.productId;
    }

    if (params.warehouseId) {
      query['warehouseId'] = params.warehouseId;
    }

    if (params.type) {
      query['type'] = params.type;
    }

    if (params.startDate) {
      query['startDate'] = params.startDate;
    }

    if (params.endDate) {
      query['endDate'] = params.endDate;
    }

    return query;
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
