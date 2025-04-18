import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { hashSync, compareSync } from 'bcryptjs';

import { UserSignInDto, UserSignUpDto } from './dto/user.dto';
import { DbService } from '../db/db.service';
import { UserDetails } from '../interface/common.interfaces';

@Injectable()
export class AuthService {
  constructor(private dbService: DbService) {}

  async signUpUser(userDetails: UserSignUpDto) {
    try {
      const { name, email, password } = userDetails;
      if (name && email && password) {
        const isEmailExistQuery = `SELECT email FROM "primary".users WHERE users.email = $1`;
        const isEmailExistQueryResult = await this.dbService.query(
          isEmailExistQuery,
          [email],
        );
        if (isEmailExistQueryResult.rowCount) {
          throw new ConflictException(new Error('Email id already exist'), {
            description: 'Email id already exist! Try to login.',
          });
        }
        const hashedPassword = hashSync(password);
        const userSignUpQuery = `INSERT INTO "primary".users(name, email, password) VALUES($1, $2, $3) RETURNING user_id,name,email`;
        const queryResult = await this.dbService.query(userSignUpQuery, [
          name,
          email,
          hashedPassword,
        ]);
        const signedUpUserData = <UserDetails>queryResult.rows[0];
        return {
          result: {
            user_id: signedUpUserData.user_id,
            name: signedUpUserData.name,
            email: signedUpUserData.email,
          },
          rowCount: queryResult.rowCount,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error, {
        description: 'Signup failed!',
      });
    }
  }

  async signInUser(userDetails: UserSignInDto) {
    try {
      const { email, password } = userDetails;
      if (email && password) {
        const findUserQuery = `SELECT * FROM "primary".users WHERE users.email = $1`;
        const queryResult = await this.dbService.query(findUserQuery, [email]);
        if (queryResult.rows.length === 0) {
          throw new NotFoundException(new Error('Email id not found!'), {
            description: 'Email id not found! Create an account',
          });
        }
        const existingUserData = <UserDetails>queryResult.rows[0];
        const isPasswordMatched = compareSync(
          password,
          existingUserData.password ?? '',
        );
        if (!isPasswordMatched) {
          throw new NotAcceptableException(new Error('Wrong password!'), {
            description: 'Wrong password! Try again.',
          });
        }
        return {
          result: {
            user_id: existingUserData.user_id,
            name: existingUserData.name,
            email: existingUserData.email,
          },
          rowCount: queryResult.rowCount,
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error, {
        description: 'Sign in failed! Try again.',
      });
    }
  }

  async verifyUser(sessionId: string) {
    console.log(sessionId);
    try {
      const getUserSessionQuery = `SELECT sess FROM "primary".session WHERE session.sid = $1`;
      const queryResult = await this.dbService.query(getUserSessionQuery, [
        sessionId,
      ]);
      if (queryResult.rows.length) {
        const { sess } = queryResult.rows[0] as {
          sess: { cookie: object; userData: UserDetails };
        };
        return {
          result: {
            user_id: sess.userData.user_id,
            name: sess.userData.name,
            email: sess.userData.email,
          },
          rowCount: queryResult.rowCount,
        };
      } else {
        throw new UnauthorizedException(new Error('Unauthorized'), {
          description: 'Session not found!',
        });
      }
    } catch (error) {
      throw new UnauthorizedException(error, {
        description: 'Something went wrong!',
      });
    }
  }
}
