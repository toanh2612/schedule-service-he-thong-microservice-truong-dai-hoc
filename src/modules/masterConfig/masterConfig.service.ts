import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addOrderBy, addWhere } from "src/common/utils/utils";
import { MasterConfigEntity } from "src/common/entities/masterConfig.entity";
import { IMasterConfig } from "./interfaces/IMasterConfig.interface";

@Injectable()
export default class MasterConfigService {
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

        let getMasterConfigListQuery = await this.dataSource
          .getRepository(MasterConfigEntity)
          .createQueryBuilder("masterConfig")
          .skip((page - 1) * perPage)
          .take(perPage);

        getMasterConfigListQuery = addWhere(
          getMasterConfigListQuery,
          filter,
          relativeFields
        );
        getMasterConfigListQuery = addOrderBy(getMasterConfigListQuery, order);

        const masterConfigFoundList: IMasterConfig[] =
          await getMasterConfigListQuery.getMany();
        const masterConfigFoundCount: number =
          await getMasterConfigListQuery.getCount();

        return resolve({
          result: masterConfigFoundList,
          paging: {
            page,
            perPage,
            total: masterConfigFoundCount,
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
        const masterConfigFound: IMasterConfig = await this.dataSource
          .getRepository(MasterConfigEntity)
          .findOne({
            where: {
              id,
            },
          });

        return resolve({
          result: masterConfigFound,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async create(createMasterConfigData: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return new Promise(async (resovle, reject) => {
      try {
        let newMasterConfigData = await queryRunner.manager
          .getRepository(MasterConfigEntity)
          .create(createMasterConfigData);

        const newMasterConfigDataSave: any = await queryRunner.manager
          .getRepository(MasterConfigEntity)
          .save(newMasterConfigData);

        await queryRunner.commitTransaction();
        await queryRunner.release();

        const newMasterConfigFound = await this.dataSource
          .getRepository(MasterConfigEntity)
          .createQueryBuilder("masterConfig")
          .where("masterConfig.id = :id", {
            id: newMasterConfigDataSave.id,
          })
          .andWhere("masterConfig.is_deleted = false")
          .getOne();

        return resovle({
          result: newMasterConfigFound,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return reject(error);
      }
    });
  }

  async update(id: string, updateMasterConfigData: any): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return new Promise(async (resovle, reject) => {
      try {
        let masterConfigFound = await queryRunner.manager
          .getRepository(MasterConfigEntity)
          .createQueryBuilder("masterConfig")
          .where("masterConfig.id = :id", {
            id: id,
          })
          .andWhere("masterConfig.is_deleted = false")
          .getOne();

        if (!masterConfigFound) {
          return reject({
            code: "",
            message: "",
          });
        }

        await queryRunner.manager
          .getRepository(MasterConfigEntity)
          .createQueryBuilder()
          .update(MasterConfigEntity)
          .set(updateMasterConfigData)
          .where("id = :id", { id: masterConfigFound.id })
          .execute();

        await queryRunner.commitTransaction();
        await queryRunner.release();

        masterConfigFound = await this.dataSource
          .getRepository(MasterConfigEntity)
          .createQueryBuilder("masterConfig")
          .where("masterConfig.id = :id", {
            id: masterConfigFound.id,
          })
          .andWhere("masterConfig.is_deleted = false")
          .getOne();

        return resovle({
          result: masterConfigFound,
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
        let masterConfigFound = await queryRunner.manager
          .getRepository(MasterConfigEntity)
          .createQueryBuilder("masterConfig")
          .where("masterConfig.id = :id", {
            id: id,
          })
          .andWhere("masterConfig.is_deleted = false")
          .getOne();

        if (!masterConfigFound) {
          return reject({
            code: "",
            message: "",
          });
        }

        await queryRunner.manager
          .getRepository(MasterConfigEntity)
          .createQueryBuilder()
          .update(MasterConfigEntity)
          .set({
            isDeleted: true,
          })
          .where("id = :id", { id: masterConfigFound.id })
          .execute();

        await queryRunner.commitTransaction();
        await queryRunner.release();

        masterConfigFound = await this.dataSource
          .getRepository(MasterConfigEntity)
          .createQueryBuilder("masterConfig")
          .where("masterConfig.id = :id", {
            id: masterConfigFound.id,
          })
          .andWhere("masterConfig.is_deleted = false")
          .getOne();

        return resovle({
          result: masterConfigFound,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return reject(error);
      }
    });
  }
}
