export interface CellClickedData {
  rowIndex: number;
  cellIndex: number;
}

export interface UserDetails {
  user_id: string;
  name: string;
  email: string;
  password?: string;
}
