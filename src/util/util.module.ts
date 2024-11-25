import { Module } from '@nestjs/common';
import { UtilService } from './util.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({ providers: [UtilService], exports: [UtilService] })
export class UtilModule {}
