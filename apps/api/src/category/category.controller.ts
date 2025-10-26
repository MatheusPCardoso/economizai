import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { CategoryService } from './category.service'
import {
  CreateCategoryDto,
  CreateSubcategoryDto,
  UpdateCategoryDto,
  UpdateSubcategoryDto,
} from './category.dto'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  @Get('/wallet')
  findAllByWallet(@Query('id') id: string) {
    return this.categoryService.findAllByWalletId(id)
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.categoryService.find(id)
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto)
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id)
  }

  @Post('/subcategory')
  createSubcategory(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.categoryService.createSubcategory(createSubcategoryDto)
  }

  @Patch('/subcategory/:id')
  updateSubcategory(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.categoryService.updateSubcategory(id, updateSubcategoryDto)
  }

  @Delete('/subcategory/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSubcategory(@Param('id') id: string) {
    return this.categoryService.removeSubcategory(id)
  }
}
