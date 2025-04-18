import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FriendProfileIdDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  friendProfileId: string;
}
