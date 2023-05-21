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

import MasterConfigService from "./masterConfig.service";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { OrderType } from "src/common/types/Order.type";
import { QueryCommonDto } from "src/common/dto/QueryCommon.dto";
import { FilterOptionsType } from "src/common/types/FilterOptions.type";
import { GetMasterConfigListFilterDto } from "./dto/GetMasterConfigListFilter.dto";
import { CreateMasterConfigDto } from "./dto/CreateMasterConfig.dto";
import { UpdateMasterConfigDto } from "./dto/UpdateMasterConfig.dto";

@ApiBearerAuth()
@Controller("/master-config")
@ApiTags("masterConfig")
export class MasterConfigController {
  constructor(private readonly masterConfigService: MasterConfigService) {}
  @Get("/:id")
  async getOne(@Param("id") id: string) {
    return await this.masterConfigService.getOne(id);
  }

  @ApiQuery({ name: "filter", type: GetMasterConfigListFilterDto })
  @ApiQuery({ name: "filterOptions" })
  @ApiQuery({ name: "perPage", required: false })
  @ApiQuery({ name: "page", required: false })
  @Get("/")
  async getList(@Query() query: QueryCommonDto<GetMasterConfigListFilterDto>) {
    query = parseQuery(query);
    const order: OrderType = query.order;
    const page: number = query.page;
    const perPage: number = query.perPage;
    const filterOptions: FilterOptionsType = query.filterOptions;
    const filter: GetMasterConfigListFilterDto = query.filter;

    return await this.masterConfigService.getList(
      filter,
      order,
      page,
      perPage,
      filterOptions
    );
  }

  @Post("/")
  async create(@Body() createMasterConfigBody: CreateMasterConfigDto) {
    return await this.masterConfigService.create(createMasterConfigBody);
  }

  @Put("/:id")
  async update(
    @Param("id") id: string,
    @Body() updateMasterConfigBody: UpdateMasterConfigDto
  ) {
    return await this.masterConfigService.update(id, updateMasterConfigBody);
  }

  @Delete("/:id")
  async delete(@Param("id") id: string) {
    return await this.masterConfigService.delete(id);
  }
}
