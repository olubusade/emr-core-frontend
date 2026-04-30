export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
    meta?: {
      total: number;
      page: number;
      pageSize: number;
    };
  }
  