export type MovementType = 'initial' | 'in' | 'out' | 'adjust' | 'transfer';

export interface ReportMovementsInput {
  productId?: string;
  warehouseId?: string;
  type?: MovementType;
  startDate?: string;
  endDate?: string;
}

export interface ReportMovementsSummaryInput {
  productId?: string;
  warehouseId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReportTransfersInput {
  productId?: string;
  warehouseId?: string;
  startDate?: string;
  endDate?: string;
}
