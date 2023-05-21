import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG } from "src/common/configs/config";
import { SubjectEntity } from "src/common/entities/subject.entity";
import { SubjectController } from "./subject.controller";
import SubjectService from "./subject.service";

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
		TypeOrmModule.forFeature([SubjectEntity]),
	],
	controllers: [SubjectController],
	providers: [SubjectService],
})
export class SubjectModule implements NestModule {
	constructor() {}

	configure(consumer: MiddlewareConsumer) {
		return consumer;
	}
}
