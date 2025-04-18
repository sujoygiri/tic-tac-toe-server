import { Module } from '@nestjs/common';
import { UtilService } from './util.service';
import { UtilController } from './util.controller';
import { DbModule } from '../db/db.module';

@Module({
  controllers: [UtilController],
  imports: [DbModule],
  providers: [UtilService],
})
export class UtilModule {}
