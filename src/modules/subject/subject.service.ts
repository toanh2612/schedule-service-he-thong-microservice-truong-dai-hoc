import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ISubject as ISubject } from "./interfaces/ISubject.interface";
import { addOrderBy, addWhere } from "src/common/utils/utils";
import { SubjectEntity } from "src/common/entities/subject.entity";
// import { CONFIG } from "src/common/configs/config";
// import { Inject } from "@nestjs/common";
// import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export default class SubjectService {
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

				let getSubjectListQuery = await this.dataSource
					.getRepository(SubjectEntity)
					.createQueryBuilder("subject")
					.leftJoinAndSelect("subject.classrooms", "classroom")
					.skip((page - 1) * perPage)
					.take(perPage);

				getSubjectListQuery = addWhere(
					getSubjectListQuery,
					filter,
					relativeFields
				);
				getSubjectListQuery = addOrderBy(getSubjectListQuery, order);

				const subjectFoundList: ISubject[] =
					await getSubjectListQuery.getMany();
				const subjectFoundCount: number = await getSubjectListQuery.getCount();

				return resolve({
					result: subjectFoundList,
					paging: {
						page,
						perPage,
						total: subjectFoundCount,
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
				const subjectFound: ISubject = await this.dataSource
					.getRepository(SubjectEntity)
					.findOne({
						where: {
							id,
						},
					});

				return resolve({
					result: subjectFound,
				});
			} catch (error) {
				return reject(error);
			}
		});
	}

	async create(createSubjectData: any): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		return new Promise(async (resovle, reject) => {
			try {
				let newSubjectData = await queryRunner.manager
					.getRepository(SubjectEntity)
					.create(createSubjectData);

				const newSubjectDataSave: any = await queryRunner.manager
					.getRepository(SubjectEntity)
					.save(newSubjectData);

				await queryRunner.commitTransaction();
				await queryRunner.release();

				const newSubjectFound = await this.dataSource
					.getRepository(SubjectEntity)
					.createQueryBuilder("subject")
					.where("subject.id = :id", {
						id: newSubjectDataSave.id,
					})
					.andWhere("subject.is_deleted = false")
					.orderBy("subject.created_date", "DESC")
					.getOne();

				return resovle({
					result: newSubjectFound,
				});
			} catch (error) {
				await queryRunner.rollbackTransaction();
				await queryRunner.release();

				return reject(error);
			}
		});
	}

	async update(id: string, updateSubjectData: any): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		return new Promise(async (resovle, reject) => {
			try {
				let subjectFound = await queryRunner.manager
					.getRepository(SubjectEntity)
					.createQueryBuilder("subject")
					.where("subject.id = :id", {
						id: id,
					})
					.andWhere("subject.is_deleted = false")
					.getOne();

				if (!subjectFound) {
					return reject({
						code: "",
						message: "",
					});
				}

				await queryRunner.manager
					.getRepository(SubjectEntity)
					.createQueryBuilder()
					.update(SubjectEntity)
					.set(updateSubjectData)
					.where("id = :id", { id: subjectFound.id })
					.execute();

				await queryRunner.commitTransaction();
				await queryRunner.release();

				subjectFound = await this.dataSource
					.getRepository(SubjectEntity)
					.createQueryBuilder("subject")
					.where("subject.id = :id", {
						id: subjectFound.id,
					})
					.andWhere("subject.is_deleted = false")
					.getOne();

				return resovle({
					result: subjectFound,
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
				let subjectFound = await queryRunner.manager
					.getRepository(SubjectEntity)
					.createQueryBuilder("subject")
					.where("subject.id = :id", {
						id: id,
					})
					.andWhere("subject.is_deleted = false")
					.getOne();

				if (!subjectFound) {
					return reject({
						code: "",
						message: "",
					});
				}

				await queryRunner.manager
					.getRepository(SubjectEntity)
					.createQueryBuilder()
					.update(SubjectEntity)
					.set({
						isDeleted: true,
					})
					.where("id = :id", { id: subjectFound.id })
					.execute();

				await queryRunner.commitTransaction();
				await queryRunner.release();

				subjectFound = await this.dataSource
					.getRepository(SubjectEntity)
					.createQueryBuilder("subject")
					.where("subject.id = :id", {
						id: subjectFound.id,
					})
					.andWhere("subject.is_deleted = false")
					.getOne();

				return resovle({
					result: subjectFound,
				});
			} catch (error) {
				await queryRunner.rollbackTransaction();
				await queryRunner.release();

				return reject(error);
			}
		});
	}
}
