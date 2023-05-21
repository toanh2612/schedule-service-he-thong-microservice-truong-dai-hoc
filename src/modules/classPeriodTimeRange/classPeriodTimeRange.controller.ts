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
import { GetClassPeriodTimeRangeListFilterDto as GetClassPeriodTimeRangeListFilterDto } from "./dto/GetClassPeriodTimeRangeListFilterDto.dto";
import ClassPeriodTimeRangeService from "./classPeriodTimeRange.service";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { QueryCommonDto } from "src/common/dto/QueryCommon.dto";
import { OrderType } from "src/common/types/Order.type";
import { FilterOptionsType } from "src/common/types/FilterOptions.type";
import { CreateClassPeriodTimeRange } from "./dto/CreateClassPeriodTimeRange.dto";
import { UpdateClassPeriodTimeRange } from "./dto/UpdateClassPeriodTimeRange.dto";

@ApiBearerAuth()
@Controller("/class-period-time-range")
@ApiTags("class-period-time-range")
export class ClassPeriodTimeRangeController {
	constructor(
		private readonly classPeriodTimeRangeService: ClassPeriodTimeRangeService
	) {}
	@Get("/:id")
	async getOne(@Param("id") id: string) {
		return await this.classPeriodTimeRangeService.getOne(id);
	}

	@ApiQuery({ name: "filter", type: GetClassPeriodTimeRangeListFilterDto })
	@ApiQuery({ name: "filterOptions" })
	@ApiQuery({ name: "perPage", required: false })
	@ApiQuery({ name: "page", required: false })
	@Get("/")
	async getList(
		@Query() query: QueryCommonDto<GetClassPeriodTimeRangeListFilterDto>
	) {
		query = parseQuery(query);
		const order: OrderType = query.order;
		const page: number = query.page;
		const perPage: number = query.perPage;
		const filterOptions: FilterOptionsType = query.filterOptions;
		const filter: GetClassPeriodTimeRangeListFilterDto = query.filter;
		return await this.classPeriodTimeRangeService.getList(
			filter,
			order,
			page,
			perPage,
			filterOptions
		);
	}

	@Post("/")
	async create(
		@Body() createClassPeriodTimeRangeBody: CreateClassPeriodTimeRange
	) {
		return await this.classPeriodTimeRangeService.create(
			createClassPeriodTimeRangeBody
		);
	}

	@Put("/:id")
	async update(
		@Param("id") id: string,
		@Body() updateClassPeriodTimeRangeBody: UpdateClassPeriodTimeRange
	) {
		return await this.classPeriodTimeRangeService.update(
			id,
			updateClassPeriodTimeRangeBody
		);
	}

	@Delete("/:id")
	async delete(@Param("id") id: string) {
		return await this.classPeriodTimeRangeService.delete(id);
	}
}
