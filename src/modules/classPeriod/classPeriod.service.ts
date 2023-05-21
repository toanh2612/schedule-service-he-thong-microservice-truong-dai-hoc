import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ClassPeriodEntity } from "src/common/entities/classPeriod.entity";
import { DataSource } from "typeorm";
import { addOrderBy, addWhere } from "src/common/utils/utils";
import { IClassPeriod } from "./interfaces/IClassPeriod.interface";
import { CreateClassPeriodDto } from "./dto/CreateClassPeriod.dto";
// import { CONFIG } from "src/common/configs/config";
// import { Inject } from "@nestjs/common";
// import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export default class ClassPeriodService {
  constructor(
    // @Inject(CONFIG.CLIENT_MODULE.REDIS)
    // private readonly redisClient: ClientProxy,
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  async getList(
    filter: any,
    order: any,
    page: number,
    perPage: number,
    filterOptions?: any
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        filterOptions = filterOptions || {};
        const relativeFields: string[] = [];

        let getClassPeriodListQuery = await this.dataSource
          .getRepository(ClassPeriodEntity)
          .createQueryBuilder("classPeriod")
          .where("classPeriod.is_deleted = false")
          .leftJoinAndSelect("classPeriod.address", "address")
          .leftJoinAndSelect("classPeriod.classroom", "classroom")
          .leftJoinAndSelect(
            "classPeriod.classPeriodTimeRange",
            "classPeriodTimeRange"
          )
          .skip((page - 1) * perPage)
          .take(perPage);

        getClassPeriodListQuery = addWhere(
          getClassPeriodListQuery,
          filter,
          relativeFields
        );
        getClassPeriodListQuery = addOrderBy(getClassPeriodListQuery, order);

        const classPeriodFoundList: IClassPeriod[] =
          await getClassPeriodListQuery.getMany();
        const classPeriodFoundCount: number =
          await getClassPeriodListQuery.getCount();

        return resolve({
          result: classPeriodFoundList,
          paging: {
            page,
            perPage,
            total: classPeriodFoundCount,
          },
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async getOne(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const classPeriodFound: IClassPeriod = await this.dataSource
          .getRepository(ClassPeriodEntity)
          .createQueryBuilder("classPeriod")
          .where("classPeriod.id = :id", { id: id })
          .andWhere("classPeriod.is_deleted = false")
          .leftJoinAndSelect("classPeriod.address", "address")
          .leftJoinAndSelect("classPeriod.classroom", "classroom")
          .leftJoinAndSelect(
            "classPeriod.classPeriodTimeRange",
            "classPeriodTimeRange"
          )
          .getOne();

        return resolve({
          result: classPeriodFound,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async create(createClassPeriodData: CreateClassPeriodDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return new Promise(async (resovle, reject) => {
      try {
        await this.createOrUpdateClassPeriodValidator({
          addressId: createClassPeriodData.addressId,
          classPeriodTimeRangeId: createClassPeriodData.classPeriodTimeRangeId,
          dataTime: createClassPeriodData.dateTime,
          classroomId: createClassPeriodData.classroomId,
        });

        let newClassPeriodData = await queryRunner.manager
          .getRepository(ClassPeriodEntity)
          .create(createClassPeriodData);

        const newClassPeriodDataSave: any = await queryRunner.manager
          .getRepository(ClassPeriodEntity)
          .save(newClassPeriodData);

        await queryRunner.commitTransaction();
        await queryRunner.release();

        const newClassPeriodFound = await this.dataSource
          .getRepository(ClassPeriodEntity)
          .createQueryBuilder("classPeriod")
          .where("classPeriod.id = :id", {
            id: newClassPeriodDataSave.id,
          })
          .andWhere("classPeriod.is_deleted = false")
          .orderBy("classPeriod.created_date", "DESC")
          .getOne();

        return resovle({
          result: newClassPeriodFound,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return reject(error);
      }
    });
  }

  async update(id: string, updateClassPeriodData: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return new Promise(async (resovle, reject) => {
      try {
        let classPeriodFound = await queryRunner.manager
          .getRepository(ClassPeriodEntity)
          .createQueryBuilder("classPeriod")
          .where("classPeriod.id = :id", {
            id: id,
          })
          .andWhere("classPeriod.is_deleted = false")
          .getOne();

        if (!classPeriodFound) {
          return reject({
            code: "",
            message: "",
          });
        }

        await this.createOrUpdateClassPeriodValidator({
          addressId: updateClassPeriodData.addressId,
          classPeriodTimeRangeId: updateClassPeriodData.classPeriodTimeRangeId,
          dataTime: updateClassPeriodData.dateTime,
          classroomId: updateClassPeriodData.classroomId,
          classPeriodId: updateClassPeriodData.classPeriodId,
        });

        await queryRunner.manager
          .getRepository(ClassPeriodEntity)
          .createQueryBuilder()
          .update(ClassPeriodEntity)
          .set(updateClassPeriodData)
          .where("id = :id", { id: classPeriodFound.id })
          .execute();

        await queryRunner.commitTransaction();
        await queryRunner.release();

        classPeriodFound = await this.dataSource
          .getRepository(ClassPeriodEntity)
          .createQueryBuilder("classPeriod")
          .where("classPeriod.id = :id", {
            id: classPeriodFound.id,
          })
          .andWhere("classPeriod.is_deleted = false")
          .getOne();

        return resovle({
          result: classPeriodFound,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return reject(error);
      }
    });
  }

  async delete(id: string): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return new Promise(async (resovle, reject) => {
      try {
        let classPeriodFound = await queryRunner.manager
          .getRepository(ClassPeriodEntity)
          .createQueryBuilder("classPeriod")
          .where("classPeriod.id = :id", {
            id: id,
          })
          .andWhere("classPeriod.is_deleted = false")
          .getOne();

        if (!classPeriodFound) {
          return reject({
            code: "",
            message: "",
          });
        }

        await queryRunner.manager
          .getRepository(ClassPeriodEntity)
          .createQueryBuilder()
          .update(ClassPeriodEntity)
          .set({
            isDeleted: true,
          })
          .where("id = :id", { id: classPeriodFound.id })
          .execute();

        await queryRunner.commitTransaction();
        await queryRunner.release();

        classPeriodFound = await this.dataSource
          .getRepository(ClassPeriodEntity)
          .createQueryBuilder("classPeriod")
          .where("classPeriod.id = :id", {
            id: classPeriodFound.id,
          })
          .andWhere("classPeriod.is_deleted = false")
          .getOne();

        return resovle({
          result: classPeriodFound,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return reject(error);
      }
    });
  }

  async createOrUpdateClassPeriodValidator({
    addressId,
    classPeriodTimeRangeId,
    dateTime,
    classroomId,
    classPeriodId,
  }: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const classPeriodQuery = await this.dataSource.manager
          .getRepository(ClassPeriodEntity)
          .createQueryBuilder("class_period")
          .where(
            "class_period.class_period_time_range_id = :classPeriodTimeRangeId",
            {
              classPeriodTimeRangeId: classPeriodTimeRangeId,
            }
          )
          .andWhere(`class_period.date_time = :dateTime`, {
            dateTime: dateTime,
          })
          .andWhere(`class_period.addressId = :addressId`, {
            addressId: addressId,
          })
          .andWhere(`class_period.is_deleted = false`);

        if (classPeriodId) {
          classPeriodQuery.andWhere(`class_period.id != :classPeriodId`, {
            classPeriodId: classPeriodId,
          });
        }

        const classPeriodFound = await classPeriodQuery.getOne();

        if (classPeriodFound && classPeriodFound.classroomId === classroomId) {
          throw new Error(
            `Class period in classroom already exist, conflict with ${classPeriodFound.id}`
          );
        } else if (
          classPeriodFound &&
          classPeriodFound.classroomId !== classroomId
        ) {
          throw new Error(
            `Class period at address already exist, conflict with ${classPeriodFound.id}`
          );
        }

        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
