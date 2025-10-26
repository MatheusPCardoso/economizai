import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@database/database.service'
import {
  CreateCategoryDto,
  CreateSubcategoryDto,
  UpdateCategoryDto,
  UpdateSubcategoryDto,
} from './category.dto'

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async find(id: string) {
    const category = await this.databaseService.category.findUnique({
      where: { id },
      include: { subcategories: true },
    })
    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`)
    }
    return category
  }

  async findAllByWalletId(walletId: string) {
    return this.databaseService.category.findMany({
      where: { OR: [{ walletId }, { isDefault: true }] },
      include: {
        subcategories: {
          where: { OR: [{ walletId }, { isDefault: true }] },
          orderBy: { name: 'desc' },
        },
      },
      orderBy: { name: 'desc' },
    })
  }

  async create(dto: CreateCategoryDto) {
    return this.databaseService.$transaction(async (prisma) => {
      const category = await prisma.category.create({
        data: {
          name: dto.name,
          icon: dto.icon,
          type: dto.type,
          walletId: dto.walletId,
        },
      })

      if (dto.subcategories && dto.subcategories.length > 0) {
        await prisma.subcategory.createMany({
          data: dto.subcategories.map((sub) => ({
            ...sub,
            categoryId: category.id,
            walletId: dto.walletId,
          })),
        })
      }

      return prisma.category.findUnique({ where: { id: category.id } })
    })
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const categoryExists = await this.databaseService.category.findUnique({
      where: { id },
      select: { id: true },
    })

    if (!categoryExists) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`)
    }

    return this.databaseService.$transaction(async (prisma) => {
      const existingCategory = await prisma.category.findUnique({
        where: { id },
        include: { subcategories: true },
      })

      const { subcategories, ...categoryData } = dto

      if (Object.keys(categoryData).length > 0) {
        await prisma.category.update({
          where: { id },
          data: categoryData,
        })
      }

      if (subcategories) {
        const existingSubcategories = existingCategory.subcategories
        const dtoSubcategoryIds = subcategories.map((s) => s.id).filter(Boolean)

        const toDelete = existingSubcategories.filter((sub) => !dtoSubcategoryIds.includes(sub.id))
        if (toDelete.length > 0) {
          await prisma.subcategory.deleteMany({
            where: { id: { in: toDelete.map((s) => s.id) } },
          })
        }

        for (const subDto of subcategories) {
          if (subDto.id) {
            await prisma.subcategory.update({
              where: { id: subDto.id },
              data: { name: subDto.name, icon: subDto.icon },
            })
          } else {
            await prisma.subcategory.create({
              data: {
                name: subDto.name,
                icon: subDto.icon,
                categoryId: id,
                walletId: existingCategory.walletId,
              },
            })
          }
        }
      }

      return prisma.category.findUnique({
        where: { id },
        include: {
          subcategories: {
            orderBy: { name: 'asc' },
          },
        },
      })
    })
  }

  async remove(id: string) {
    await this.find(id)
    return this.databaseService.$transaction(async (prisma) => {
      await prisma.subcategory.deleteMany({ where: { categoryId: id } })
      return await prisma.category.delete({ where: { id } })
    })
  }

  async createSubcategory(dto: CreateSubcategoryDto) {
    return this.databaseService.subcategory.create({ data: dto })
  }

  async updateSubcategory(id: string, dto: UpdateSubcategoryDto) {
    return this.databaseService.subcategory.update({ where: { id }, data: dto })
  }

  async removeSubcategory(id: string) {
    return this.databaseService.subcategory.delete({ where: { id } })
  }
}
