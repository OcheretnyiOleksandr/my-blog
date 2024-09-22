import { Module } from '@nestjs/common';
import { AppDataSource } from './data-source';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: async () => {
        return AppDataSource;
      },
    },
  ],
  exports: ['DATA_SOURCE'],
})
export class DbModule {}
