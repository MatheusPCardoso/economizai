import { Prisma, Category } from '@prisma/client'

export type CategoryWithSubcategories = Prisma.CategoryGetPayload<{
  include: {
    subcategories: true
  }
}>

export type CreateCategoryResponse = Category
export type UpdateCategoryResponse = Category
export type DeleteCategoryResponse = Category
export type AllCategoriesResponse = CategoryWithSubcategories[]
