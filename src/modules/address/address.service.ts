import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { IAddress } from "./interfaces/IAddress.interface";
import { addOrderBy, addWhere } from "src/common/utils/utils";
import { AddressEntity } from "src/common/entities/address.entity";
// import { CONFIG } from "src/common/configs/config";
// import { Inject } from "@nestjs/common";
// import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export default class AddressService {
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

				let getAddressListQuery = await this.dataSource
					.getRepository(AddressEntity)
					.createQueryBuilder("address")
					// .leftJoinAndSelect("", "")
					.skip((page - 1) * perPage)
					.take(perPage);

				getAddressListQuery = addWhere(
					getAddressListQuery,
					filter,
					relativeFields
				);
				getAddressListQuery = addOrderBy(getAddressListQuery, order);

				const addressFoundList: IAddress[] =
					await getAddressListQuery.getMany();
				const addressFoundCount: number = await getAddressListQuery.getCount();

				return resolve({
					result: addressFoundList,
					paging: {
						page,
						perPage,
						total: addressFoundCount,
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
				const addressFound: IAddress = await this.dataSource
					.getRepository(AddressEntity)
					.findOne({
						where: {
							id,
						},
					});

				return resolve({
					result: addressFound,
				});
			} catch (error) {
				return reject(error);
			}
		});
	}

	async create(createAddressData: any): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		return new Promise(async (resovle, reject) => {
			try {
				let newAddressData = await queryRunner.manager
					.getRepository(AddressEntity)
					.create(createAddressData);

				const newAddressDataSave: any = await queryRunner.manager
					.getRepository(AddressEntity)
					.save(newAddressData);

				await queryRunner.commitTransaction();
				await queryRunner.release();

				const newAddressFound = await this.dataSource
					.getRepository(AddressEntity)
					.createQueryBuilder("address")
					.where("address.id = :id", {
						id: newAddressDataSave.id,
					})
					.andWhere("address.is_deleted = false")
					.orderBy("address.created_date", "DESC")
					.getOne();

				return resovle({
					result: newAddressFound,
				});
			} catch (error) {
				await queryRunner.rollbackTransaction();
				await queryRunner.release();

				return reject(error);
			}
		});
	}

	async update(id: string, updateAddressData: any): Promise<any> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		return new Promise(async (resovle, reject) => {
			try {
				let addressFound = await queryRunner.manager
					.getRepository(AddressEntity)
					.createQueryBuilder("address")
					.where("address.id = :id", {
						id: id,
					})
					.andWhere("address.is_deleted = false")
					.getOne();

				if (!addressFound) {
					return reject({
						code: "",
						message: "",
					});
				}

				await queryRunner.manager
					.getRepository(AddressEntity)
					.createQueryBuilder()
					.update(AddressEntity)
					.set(updateAddressData)
					.where("id = :id", { id: addressFound.id })
					.execute();

				await queryRunner.commitTransaction();
				await queryRunner.release();

				addressFound = await this.dataSource
					.getRepository(AddressEntity)
					.createQueryBuilder("address")
					.where("address.id = :id", {
						id: addressFound.id,
					})
					.andWhere("address.is_deleted = false")
					.getOne();

				return resovle({
					result: addressFound,
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
				let addressFound = await queryRunner.manager
					.getRepository(AddressEntity)
					.createQueryBuilder("address")
					.where("address.id = :id", {
						id: id,
					})
					.andWhere("address.is_deleted = false")
					.getOne();

				if (!addressFound) {
					return reject({
						code: "",
						message: "",
					});
				}

				await queryRunner.manager
					.getRepository(AddressEntity)
					.createQueryBuilder()
					.update(AddressEntity)
					.set({
						isDeleted: true,
					})
					.where("id = :id", { id: addressFound.id })
					.execute();

				await queryRunner.commitTransaction();
				await queryRunner.release();

				addressFound = await this.dataSource
					.getRepository(AddressEntity)
					.createQueryBuilder("address")
					.where("address.id = :id", {
						id: addressFound.id,
					})
					.andWhere("address.is_deleted = false")
					.getOne();

				return resovle({
					result: addressFound,
				});
			} catch (error) {
				await queryRunner.rollbackTransaction();
				await queryRunner.release();

				return reject(error);
			}
		});
	}
}
