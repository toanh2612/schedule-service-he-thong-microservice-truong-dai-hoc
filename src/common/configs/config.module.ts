import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { AddressEntity } from "../entities/address.entity";
import { ClassroomEntity } from "../entities/classroom.entity";
import { SubjectEntity } from "../entities/subject.entity";
import { TransactionEntity } from "../entities/transaction.entity";
import { CONFIG, CONFIGURATION } from "./config";
import { AttendanceEntity } from "../entities/attendance.entity";
import { ClassroomTeacherEntity } from "../entities/classroomTeacher.entity";
import { ClassroomStudentEntity } from "../entities/classroomStudent.entity";
import { ClassPeriodTimeRangeEntity } from "../entities/classPeriodTimeRange.entity";
import { ClassPeriodEntity } from "../entities/classPeriod.entity";
import { MasterConfigEntity } from "../entities/masterConfig.entity";
// import { ClassPeriodEntity } from "../entities/classPeriod.entity";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      envFilePath: `${process.env["NODE_ENV"]}`,
      isGlobal: true,
      load: [CONFIGURATION],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        // logger: 'advanced-console',
        logging: true,
        host: configService.get<string>("DATABASE_HOST"),
        port: +configService.get<number>("DATABASE_PORT"),
        username: configService.get<string>("DATABASE_USERNAME"),
        password: configService.get<string>("DATABASE_PASSWORD"),
        database: configService.get<string>("DATABASE_NAME"),
        entities: [
          AddressEntity,
          ClassPeriodEntity,
          SubjectEntity,
          TransactionEntity,
          ClassroomEntity,
          ClassPeriodTimeRangeEntity,
          AttendanceEntity,
          ClassroomTeacherEntity,
          ClassroomStudentEntity,
          MasterConfigEntity,
        ],
        synchronize: CONFIG["NODE_ENV"] === "production" ? false : true,
        // migrationsRun: true
      }),

      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class CustomConfigModule {}
