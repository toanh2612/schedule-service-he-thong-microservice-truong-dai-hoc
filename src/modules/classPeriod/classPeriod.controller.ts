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
import { parseQuery } from "src/common/utils/utils";
import { GetClassPeriodListFilterDto as GetClassPeriodListFilterDto } from "./dto/GetClassPeriodListFilter.dto";
import ClassPeriodService from "./classPeriod.service";
import { CreateClassPeriodDto } from "./dto/CreateClassPeriod.dto";
import { UpdateClassPeriodDto } from "./dto/UpdateClassPeriod.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { FilterOptionsType } from "src/common/types/FilterOptions.type";
import { OrderType } from "src/common/types/Order.type";
import { QueryCommonDto } from "src/common/dto/QueryCommon.dto";
import { Response } from "express";

@ApiBearerAuth()
@Controller("/class-period")
@ApiTags("class-period")
export class ClassPeriodController {
  constructor(private readonly classPeriodService: ClassPeriodService) {}

  @ApiQuery({ name: "filter", type: GetClassPeriodListFilterDto })
  @ApiQuery({ name: "filterOptions" })
  @ApiQuery({ name: "perPage", required: false })
  @ApiQuery({ name: "page", required: false })
  @Get("/teacher/me")
  async getTeacherClassroomPeriodList(
    @Res() response: Response,
    @Query() query: QueryCommonDto<GetClassPeriodListFilterDto>
  ) {
    query = parseQuery(query);
    const order: OrderType = query.order;
    const page: number = query.page;
    const perPage: number = query.perPage;
    const filterOptions: FilterOptionsType = query.filterOptions;
    const filter: GetClassPeriodListFilterDto = query.filter;
    const user: any = response.locals.user;
    return await this.classPeriodService
      .getStudentClassroomPeriodList(
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

  @ApiQuery({ name: "filter", type: GetClassPeriodListFilterDto })
  @ApiQuery({ name: "filterOptions" })
  @ApiQuery({ name: "perPage", required: false })
  @ApiQuery({ name: "page", required: false })
  @Get("/student/me")
  async getStudentClassroomPeriodList(
    @Res() response: Response,
    @Query() query: QueryCommonDto<GetClassPeriodListFilterDto>
  ) {
    query = parseQuery(query);
    const order: OrderType = query.order;
    const page: number = query.page;
    const perPage: number = query.perPage;
    const filterOptions: FilterOptionsType = query.filterOptions;
    const filter: GetClassPeriodListFilterDto = query.filter;
    const user: any = response.locals.user;
    return await this.classPeriodService
      .getStudentClassroomPeriodList(
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
    return await this.classPeriodService.getOne(id);
  }

  @ApiQuery({ name: "filter", type: GetClassPeriodListFilterDto })
  @ApiQuery({ name: "filterOptions" })
  @ApiQuery({ name: "perPage", required: false })
  @ApiQuery({ name: "page", required: false })
  @Get("/")
  async getList(@Query() query: QueryCommonDto<GetClassPeriodListFilterDto>) {
    query = parseQuery(query);
    const order: OrderType = query.order;
    const page: number = query.page;
    const perPage: number = query.perPage;
    const filterOptions: FilterOptionsType = query.filterOptions;
    const filter: GetClassPeriodListFilterDto = query.filter;
    return await this.classPeriodService.getList(
      filter,
      order,
      page,
      perPage,
      filterOptions
    );
  }

  @Post("/")
  async create(@Body() createClassPeriodBody: CreateClassPeriodDto) {
    return await this.classPeriodService.create(createClassPeriodBody);
  }

  @Put("/:id")
  async update(
    @Param("id") id: string,
    @Body() updateClassPeriodBody: UpdateClassPeriodDto
  ) {
    return await this.classPeriodService.update(id, updateClassPeriodBody);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    return await this.classPeriodService.delete(id);
  }
}
