import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG } from "src/common/configs/config";
import { ClassPeriodEntity } from "src/common/entities/classPeriod.entity";
import { ClassPeriodController } from "./classPeriod.controller";
import ClassPeriodService from "./classPeriod.service";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: CONFIG.CLIENT_MODULE.REDIS,
				transport: Transport.REDIS,
				options: {
					db: 0,
					password: CONFIG["REDIS_CLIENT_PASSWORD"],
					port: CONFIG["REDIS_CLIENT_PORT"],
					host: CONFIG["REDIS_CLIENT_HOST"],
				},
			},
		]),
		TypeOrmModule.forFeature([ClassPeriodEntity]),
	],
	controllers: [ClassPeriodController],
	providers: [ClassPeriodService],
})
export class ClassPeriodModule implements NestModule {
	constructor() {}

	configure(consumer: MiddlewareConsumer) {
		return consumer;
	}
}
