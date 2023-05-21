import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG } from "src/common/configs/config";
import { ClassPeriodTimeRangeEntity } from "src/common/entities/classPeriodTimeRange.entity";
import { ClassPeriodTimeRangeController } from "./classPeriodTimeRange.controller";
import ClassPeriodTimeRangeService from "./classPeriodTimeRange.service";

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
		TypeOrmModule.forFeature([ClassPeriodTimeRangeEntity]),
	],
	controllers: [ClassPeriodTimeRangeController],
	providers: [ClassPeriodTimeRangeService],
})
export class ClassPeriodTimeRangeModule implements NestModule {
	constructor() {}

	configure(consumer: MiddlewareConsumer) {
		return consumer;
	}
}
