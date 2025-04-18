import {
  Param,
  Controller,
  Get,
  InternalServerErrorException,
  ValidationPipe,
} from '@nestjs/common';

import { UtilService } from './util.service';
import { FriendProfileIdDto } from './dto/util.dto';
import { DbService } from '../db/db.service';
import { ResponseData, UserProfile } from '../interface/common.interfaces';

@Controller('util')
export class UtilController {
  constructor(
    private readonly utilService: UtilService,
    private dbService: DbService,
  ) {}

  @Get('profile/:friendProfileId')
  async getFriendProfileById(
    @Param(new ValidationPipe()) params: FriendProfileIdDto,
  ) {
    try {
      const findFriendProfileByIdQuery: string = `SELECT user_id, name, email FROM "primary".users WHERE user_id = $1`;
      const findFriendProfileByIdResult = await this.dbService.query(
        findFriendProfileByIdQuery,
        [params.friendProfileId],
      );
      if (findFriendProfileByIdResult.rows.length > 0) {
        const friendProfileData = findFriendProfileByIdResult
          .rows[0] as UserProfile;
        const response: ResponseData<UserProfile> = {
          result: friendProfileData,
          status: 'success',
          message: 'Friend profile found.',
        };
        return response;
      } else {
        const response: ResponseData<null> = {
          result: null,
          status: 'error',
          message: 'FriendProfile not found',
        };
        return response;
      }
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(
        new Error('Internal Server Error'),
        {
          description: 'Internal Server Error',
        },
      );
    }
  }
}
