import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { IClassPeriodTimeRange } from "./interfaces/IClassPeriodTimeRange.interface";
import { addOrderBy, addWhere } from "src/common/utils/utils";
import { ClassPeriodTimeRangeEntity } from "src/common/entities/classPeriodTimeRange.entity";

@Injectable()
export default class ClassPeriodTimeRangeService {
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

				let getClassPeriodTimeRangeListQuery = await this.dataSource
					.getRepository(ClassPeriodTimeRangeEntity)
					.createQueryBuilder("classPeriodTimeRange")
					// .leftJoinAndSelect("", "")
					.skip((page - 1) * perPage)
					.take(perPage);

				getClassPeriodTimeRangeListQuery = addWhere(
					getClassPeriodTimeRangeListQuery,
					filter,
					relativeFields
				);
				getClassPeriodTimeRangeListQuery = addOrderBy(
					getClassPeriodTimeRangeListQuery,
					order
				);

				const classPeriodTimeRangeFoundList: IClassPeriodTimeRange[] =
					await getClassPeriodTimeRangeListQuery.getMany();
				const classPeriodTimeRangeFoundCount: number =
					await getClassPeriodTimeRangeListQuery.getCount();

				return resolve({
					result: classPeriodTimeRangeFoundList,
					paging: {
						page,
						perPage,
						total: classPeriodTimeRangeFoundCount,
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
				const classPeriodTimeRangeFound: IClassPeriodTimeRange =
					await this.dataSource
						.getRepository(ClassPeriodTimeRangeEntity)
						.findOne({
							where: {
								id,
							},
						});

				return resolve({
					result: classPeriodTimeRangeFound,
				});
			} catch (error) {
				return reject(error);
			}
		});
	}

	async create(createClassPeriodTimeRangeData: any): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		return new Promise(async (resovle, reject) => {
			try {
				let newClassPeriodTimeRangeData = await queryRunner.manager
					.getRepository(ClassPeriodTimeRangeEntity)
					.create(createClassPeriodTimeRangeData);

				const newClassPeriodTimeRangeDataSave: any = await queryRunner.manager
					.getRepository(ClassPeriodTimeRangeEntity)
					.save(newClassPeriodTimeRangeData);

				await queryRunner.commitTransaction();
				await queryRunner.release();

				const newClassPeriodTimeRangeFound = await this.dataSource
					.getRepository(ClassPeriodTimeRangeEntity)
					.createQueryBuilder("classPeriodTimeRange")
					.where("classPeriodTimeRange.id = :id", {
						id: newClassPeriodTimeRangeDataSave.id,
					})
					.andWhere("classPeriodTimeRange.is_deleted = false")
					.orderBy("classPeriodTimeRange.created_date", "DESC")
					.getOne();

				return resovle({
					result: newClassPeriodTimeRangeFound,
				});
			} catch (error) {
				await queryRunner.rollbackTransaction();
				await queryRunner.release();

				return reject(error);
			}
		});
	}

	async update(id: string, updateClassPeriodTimeRangeData: any): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		return new Promise(async (resovle, reject) => {
			try {
				let classPeriodTimeRangeFound = await queryRunner.manager
					.getRepository(ClassPeriodTimeRangeEntity)
					.createQueryBuilder("classPeriodTimeRange")
					.where("classPeriodTimeRange.id = :id", {
						id: id,
					})
					.andWhere("classPeriodTimeRange.is_deleted = false")
					.getOne();

				if (!classPeriodTimeRangeFound) {
					return reject({
						code: "",
						message: "",
					});
				}

				await queryRunner.manager
					.getRepository(ClassPeriodTimeRangeEntity)
					.createQueryBuilder()
					.update(ClassPeriodTimeRangeEntity)
					.set(updateClassPeriodTimeRangeData)
					.where("id = :id", { id: classPeriodTimeRangeFound.id })
					.execute();

				await queryRunner.commitTransaction();
				await queryRunner.release();

				classPeriodTimeRangeFound = await this.dataSource
					.getRepository(ClassPeriodTimeRangeEntity)
					.createQueryBuilder("classPeriodTimeRange")
					.where("classPeriodTimeRange.id = :id", {
						id: classPeriodTimeRangeFound.id,
					})
					.andWhere("classPeriodTimeRange.is_deleted = false")
					.getOne();

				return resovle({
					result: classPeriodTimeRangeFound,
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
				let classPeriodTimeRangeFound = await queryRunner.manager
					.getRepository(ClassPeriodTimeRangeEntity)
					.createQueryBuilder("classPeriodTimeRange")
					.where("classPeriodTimeRange.id = :id", {
						id: id,
					})
					.andWhere("classPeriodTimeRange.is_deleted = false")
					.getOne();

				if (!classPeriodTimeRangeFound) {
					return reject({
						code: "",
						message: "",
					});
				}

				await queryRunner.manager
					.getRepository(ClassPeriodTimeRangeEntity)
					.createQueryBuilder()
					.update(ClassPeriodTimeRangeEntity)
					.set({
						isDeleted: true,
					})
					.where("id = :id", { id: classPeriodTimeRangeFound.id })
					.execute();

				await queryRunner.commitTransaction();
				await queryRunner.release();

				classPeriodTimeRangeFound = await this.dataSource
					.getRepository(ClassPeriodTimeRangeEntity)
					.createQueryBuilder("classPeriodTimeRange")
					.where("classPeriodTimeRange.id = :id", {
						id: classPeriodTimeRangeFound.id,
					})
					.andWhere("classPeriodTimeRange.is_deleted = false")
					.getOne();

				return resovle({
					result: classPeriodTimeRangeFound,
				});
			} catch (error) {
				await queryRunner.rollbackTransaction();
				await queryRunner.release();

				return reject(error);
			}
		});
	}
}
