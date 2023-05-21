import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { parseQuery } from "src/common/utils/utils";
import { GetClassroomListFilterDto } from "./dto/GetClassroomListFilter.dto";
import ClassroomService from "./classroom.service";
import { CreateClassroomDto } from "./dto/CreateClassroom.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { QueryCommonDto } from "src/common/dto/QueryCommon.dto";
import { OrderType } from "src/common/types/Order.type";
import { FilterOptionsType } from "src/common/types/FilterOptions.type";
import { UpdateClassroomDto } from "./dto/UpdateClassroom.dto";
import UserEvent from "../user/user.event";

@ApiBearerAuth()
@Controller("/classroom")
@ApiTags("classroom")
export class ClassroomController {
  constructor(
    private readonly classroomService: ClassroomService,
    private readonly userEvent: UserEvent
  ) {}
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

  @Post("/register")
  async registerClassrooms(
    @Headers("authorization") authorization: string
    // @Body() registerClassroomsBody: any
  ) {
    const accessToken: string | null =
      (authorization && authorization.split(" ")[1]) || null;

    const authResult: any = await this.userEvent.authUser(accessToken);

    if (!authResult || (authResult && !authResult.decoded)) {
      throw new Error("Auth error");
    }

    // const { decoded } = authResult;
    // return await this.classroomService.getList();
  }
}
