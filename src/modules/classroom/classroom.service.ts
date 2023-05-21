import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addOrderBy, addWhere } from "src/common/utils/utils";
import { ClassroomEntity } from "src/common/entities/classroom.entity";
import { IClassroom } from "./interfaces/IClassroom.interface";
import { CreateClassroomDto } from "./dto/CreateClassroom.dto";
import { UpdateClassroomDto } from "./dto/UpdateClassroom.dto";
import { CONFIG } from "src/common/configs/config";
import { ClassroomTeacherEntity } from "src/common/entities/classroomTeacher.entity";
import UserEvent from "../user/user.event";
import { ClassroomStudentEntity } from "src/common/entities/classroomStudent.entity";
import { ClassPeriodEntity } from "src/common/entities/classPeriod.entity";

@Injectable()
export default class ClassroomService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private userEvent: UserEvent,
    private logger: Logger
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

        let getClassroomListQuery = await this.dataSource
          .getRepository(ClassroomEntity)
          .createQueryBuilder("classroom")
          .where("classroom.is_deleted = false")
          .leftJoinAndSelect("classroom.subject", "subject")
          .skip((page - 1) * perPage)
          .take(perPage);

        getClassroomListQuery = addWhere(
          getClassroomListQuery,
          filter,
          relativeFields
        );
        getClassroomListQuery = addOrderBy(getClassroomListQuery, order);

        const classroomFoundList: IClassroom[] =
          await getClassroomListQuery.getMany();
        const classroomFoundCount: number =
          await getClassroomListQuery.getCount();

        return resolve({
          result: classroomFoundList,
          paging: {
            page,
            perPage,
            total: classroomFoundCount,
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
        const classroomFound: IClassroom = await this.dataSource
          .getRepository(ClassroomEntity)
          .createQueryBuilder("classroom")
          .where("classroom.id = :id", { id: id })
          .andWhere("classroom.is_deleted = false")
          .leftJoinAndSelect("classroom.subject", "subject")
          .getOne();

        if (!classroomFound) {
          return reject(CONFIG.E0005);
        }

        let classroomTeacherFoundList: any =
          (await this.dataSource
            .getRepository(ClassroomTeacherEntity)
            .createQueryBuilder("classroom_teacher")
            .where("classroom_teacher.classroom_id = :classroomId", {
              classroomId: id,
            })
            .getMany()) || [];

        let classroomStudentFoundList: any =
          (await this.dataSource
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: id,
            })
            .getMany()) || [];

        if (!classroomTeacherFoundList || !classroomStudentFoundList) {
          return resolve(classroomFound);
        }

        const teacherFoundIdList = classroomTeacherFoundList.map((item) => {
          return item.teacherId;
        });

        const studentFoundIdList = classroomStudentFoundList.map((item) => {
          return item.studentId;
        });

        let teacherFoundList: any = [];
        let studentFoundList: any = [];

        if (teacherFoundIdList.length) {
          teacherFoundList =
            (await this.userEvent
              .getListByIds(teacherFoundIdList)
              .then((_teacherFoundList) => _teacherFoundList || [])
              .catch(() => [])) || [];
        }

        if (studentFoundIdList.length) {
          studentFoundList =
            (await this.userEvent
              .getListByIds(studentFoundIdList)
              .then((_studentFoundList) => _studentFoundList || [])
              .catch(() => [])) || [];
        }

        const result: any = {
          ...classroomFound,
          teachers: teacherFoundList,
          students: studentFoundList,
        };

        return resolve(result);
      } catch (error) {
        // return reject(error);
      }
    });
  }

  async create(createClassroom: CreateClassroomDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return new Promise(async (resovle, reject) => {
      try {
        let newClassroomData = await queryRunner.manager
          .getRepository(ClassroomEntity)
          .create(createClassroom);

        const newClassroomDataSave: any = await queryRunner.manager
          .getRepository(ClassroomEntity)
          .save(newClassroomData);

        await queryRunner.commitTransaction();
        await queryRunner.release();

        const newClassroomFound = await this.dataSource
          .getRepository(ClassroomEntity)
          .createQueryBuilder("classroom")
          .where("classroom.id = :id", {
            id: newClassroomDataSave.id,
          })
          .andWhere("classroom.is_deleted = false")
          .orderBy("classroom.created_date", "DESC")
          .getOne();

        return resovle({
          result: newClassroomFound,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return reject(error);
      }
    });
  }

  async update(id: string, updateClassroom: UpdateClassroomDto): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return new Promise(async (resovle, reject) => {
      try {
        let classroomFound = await queryRunner.manager
          .getRepository(ClassroomEntity)
          .createQueryBuilder("classroom")
          .where("classroom.id = :id", {
            id: id,
          })
          .andWhere("classroom.is_deleted = false")
          .getOne();

        if (!classroomFound) {
          return reject({
            code: "",
            message: "",
          });
        }

        await queryRunner.manager
          .getRepository(ClassroomEntity)
          .createQueryBuilder()
          .update(ClassroomEntity)
          .set(updateClassroom)
          .where("id = :id", { id: classroomFound.id })
          .execute();

        await queryRunner.commitTransaction();
        await queryRunner.release();

        classroomFound = await this.dataSource
          .getRepository(ClassroomEntity)
          .createQueryBuilder("classroom")
          .where("classroom.id = :id", {
            id: classroomFound.id,
          })
          .andWhere("classroom.is_deleted = false")
          .getOne();

        return resovle({
          result: classroomFound,
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
        let classroomFound = await queryRunner.manager
          .getRepository(ClassroomEntity)
          .createQueryBuilder("classroom")
          .where("classroom.id = :id", {
            id: id,
          })
          .andWhere("classroom.is_deleted = false")
          .getOne();

        if (!classroomFound) {
          return reject({
            code: "",
            message: "",
          });
        }

        await queryRunner.manager
          .getRepository(ClassroomEntity)
          .createQueryBuilder()
          .update(ClassroomEntity)
          .set({
            isDeleted: true,
          })
          .where("id = :id", { id: classroomFound.id })
          .execute();

        await queryRunner.commitTransaction();
        await queryRunner.release();

        classroomFound = await this.dataSource
          .getRepository(ClassroomEntity)
          .createQueryBuilder("classroom")
          .where("classroom.id = :id", {
            id: classroomFound.id,
          })
          .andWhere("classroom.is_deleted = false")
          .getOne();

        return resovle({
          result: classroomFound,
        });
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        return reject(error);
      }
    });
  }

  async registerClassrooms(classroomIds: string[]) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.registerClassroomsValidator(classroomIds);
        // const successEvent = { event: 'registeredClassroomSuccess', data: classroomIds };
        // const failureEvent = { event: 'registeredClassroomFailed', data: classroomIds };

        // Emit the success event if registration is successful
        // this.eventStoreService.store(successEvent);
        return resolve(classroomIds);
      } catch (error) {
        // Emit the failure event if registration fails and execute the rollback method
        this.logger.error(
          `Classroom registration failed for ${JSON.stringify(
            classroomIds
          )}. Reason: ${error.message}`
        );
        // this.eventStoreService.store(failureEvent);
        // await this.handleRollbackData(failureEvent);
        return reject(error);
      }
    });
  }

  async registerClassroomsValidator(classroomIds) {
    return new Promise((resolve, reject) => {
      try {
        const registerClassPeriodMap = {};

        classroomIds.forEach(async (classroomId) => {
          const classroom = await this.dataSource.manager
            .getRepository(ClassroomEntity)
            .createQueryBuilder("classroom")
            .where(`classroom.id = :classroomId`, {
              classroomId: classroomId,
            });
          const classPeriodListByClassroomId = await this.dataSource.manager
            .getRepository(ClassPeriodEntity)
            .createQueryBuilder("class_period")
            .where(`class_period.id = :classroomId`, {
              classroomId: classroomId,
            })
            .getMany();

          classPeriodListByClassroomId.map((_classPeriodListByClassroomId) => {
            const classPeriodKey = `${_classPeriodListByClassroomId.dateTime}${_classPeriodListByClassroomId.classPeriodTimeRangeId}`;

            if (registerClassPeriodMap[classPeriodKey]) {
              throw new Error(
                `Conflict clsas period, ${classroomId} and ${registerClassPeriodMap[classPeriodKey].classroomId}`
              );
            } else {
              registerClassPeriodMap[classPeriodKey] = {
                classroom,
              };
            }
          });
        });

        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
