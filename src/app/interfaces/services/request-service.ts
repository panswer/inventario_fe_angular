export interface RequestServiceInput {
  path: string;
  query?: Record<string, string>;
}

export interface RequestPostServiceInput extends RequestServiceInput {
  body?: any;
}

export interface RequestPutServiceInput extends RequestPostServiceInput { }
