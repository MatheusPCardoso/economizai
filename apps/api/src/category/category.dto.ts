import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { PartialType, OmitType } from '@nestjs/mapped-types'
import { CategoryType } from '@prisma/client'

class CreateNestedSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  icon?: string
}

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  icon?: string

  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType

  @IsString()
  @IsNotEmpty()
  walletId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNestedSubcategoryDto)
  @IsOptional()
  subcategories?: CreateNestedSubcategoryDto[]
}

class UpdateNestedSubcategoryDto extends PartialType(CreateNestedSubcategoryDto) {
  @IsString()
  @IsOptional()
  id?: string
}

export class UpdateCategoryDto extends PartialType(
  OmitType(CreateCategoryDto, ['subcategories'] as const)
) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateNestedSubcategoryDto)
  @IsOptional()
  subcategories?: UpdateNestedSubcategoryDto[]
}

export class CreateSubcategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  icon?: string

  @IsString()
  @IsNotEmpty()
  categoryId: string

  @IsString()
  @IsNotEmpty()
  walletId: string
}

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {}
