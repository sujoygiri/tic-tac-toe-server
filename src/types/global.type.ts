export interface AuthData {
  player_name?: string;
  email: string;
  password: string;
}

export interface PlayerSessionData {
  player_id: string;
  player_name: string;
  email: string;
}

export interface Player extends PlayerSessionData {
  password?: string;
}

export interface ResponseData {
  statusCode: number;
  message: string;
  data?: Player;
}
