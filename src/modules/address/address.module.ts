import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG } from "src/common/configs/config";
import { AddressEntity } from "src/common/entities/address.entity";
import { AddressController } from "./address.controller";
import AddressService from "./address.service";

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
					retryAttempts: 5,
					retryDelay: 5000,
				},
			},
		]),
		TypeOrmModule.forFeature([AddressEntity]),
	],
	controllers: [AddressController],
	providers: [AddressService],
})
export class AddressModule implements NestModule {
	constructor() {}

	configure(consumer: MiddlewareConsumer) {
		return consumer;
	}
}
