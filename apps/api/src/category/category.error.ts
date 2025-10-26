export class FindCategoryError extends Error {
  constructor(message: string) {
    super(`Falha ao buscar categoria: ${message}`)
  }
}
