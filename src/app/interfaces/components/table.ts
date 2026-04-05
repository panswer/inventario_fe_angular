export interface TableHeadCol {
  field: string;
  text: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}
