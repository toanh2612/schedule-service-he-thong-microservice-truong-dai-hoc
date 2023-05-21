import { Global, Module } from "@nestjs/common";
import { AddressModule } from "./modules/address/address.module";
import { ClassroomModule } from "./modules/classroom/classroom.module";
import { CustomConfigModule } from "./common/configs/config.module";
import { SubjectModule } from "./modules/subject/subject.module";
import { AttendanceModule } from "./modules/attendance/attendance.module";
import { ClassPeriodModule } from "./modules/classPeriod/classPeriod.module";
import { ClassPeriodTimeRangeModule } from "./modules/classPeriodTimeRange/classPeriodTimeRange.module";
import { MasterConfigModule } from "./modules/masterConfig/masterConfig.module";

@Global()
@Module({
  imports: [
    CustomConfigModule,
    AddressModule,
    SubjectModule,
    ClassroomModule,
    ClassPeriodModule,
    ClassPeriodTimeRangeModule,
    AttendanceModule,
    MasterConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
