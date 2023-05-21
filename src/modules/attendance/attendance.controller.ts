import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { parseQuery } from "src/common/utils/utils";
import { GetAttendanceListFilterDto as GetAttendanceListFilterDto } from "./dto/GetAttendanceListFilter.dto";
import AttendanceService from "./attendance.service";
import { UpdateAttendanceDto } from "./dto/UpdateAttendance.dto";
import { CreateAttendanceDto } from "./dto/CreateAttendance.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { OrderType } from "src/common/types/Order.type";
import { FilterOptionsType } from "src/common/types/FilterOptions.type";
import { QueryCommonDto } from "src/common/dto/QueryCommon.dto";

@ApiBearerAuth()
@Controller("/attendance")
@ApiTags("attendance")
export class AttendanceController {
	constructor(private readonly attendanceService: AttendanceService) {}
	@Get("/:id")
	async getOne(@Param("id") id: string) {
		return await this.attendanceService.getOne(id);
	}
	@ApiQuery({ name: "filter", type: GetAttendanceListFilterDto })
	@ApiQuery({ name: "filterOptions" })
	@ApiQuery({ name: "perPage", required: false })
	@ApiQuery({ name: "page", required: false })
	@Get("/")
	async getList(@Query() query: QueryCommonDto<GetAttendanceListFilterDto>) {
		query = parseQuery(query);
		const order: OrderType = query.order;
		const page: number = query.page;
		const perPage: number = query.perPage;
		const filterOptions: FilterOptionsType = query.filterOptions;
		const filter: GetAttendanceListFilterDto = query.filter;

		return await this.attendanceService.getList(
			filter,
			order,
			page,
			perPage,
			filterOptions
		);
	}

	@Post("/")
	async create(@Body() createAttendanceBody: CreateAttendanceDto) {
		return await this.attendanceService.create(createAttendanceBody);
	}

	@Put("/:id")
	async update(
		@Param("id") id: string,
		@Body() updateAttendanceBody: UpdateAttendanceDto
	) {
		return await this.attendanceService.update(id, updateAttendanceBody);
	}

	@Delete("/:id")
	async delete(@Param("id") id: string) {
		return await this.attendanceService.delete(id);
	}
}
