import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { QueryCommonDto } from "src/common/dto/QueryCommon.dto";
import { FilterOptionsType } from "src/common/types/FilterOptions.type";
import { OrderType } from "src/common/types/Order.type";
import { parseQuery } from "src/common/utils/utils";
import ClassroomService from "./classroom.service";
import { CreateClassroomDto } from "./dto/CreateClassroom.dto";
import { GetClassroomListFilterDto } from "./dto/GetClassroomListFilter.dto";
import { UpdateClassroomDto } from "./dto/UpdateClassroom.dto";
@ApiBearerAuth()
@Controller("/classroom")
@ApiTags("classroom")
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @ApiQuery({ name: "filter", type: GetClassroomListFilterDto })
  @ApiQuery({ name: "filterOptions" })
  @ApiQuery({ name: "perPage", required: false })
  @ApiQuery({ name: "page", required: false })
  @Get("/student/me")
  async getStudentClassroomList(
    @Res() response: Response,
    @Query() query: QueryCommonDto<GetClassroomListFilterDto>
  ) {
    query = parseQuery(query);
    const order: OrderType = query.order;
    const page: number = query.page;
    const perPage: number = query.perPage;
    const filterOptions: FilterOptionsType = query.filterOptions;
    const filter: GetClassroomListFilterDto = query.filter;
    const user: any = response.locals.user;
    return await this.classroomService
      .getStudentClassroomList(
        user,
        filter,
        order,
        page,
        perPage,
        filterOptions
      )
      .then((result: any) => {
        return response.json({
          ...result,
        });
      })
      .catch((error) => {
        response.statusCode = Number(error["httpStatusCode"] || 500);
        response.json({ error });
      });
  }

  @ApiQuery({ name: "filter", type: GetClassroomListFilterDto })
  @ApiQuery({ name: "filterOptions" })
  @ApiQuery({ name: "perPage", required: false })
  @ApiQuery({ name: "page", required: false })
  @Get("/teacher/me")
  async getTeacherClassroomList(
    @Res() response: Response,
    @Query() query: QueryCommonDto<GetClassroomListFilterDto>
  ) {
    query = parseQuery(query);
    const order: OrderType = query.order;
    const page: number = query.page;
    const perPage: number = query.perPage;
    const filterOptions: FilterOptionsType = query.filterOptions;
    const filter: GetClassroomListFilterDto = query.filter;
    const user: any = response.locals.user;
    return await this.classroomService
      .getTeacherClassroomList(
        user,
        filter,
        order,
        page,
        perPage,
        filterOptions
      )
      .then((result: any) => {
        return response.json({
          ...result,
        });
      })
      .catch((error) => {
        response.statusCode = Number(error["httpStatusCode"] || 500);
        response.json({ error });
      });
  }

  @Get("/:id")
  async getOne(@Param("id") id: string) {
    return await this.classroomService.getOne(id);
  }
  @ApiQuery({ name: "filter", type: GetClassroomListFilterDto })
  @ApiQuery({ name: "filterOptions" })
  @ApiQuery({ name: "perPage", required: false })
  @ApiQuery({ name: "page", required: false })
  @Get("/")
  async getList(@Query() query: QueryCommonDto<GetClassroomListFilterDto>) {
    query = parseQuery(query);
    const order: OrderType = query.order;
    const page: number = query.page;
    const perPage: number = query.perPage;
    const filterOptions: FilterOptionsType = query.filterOptions;
    const filter: GetClassroomListFilterDto = query.filter;
    return await this.classroomService.getList(
      filter,
      order,
      page,
      perPage,
      filterOptions
    );
  }

  @Post("/register")
  async registerClassrooms(
    @Res() response: Response,
    @Body() registerClassroomsBody: any
  ) {
    const user: any = response.locals.user;
    const { classroomIds } = registerClassroomsBody;
    await this.classroomService
      .registerClassrooms(classroomIds, user)
      .then((result: any) => {
        return response.json({
          ...result,
        });
      })
      .catch((error) => {
        response.statusCode = Number(error["httpStatusCode"] || 500);
        response.json({ error });
      });
  }

  @Post("/")
  async create(@Body() createClassroomBody: CreateClassroomDto) {
    return await this.classroomService.create(createClassroomBody);
  }

  @Put("/:id")
  async update(
    @Param("id") id: string,
    @Body() updateClassroomBody: UpdateClassroomDto
  ) {
    return await this.classroomService.update(id, updateClassroomBody);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    return await this.classroomService.delete(id);
  }
}
