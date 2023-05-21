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
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { QueryCommonDto } from "src/common/dto/QueryCommon.dto";
import { FilterOptionsType } from "src/common/types/FilterOptions.type";
import { OrderType } from "src/common/types/Order.type";
import { parseQuery } from "src/common/utils/utils";
import { CreateSubjectDto } from "./dto/CreateSubject.dto";
import { GetSubjectListFilterDto } from "./dto/GetSubjectListFilter.dto";
import { UpdateSubjectDto } from "./dto/UpdateSubject.dto";
import SubjectService from "./subject.service";

@ApiBearerAuth()
@ApiTags("subject")
@Controller("/subject")
export class SubjectController {
	constructor(private readonly subjectService: SubjectService) {}
	@Get("/:id")
	async getOne(@Param("id") id: string) {
		return await this.subjectService.getOne(id);
	}

	@ApiQuery({ name: "filter", type: GetSubjectListFilterDto })
	@ApiQuery({ name: "filterOptions" })
	@ApiQuery({ name: "perPage", required: false })
	@ApiQuery({ name: "page", required: false })
	@Get("/")
	async getList(@Query() query: QueryCommonDto<GetSubjectListFilterDto>) {
		query = parseQuery(query);
		const order: OrderType = query.order;
		const page: number = query.page;
		const perPage: number = query.perPage;
		const filterOptions: FilterOptionsType = query.filterOptions;
		const filter: GetSubjectListFilterDto = query.filter;
		return await this.subjectService.getList(
			filter,
			order,
			page,
			perPage,
			filterOptions
		);
	}

	@Post("/")
	async create(@Body() createSubjectBody: CreateSubjectDto) {
		return await this.subjectService.create(createSubjectBody);
	}

	@Put("/:id")
	async update(
		@Param("id") id: string,
		@Body() updateSubjectBody: UpdateSubjectDto
	) {
		return await this.subjectService.update(id, updateSubjectBody);
	}

	@Delete("/:id")
	async delete(@Param("id") id: string) {
		return await this.subjectService.delete(id);
	}
}
