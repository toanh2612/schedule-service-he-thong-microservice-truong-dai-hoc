import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG } from "src/common/configs/config";
import { AttendanceEntity } from "src/common/entities/attendance.entity";
import { AttendanceController } from "./attendance.controller";
import AttendanceService from "./attendance.service";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: CONFIG.CLIENT_MODULE.REDIS,
				transport: Transport.REDIS,
				options: {
					db: 0,
					password: CONFIG["REDIS_CLIENT_PASSWORD"],
					port: Number(CONFIG["REDIS_CLIENT_PORT"]),
					host: CONFIG["REDIS_CLIENT_HOST"],
				},
			},
		]),
		TypeOrmModule.forFeature([AttendanceEntity]),
	],
	controllers: [AttendanceController],
	providers: [AttendanceService],
})
export class AttendanceModule implements NestModule {
	constructor() {}

	configure(consumer: MiddlewareConsumer) {
		return consumer;
	}
}
