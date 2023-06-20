export interface resType<T> {
  status: number;
  data: {
    data: T | null;
    message?: string;
  };
}

export interface resData<T> {
  status: number;
  data: {
    data: {
      rows: T | null;
      count: number;
    };
    message?: string;
  };
}

export interface resMessage {
  status: number;
  data: {
    message: string;
  };
}

export interface queryItems {
  p?: string;
  limit?: string;
  sortBy?: string;
  sortType?: string;
}
