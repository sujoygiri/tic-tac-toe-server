export interface CellClickedData {
  rowIndex: number;
  cellIndex: number;
}

export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
}

export interface UserDetails extends UserProfile {
  password?: string;
}

export interface ResponseData<T> {
  result: T;
  status: 'success' | 'error';
  message?: string;
  rows?: T[];
}
