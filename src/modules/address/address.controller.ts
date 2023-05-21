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
import { GetAddressListFilterDto as GetAddressListFilterDto } from "./dto/GetAddressListFilter.dto";
import AddressService from "./address.service";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { OrderType } from "src/common/types/Order.type";
import { QueryCommonDto } from "src/common/dto/QueryCommon.dto";
import { FilterOptionsType } from "src/common/types/FilterOptions.type";
import { CreateAddressDto } from "./dto/CreateAddress.dto";
import { UpdateAddressDto } from "./dto/UpdateAddress.dto";
// import { filter } from "lodash";

@ApiBearerAuth()
@Controller("/address")
@ApiTags("address")
export class AddressController {
	constructor(private readonly addressService: AddressService) {}
	@Get("/:id")
	async getOne(@Param("id") id: string) {
		return await this.addressService.getOne(id);
	}

	@ApiQuery({ name: "filter", type: GetAddressListFilterDto })
	@ApiQuery({ name: "filterOptions" })
	@ApiQuery({ name: "perPage", required: false })
	@ApiQuery({ name: "page", required: false })
	@Get("/")
	async getList(@Query() query: QueryCommonDto<GetAddressListFilterDto>) {
		query = parseQuery(query);
		const order: OrderType = query.order;
		const page: number = query.page;
		const perPage: number = query.perPage;
		const filterOptions: FilterOptionsType = query.filterOptions;
		const filter: GetAddressListFilterDto = query.filter;

		return await this.addressService.getList(
			filter,
			order,
			page,
			perPage,
			filterOptions
		);
	}

	@Post("/")
	async create(@Body() createAddressBody: CreateAddressDto) {
		return await this.addressService.create(createAddressBody);
	}

	@Put("/:id")
	async update(
		@Param("id") id: string,
		@Body() updateAddressBody: UpdateAddressDto
	) {
		return await this.addressService.update(id, updateAddressBody);
	}

	@Delete("/:id")
	async delete(@Param("id") id: string) {
		return await this.addressService.delete(id);
	}
}
