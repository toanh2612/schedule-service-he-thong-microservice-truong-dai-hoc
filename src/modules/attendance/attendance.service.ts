import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addOrderBy, addWhere } from "src/common/utils/utils";
import { AttendanceEntity } from "src/common/entities/attendance.entity";
import { IAttendance } from "./interfaces/IAttendance.interface";
// import { CONFIG } from "src/common/configs/config";
// import { Inject } from "@nestjs/common";
// import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export default class AttendanceService {
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

				let getAttendanceListQuery = await this.dataSource
					.getRepository(AttendanceEntity)
					.createQueryBuilder("attendance")
					// .leftJoinAndSelect("", "")
					.skip((page - 1) * perPage)
					.take(perPage);

				getAttendanceListQuery = addWhere(
					getAttendanceListQuery,
					filter,
					relativeFields
				);
				getAttendanceListQuery = addOrderBy(getAttendanceListQuery, order);

				const attendanceFoundList: IAttendance[] =
					await getAttendanceListQuery.getMany();
				const attendanceFoundCount: number =
					await getAttendanceListQuery.getCount();

				return resolve({
					result: attendanceFoundList,
					paging: {
						page,
						perPage,
						total: attendanceFoundCount,
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
				const attendanceFound: IAttendance = await this.dataSource
					.getRepository(AttendanceEntity)
					.findOne({
						where: {
							id,
						},
					});

				return resolve({
					result: attendanceFound,
				});
			} catch (error) {
				return reject(error);
			}
		});
	}

	async create(createAttendanceData: any): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		return new Promise(async (resovle, reject) => {
			try {
				let newAttendanceData = await queryRunner.manager
					.getRepository(AttendanceEntity)
					.create(createAttendanceData);

				const newAttendanceDataSave: any = await queryRunner.manager
					.getRepository(AttendanceEntity)
					.save(newAttendanceData);

				await queryRunner.commitTransaction();
				await queryRunner.release();

				const newAttendanceFound = await this.dataSource
					.getRepository(AttendanceEntity)
					.createQueryBuilder("attendance")
					.where("attendance.id = :id", {
						id: newAttendanceDataSave.id,
					})
					.andWhere("attendance.is_deleted = false")
					.orderBy("attendance.created_date", "DESC")
					.getOne();

				return resovle({
					result: newAttendanceFound,
				});
			} catch (error) {
				await queryRunner.rollbackTransaction();
				await queryRunner.release();

				return reject(error);
			}
		});
	}

	async update(id: string, updateAttendanceData: any): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		return new Promise(async (resovle, reject) => {
			try {
				let attendanceFound = await queryRunner.manager
					.getRepository(AttendanceEntity)
					.createQueryBuilder("attendance")
					.where("attendance.id = :id", {
						id: id,
					})
					.andWhere("attendance.is_deleted = false")
					.getOne();

				if (!attendanceFound) {
					return reject({
						code: "",
						message: "",
					});
				}

				await queryRunner.manager
					.getRepository(AttendanceEntity)
					.createQueryBuilder()
					.update(AttendanceEntity)
					.set(updateAttendanceData)
					.where("id = :id", { id: attendanceFound.id })
					.execute();

				await queryRunner.commitTransaction();
				await queryRunner.release();

				attendanceFound = await this.dataSource
					.getRepository(AttendanceEntity)
					.createQueryBuilder("attendance")
					.where("attendance.id = :id", {
						id: attendanceFound.id,
					})
					.andWhere("attendance.is_deleted = false")
					.getOne();

				return resovle({
					result: attendanceFound,
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
				let attendanceFound = await queryRunner.manager
					.getRepository(AttendanceEntity)
					.createQueryBuilder("attendance")
					.where("attendance.id = :id", {
						id: id,
					})
					.andWhere("attendance.is_deleted = false")
					.getOne();

				if (!attendanceFound) {
					return reject({
						code: "",
						message: "",
					});
				}

				await queryRunner.manager
					.getRepository(AttendanceEntity)
					.createQueryBuilder()
					.update(AttendanceEntity)
					.set({
						isDeleted: true,
					})
					.where("id = :id", { id: attendanceFound.id })
					.execute();

				await queryRunner.commitTransaction();
				await queryRunner.release();

				attendanceFound = await this.dataSource
					.getRepository(AttendanceEntity)
					.createQueryBuilder("attendance")
					.where("attendance.id = :id", {
						id: attendanceFound.id,
					})
					.andWhere("attendance.is_deleted = false")
					.getOne();

				return resovle({
					result: attendanceFound,
				});
			} catch (error) {
				await queryRunner.rollbackTransaction();
				await queryRunner.release();

				return reject(error);
			}
		});
	}
}
