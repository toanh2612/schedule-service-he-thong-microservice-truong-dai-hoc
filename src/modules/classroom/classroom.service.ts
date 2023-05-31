import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
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
import { CONSTANT } from "src/common/utils/constant";
import RabbitMQService from "../rabbitMQ/rabbitMQ.service";
import EventEmitterService from "../eventEmitter/evenEmitter.service";
import { v4 } from "uuid";
import EventStoreService from "../eventStore/eventStore.service";
import { MasterConfigEntity } from "src/common/entities/masterConfig.entity";
const PromiseBlueBird = require("bluebird");
@Injectable({ scope: Scope.DEFAULT })
export default class ClassroomService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private userEvent: UserEvent,
    private logger: Logger,
    private rabbitMQService: RabbitMQService,
    private eventEmitterService: EventEmitterService,
    @Inject(EventStoreService)
    private eventStoreService: EventStoreService
  ) {
    this.eventEmitterService
      .get()
      .on(
        CONSTANT.EVENT.PAYMENT.PAYMENT_CREATION_SUCCESSED,
        this.paymentCreationSucceededEventHandler.bind(this)
      );
    this.eventEmitterService
      .get()
      .on(
        CONSTANT.EVENT.PAYMENT.PAYMENT_CREATION_FAILED,
        this.paymentCreationFailedEventHandler.bind(this)
      );
    this.eventEmitterService
      .get()
      .on(
        CONSTANT.EVENT.PAYMENT.PAYMENT_SUCCESSED,
        this.paymentSucceededEventHandler.bind(this)
      );
    this.eventEmitterService
      .get()
      .on(
        CONSTANT.EVENT.PAYMENT.PAYMENT_FAILED,
        this.paymentCanceledEventHandler.bind(this)
      );
    this.eventEmitterService
      .get()
      .on(
        CONSTANT.EVENT.PAYMENT.PAYMENT_CANCELED,
        this.paymentCanceledEventHandler.bind(this)
      );
  }

  async getStudentClassroomList(
    student: any,
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
        const classroomStudentList = await this.dataSource
          .getRepository(ClassroomStudentEntity)
          .createQueryBuilder("classroom_student")
          .where("classroom_student.student_id = :studentId", {
            studentId: student.id,
          })
          .andWhere("classroom_student.status = :status", {
            status: CONSTANT.ENTITY.CLASSROOM_STUDENT.STATUS.FINISHED,
          })
          .getMany();

        const classroomIdList = classroomStudentList.map((classroomStudent) => {
          return classroomStudent.classroomId;
        });

        if (classroomIdList && !classroomIdList.length) {
          return resolve({
            result: [],
            paging: {
              page,
              perPage,
              total: 0,
            },
          });
        }

        let getClassroomListQuery = await this.dataSource
          .getRepository(ClassroomEntity)
          .createQueryBuilder("classroom")
          .where("classroom.is_deleted = false")
          .where("classroom.id IN (:...classroomIdList)", {
            classroomIdList,
          })
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

  async getTeacherClassroomList(
    teacher: any,
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
        const teacherClassroomList = await this.dataSource
          .getRepository(ClassroomTeacherEntity)
          .createQueryBuilder("classroom_student")
          .where("classroom_student.teacher_id = :teacherId", {
            teacherId: teacher.id,
          })
          .getMany();

        const classroomIdList = teacherClassroomList.map((classroomStudent) => {
          return classroomStudent.classroomId;
        });

        if (classroomIdList && !classroomIdList.length) {
          return resolve({
            result: [],
            paging: {
              page,
              perPage,
              total: 0,
            },
          });
        }

        let getClassroomListQuery = await this.dataSource
          .getRepository(ClassroomEntity)
          .createQueryBuilder("classroom")
          .where("classroom.is_deleted = false")
          .where("classroom.id IN (:...classroomIdList)", {
            classroomIdList,
          })
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

        return resolve({
          result,
        });
      } catch (error) {
        return reject(error);
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

  async registerClassroomsValidator(classroomIds: string[], studentId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const registerClassPeriodMap = {};

        await PromiseBlueBird.each(classroomIds, async (classroomId) => {
          const classroom = await this.dataSource.manager
            .getRepository(ClassroomEntity)
            .createQueryBuilder("classroom")
            .where(`classroom.id = :classroomId`, {
              classroomId: classroomId,
            })
            .andWhere(`classroom.is_deleted = :isDeleted`, {
              isDeleted: false,
            })
            .getOne();

          if (!classroom) {
            return reject(CONSTANT.ERROR.CLASSROOM.NOT_FOUND.message);
          }

          const classroomStudentFound = await this.dataSource.manager
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: classroomId,
            })
            .andWhere("classroom_student.student_id = :studentId", {
              studentId: studentId,
            })
            .getOne();

          if (classroomStudentFound) {
            return reject(
              CONSTANT.ERROR.CLASSROOM_STUDENT.REGISTERED_CLASSROOM
            );
          }
          const classPeriodListByClassroomId = await this.dataSource.manager
            .getRepository(ClassPeriodEntity)
            .createQueryBuilder("class_period")
            .where(`class_period.id = :classroomId`, {
              classroomId: classroomId,
            })
            .getMany();

          await PromiseBlueBird.each(
            classPeriodListByClassroomId,
            (_classPeriodListByClassroomId) => {
              const classPeriodKey = `${_classPeriodListByClassroomId.dateTime}${_classPeriodListByClassroomId.classPeriodTimeRangeId}`;

              if (registerClassPeriodMap[classPeriodKey]) {
                return reject(
                  `Conflict class period, ${classroomId} and ${registerClassPeriodMap[classPeriodKey].classroomId}`
                );
              } else {
                registerClassPeriodMap[classPeriodKey] = {
                  classroom,
                };
              }
            }
          );
        });

        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    });
  }

  async registerClassrooms(classroomIds: string[], student: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let currentStep: number;
    let compensationId: string;
    return new Promise(async (resolve, reject) => {
      try {
        compensationId = v4();
        currentStep = await this.eventStoreService.getCurrentStep(
          compensationId
        );
        await this.registerClassroomsValidator(classroomIds, student.id)
          .then(async () => {
            const classroomList = [];

            await PromiseBlueBird.each(classroomIds, async (classroomId) => {
              const classroomFound = await this.dataSource
                .getRepository(ClassroomEntity)
                .createQueryBuilder("classroom")
                .leftJoinAndSelect("classroom.subject", "subject")
                .where("classroom.id = :classroomId", {
                  classroomId,
                })
                .getOne();

              classroomList.push(classroomFound);

              const classroomStudentFound = await this.dataSource
                .getRepository(ClassroomStudentEntity)
                .createQueryBuilder("classroom_student")
                .where("classroom_student.classroom_id = :classroomId", {
                  classroomId: classroomId,
                })
                .andWhere("classroom_student.student_id = :studentId", {
                  studentId: student.id,
                })
                .getOne();

              if (classroomStudentFound) {
                return reject(CONSTANT.ERROR.CLASSROOM_STUDENT);
              }

              const newClassroomStudent = await queryRunner.manager
                .getRepository(ClassroomStudentEntity)
                .save({
                  studentId: student.id,
                  classroomId: classroomId,
                  status:
                    CONSTANT.ENTITY.CLASSROOM_STUDENT.STATUS
                      .AWAITTING_CREATE_PAYMENT,
                });

              await this.eventStoreService.commit(
                compensationId,
                null,
                newClassroomStudent,
                "CLASSROOM_STUDENT"
              );
            });

            const feePerCreditFound = await this.dataSource.manager
              .getRepository(MasterConfigEntity)
              .createQueryBuilder("masterConfig")
              .where("masterConfig.key = :key", {
                key: "FEE_PER_CREDIT",
              })
              .getOne();

            const feePerCredit = feePerCreditFound
              ? Number(feePerCreditFound.value || 0)
              : 0;

            const payload = {
              classroomList,
              student: student,
              compensationId,
              feePerCredit,
            };
            await this.rabbitMQService.sendToqueue(
              CONSTANT.EVENT.SCHEDULE.REGISTER_CLASSROOMS,
              {
                ...payload,
              }
            );

            await queryRunner.commitTransaction();
            await queryRunner.release();

            return resolve({
              result: {
                ...payload,
              },
            });
          })
          .catch((e) => {
            return reject(e);
          });
      } catch (error) {
        this.logger.error(
          `Classroom registration failed for ${classroomIds}. Reason: ${error.message}`
        );
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        await this.eventStoreService.revertToStep(compensationId, currentStep);
        return reject(error);
      }
    });
  }

  async paymentCreationFailedEventHandler(payload: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = payload;
        const { compensationId } = data;
        await this.eventStoreService.rollback(compensationId);
        return resolve({
          result: true,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async paymentCreationSucceededEventHandler(payload: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { data } = payload;
    const { classroomList, student, compensationId, payment } = data;
    const currentStep = await this.eventStoreService.getCurrentStep(
      compensationId
    );
    return new Promise(async (resolve, reject) => {
      try {
        if (!classroomList.length) {
          return reject(false);
        }

        const classroomIds = classroomList.map((classroom) => classroom.id);

        await PromiseBlueBird.each(classroomIds, async (classroomId) => {
          const classroomStudentOriginData = await queryRunner.manager
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: classroomId,
            })
            .andWhere("classroom_student.student_id = :studentId", {
              studentId: student.id,
            })
            .getOne();

          await queryRunner.manager
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .update(ClassroomStudentEntity)
            .set({
              status:
                CONSTANT.ENTITY.CLASSROOM_STUDENT.STATUS.AWAITTING_PAYMENT,
              paymentId: payment.id,
            })
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: classroomId,
            })
            .andWhere("classroom_student.student_id = :studentId", {
              studentId: student.id,
            })
            .execute();

          const classroomStudentUpdateData = await queryRunner.manager
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: classroomId,
            })
            .andWhere("classroom_student.student_id = :studentId", {
              studentId: student.id,
            })
            .getOne();

          await this.eventStoreService.commit(
            compensationId,
            classroomStudentOriginData,
            classroomStudentUpdateData,
            "CLASSROOM_STUDENT"
          );
        });

        await queryRunner.commitTransaction();
        await queryRunner.release();

        return resolve({
          result: true,
        });
      } catch (error) {
        await this.eventStoreService.revertToStep(compensationId, currentStep);
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        return reject(error);
      }
    });
  }

  async paymentSucceededEventHandler(payload: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { data } = payload;
    const { classroomList, student, compensationId } = data;
    const currentStep = await this.eventStoreService.getCurrentStep(
      compensationId
    );
    return new Promise(async (resolve, reject) => {
      try {
        const classroomIds = classroomList.map((classroom) => {
          return classroom.id;
        });
        if (!classroomIds.length) {
          return reject(false);
        }

        await PromiseBlueBird.each(classroomIds, async (classroomId) => {
          const classroomStudentOriginData = await queryRunner.manager
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: classroomId,
            })
            .andWhere("classroom_student.student_id = :studentId", {
              studentId: student.id,
            })
            .getOne();

          await queryRunner.manager
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .update(ClassroomStudentEntity)
            .set({
              status: CONSTANT.ENTITY.CLASSROOM_STUDENT.STATUS.FINISHED,
            })
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: classroomId,
            })
            .andWhere("classroom_student.student_id = :studentId", {
              studentId: student.id,
            })
            .execute();

          const classroomStudentUpdateData = await queryRunner.manager
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: classroomId,
            })
            .andWhere("classroom_student.student_id = :studentId", {
              studentId: student.id,
            })
            .getOne();

          await this.eventStoreService.commit(
            compensationId,
            classroomStudentOriginData,
            classroomStudentUpdateData,
            "CLASSROOM_STUDENT"
          );
        });
        await queryRunner.commitTransaction();
        await queryRunner.release();

        return resolve({
          result: true,
        });
      } catch (error) {
        await this.eventStoreService.revertToStep(compensationId, currentStep);
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        return reject(error);
      }
    });
  }

  async paymentCanceledEventHandler(payload: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = payload;
        const { compensationId } = data;
        await this.eventStoreService.rollback(compensationId);
        return resolve({
          result: true,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async paymentFailedEventHandler(payload: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { data } = payload;
    const { classroomList, student, compensationId } = data;
    const currentStep = await this.eventStoreService.getCurrentStep(
      compensationId
    );
    return new Promise(async (resolve, reject) => {
      try {
        const classroomIds = classroomList.map((classroom) => {
          return classroom.id;
        });
        if (!classroomIds.length) {
          return reject(false);
        }

        await PromiseBlueBird.each(classroomIds, async (classroomId) => {
          const classroomStudentOriginData = await queryRunner.manager
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: classroomId,
            })
            .andWhere("classroom_student.student_id = :studentId", {
              studentId: student.id,
            })
            .getOne();

          await queryRunner.manager
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .update(ClassroomStudentEntity)
            .set({
              paymentId: null,
            })
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: classroomId,
            })
            .andWhere("classroom_student.student_id = :studentId", {
              studentId: student.id,
            })
            .execute();

          const classroomStudentUpdateData = await queryRunner.manager
            .getRepository(ClassroomStudentEntity)
            .createQueryBuilder("classroom_student")
            .where("classroom_student.classroom_id = :classroomId", {
              classroomId: classroomId,
            })
            .andWhere("classroom_student.student_id = :studentId", {
              studentId: student.id,
            })
            .getOne();

          await this.eventStoreService.commit(
            compensationId,
            classroomStudentOriginData,
            classroomStudentUpdateData,
            "CLASSROOM_STUDENT"
          );
        });

        const feePerCreditFound = await this.dataSource.manager
          .getRepository(MasterConfigEntity)
          .createQueryBuilder("masterConfig")
          .where("masterConfig.key = :key", {
            key: "FEE_PER_CREDIT",
          })
          .getOne();

        const feePerCredit = feePerCreditFound
          ? Number(feePerCreditFound.value || 0)
          : 0;

        const payload = {
          classroomList,
          student: student,
          compensationId,
          feePerCredit,
        };
        await this.rabbitMQService.sendToqueue(
          CONSTANT.EVENT.SCHEDULE.REGISTER_CLASSROOMS,
          {
            ...payload,
          }
        );

        await queryRunner.commitTransaction();
        await queryRunner.release();

        return resolve({
          result: true,
        });
      } catch (error) {
        await this.eventStoreService.revertToStep(compensationId, currentStep);
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        return reject(error);
      }
    });
  }
}
