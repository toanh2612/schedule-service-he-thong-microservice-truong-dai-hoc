import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity } from "src/common/entities/event.entity";
import { Repository, SelectQueryBuilder } from "typeorm";

@Injectable()
export class EventStoreService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>
  ) {}

  async commit(events: any[]): Promise<void> {
    const eventEntities = events.map((event) => {
      const eventEntity = new EventEntity();
      eventEntity.payload = event;
      return eventEntity;
    });
    await this.repository.save(eventEntities);
  }

  async rollback(events: any[]): Promise<void> {
    const query = this.getRollbackQuery(events);
    await query.execute();
  }

  private getRollbackQuery(events: any[]): SelectQueryBuilder<EventEntity> {
    const query = this.repository.createQueryBuilder("event");
    query.delete();
    query.where("id IN (:...ids)", { ids: events.map((event) => event.id) });
    return query;
  }
}
