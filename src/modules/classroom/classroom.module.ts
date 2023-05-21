import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG } from "src/common/configs/config";
import { ClassroomEntity } from "src/common/entities/classroom.entity";
import { ClassroomController } from "./classroom.controller";
import ClassroomService from "./classroom.service";
import UserEvent from "../user/user.event";
import { AuthMiddleware } from "../auth/auth.middleware";

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
    TypeOrmModule.forFeature([ClassroomEntity]),
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService, UserEvent, Logger],
})
export class ClassroomModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: "*",
    });
  }
}
