export interface AuthData {
  player_name?: string;
  email: string;
  password: string;
}

export interface ResponseData {
  statusCode: number;
  message: string;
  data?: any;
}
