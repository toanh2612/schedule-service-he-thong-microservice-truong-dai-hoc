import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG } from "src/common/configs/config";
import { MasterConfigEntity } from "src/common/entities/masterConfig.entity";
import { MasterConfigController } from "./masterConfig.controller";
import MasterConfigService from "./masterConfig.service";

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
    TypeOrmModule.forFeature([MasterConfigEntity]),
  ],
  controllers: [MasterConfigController],
  providers: [MasterConfigService],
})
export class MasterConfigModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    return consumer;
  }
}
