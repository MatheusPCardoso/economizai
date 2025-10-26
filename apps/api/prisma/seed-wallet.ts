import { PrismaClient, TransactionType } from '@prisma/client'
import { subMonths } from 'date-fns'

const prisma = new PrismaClient()

// --- Helpers ---
function mulberry32(seed: number) {
  // PRNG determinístico simples (boa para seed reproducível)
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

// Gera uma Date UTC ao meio-dia para evitar deslocamento de dia por fuso.
const makeUtcDate = (year: number, monthIndex: number, day = 1) =>
  new Date(Date.UTC(year, monthIndex, day, 12, 0, 0))

// Converte BRL (ex: 50.00) em centavos (5000)
const brlToCents = (brl: number) => Math.round(brl * 100)

// safeRound para quantias com duas casas (apenas por segurança)
const safeRound2 = (n: number) => Math.round(n * 100) / 100

// --- Dados base ---
const CATEGORIES = [
  {
    name: 'Salário',
    type: 'REVENUE',
    icon: '💼',
    subs: [] as string[],
  },
  {
    name: 'Investimentos',
    type: 'REVENUE',
    icon: '📈',
    subs: ['Dividendos', 'Venda de Ativos'],
  },
  {
    name: 'Moradia',
    type: 'SPENT',
    icon: '🏠',
    subs: ['Aluguel', 'Condomínio', 'Energia'],
  },
  {
    name: 'Alimentação',
    type: 'SPENT',
    icon: '🍽️',
    subs: ['Supermercado', 'Restaurante', 'Lanches'],
  },
  {
    name: 'Transporte',
    type: 'SPENT',
    icon: '🚗',
    subs: ['Combustível', 'Apps de Carona', 'Passagens'],
  },
  {
    name: 'Lazer',
    type: 'SPENT',
    icon: '🎬',
    subs: ['Streaming', 'Cinema', 'Viagem'],
  },
  {
    name: 'Saúde',
    type: 'SPENT',
    icon: '🩺',
    subs: ['Medicamentos', 'Consultas'],
  },
]

// --- Lógica principal ---
async function main() {
  const walletId = process.argv[2]
  if (!walletId) {
    console.error('Uso: npx ts-node prisma/seed-wallet.ts <WALLET_ID> [months=12] [seed?]')
    process.exit(1)
  }

  // months optional (default 12)
  const monthsArg = Number(process.argv[3] ?? 12)
  const monthsBack = Number.isFinite(monthsArg) && monthsArg > 0 ? Math.floor(monthsArg) : 12

  // opcional: seed manual (inteiro). Se não, derivamos do walletId.
  const providedSeed = process.argv[4]
  let seed = 0
  if (providedSeed && !Number.isNaN(Number(providedSeed))) {
    seed = Number(providedSeed) | 0
  } else {
    // Deriva seed do walletId (hash simples)
    for (let i = 0; i < walletId.length; i++) seed = (seed * 31 + walletId.charCodeAt(i)) | 0
  }
  const rand = mulberry32(seed)

  // Verifica se wallet existe
  const wallet = await prisma.wallet.findUnique({ where: { id: walletId } })
  if (!wallet) {
    console.error(`Carteira "${walletId}" não encontrada. Crie a wallet primeiro.`)
    await prisma.$disconnect()
    process.exit(1)
  }

  console.log(`Seed para wallet=${walletId} | months=${monthsBack} | seed=${seed}`)

  // Cria categorias (ou usa existentes) e mapeia subcategories
  const createdCategories: { id: string; name: string; subMap: Map<string, string> }[] = []

  for (const cat of CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, walletId },
      include: { subcategories: true },
    })
    if (existing) {
      const subMap = new Map(existing.subcategories.map((s) => [s.name, s.id]))
      createdCategories.push({ id: existing.id, name: existing.name, subMap })
      console.log(`> Categoria existente: ${cat.name}`)
      continue
    }

    const created = await prisma.category.create({
      data: {
        name: cat.name,
        type: cat.type as any,
        icon: cat.icon,
        isDefault: false,
        walletId,
        subcategories: {
          create: cat.subs.map((s) => ({ name: s, isDefault: false, walletId })),
        },
      },
      include: { subcategories: true },
    })

    const subMap = new Map(created.subcategories.map((s) => [s.name, s.id]))
    createdCategories.push({ id: created.id, name: created.name, subMap })
    console.log(`> Categoria criada: ${created.name} (${created.subcategories.length} subcats)`)
  }

  // --- Gera transações (últimos N meses) ---
  console.log(`Gerando transações (últimos ${monthsBack} meses)...`)

  type PendingTx = {
    name: string
    amount: number
    type: TransactionType
    recurring?: boolean
    categoryId: string
    subcategoryId?: string | null
    walletId: string
    reference: Date
  }

  const transactionsToCreate: PendingTx[] = []
  const now = new Date()

  // Conveniência: map de categorias por nome
  const catMap = new Map(createdCategories.map((c) => [c.name, c]))

  for (let m = 0; m < monthsBack; m++) {
    const d = subMonths(now, m)
    const year = d.getUTCFullYear()
    const monthIndex = d.getUTCMonth()

    // ---------- RECEITAS ----------
    // 1) Salário (recorrente todo mês — dia 5)
    const salarioCat = catMap.get('Salário')!
    const salarioBase = 5000 // R$ 5.000 fixo como exemplo
    const salarioVariation = Math.round((rand() - 0.5) * 200) // variação +/- R$100
    const salarioValue = brlToCents(salarioBase + salarioVariation)
    transactionsToCreate.push({
      name: `Salário - ${year}-${pad(monthIndex + 1)}`,
      amount: salarioValue,
      type: TransactionType.INCOME,
      recurring: true,
      categoryId: salarioCat.id,
      walletId,
      reference: makeUtcDate(year, monthIndex, 5),
    })

    // 2) Investimentos - dividendos (ocasional, aleatório)
    if (rand() > 0.65) {
      const inv = catMap.get('Investimentos')!
      // dividendos pequenos a médios
      const dividend = safeRound2(10 + rand() * 300) // R$10 - R$310
      const subs = Array.from(inv.subMap.entries())
      const subId = subs.length ? subs[Math.floor(rand() * subs.length)][1] : undefined
      transactionsToCreate.push({
        name: `Dividendo - ${year}-${pad(monthIndex + 1)}`,
        amount: brlToCents(dividend),
        type: TransactionType.INCOME,
        recurring: false,
        categoryId: inv.id,
        subcategoryId: subId ?? null,
        walletId,
        reference: makeUtcDate(year, monthIndex, 12 + Math.floor(rand() * 6)),
      })
    }

    // 3) Venda de ativos esporádica (maior, menos frequente)
    if (rand() > 0.9) {
      const inv = catMap.get('Investimentos')!
      const sale = safeRound2(200 + rand() * 5000) // R$200 - R$5200
      const subs = Array.from(inv.subMap.values())
      const subId = subs.length ? subs[Math.floor(rand() * subs.length)] : undefined
      transactionsToCreate.push({
        name: `Venda de Ativos - ${year}-${pad(monthIndex + 1)}`,
        amount: brlToCents(sale),
        type: TransactionType.INCOME,
        recurring: false,
        categoryId: inv.id,
        subcategoryId: subId ?? null,
        walletId,
        reference: makeUtcDate(year, monthIndex, 20),
      })
    }

    // ---------- DESPESAS FIXAS (recorrentes) ----------
    // Aluguel/Condomínio (moradia) — recorrente dia 3
    const moradia = catMap.get('Moradia')!
    const rentBase = 1400 + Math.floor(rand() * 800) // R$1400 - R$2200
    transactionsToCreate.push({
      name: `Moradia - Aluguel/Condomínio - ${year}-${pad(monthIndex + 1)}`,
      amount: brlToCents(rentBase),
      type: TransactionType.EXPENSE,
      recurring: true,
      categoryId: moradia.id,
      subcategoryId: moradia.subMap.get('Aluguel') ?? null,
      walletId,
      reference: makeUtcDate(year, monthIndex, 3),
    })

    // Assinaturas (Lazer - streaming) — recorrente dia 15 (pequena)
    const lazer = catMap.get('Lazer')!
    const streamingAmount = 29.9
    transactionsToCreate.push({
      name: `Streaming - assinatura - ${year}-${pad(monthIndex + 1)}`,
      amount: brlToCents(streamingAmount),
      type: TransactionType.EXPENSE,
      recurring: true,
      categoryId: lazer.id,
      subcategoryId: lazer.subMap.get('Streaming') ?? null,
      walletId,
      reference: makeUtcDate(year, monthIndex, 15),
    })

    // ---------- DESPESAS VARIÁVEIS ----------
    // Alimentação, Transporte, Saúde — um registro principal por categoria
    const spentCategories = ['Alimentação', 'Transporte', 'Saúde']
    for (const catName of spentCategories) {
      const category = catMap.get(catName)!
      let base = 0
      switch (catName) {
        case 'Alimentação':
          base = 300 + Math.floor(rand() * 700) // R$300-1000
          break
        case 'Transporte':
          base = 80 + Math.floor(rand() * 420) // R$80-500
          break
        case 'Saúde':
          base = rand() > 0.85 ? 200 + Math.floor(rand() * 800) : 30 + Math.floor(rand() * 120)
          break
        default:
          base = 50 + Math.floor(rand() * 200)
      }

      const subs = Array.from(category.subMap.values())
      const subId = subs.length ? subs[Math.floor(rand() * subs.length)] : null
      const day = 2 + Math.floor(rand() * 24)

      transactionsToCreate.push({
        name: `${catName} - ${year}-${pad(monthIndex + 1)}`,
        amount: brlToCents(base),
        type: TransactionType.EXPENSE,
        recurring: false,
        categoryId: category.id,
        subcategoryId: subId,
        walletId,
        reference: makeUtcDate(year, monthIndex, day),
      })
    }

    // ---------- PEQUENAS DESPESAS ALEATÓRIAS (vários itens) ----------
    const extraCount = 2 + Math.floor(rand() * 5) // 2..6 pequenas compras
    const extraPool = ['Alimentação', 'Transporte', 'Lazer']
    for (let i = 0; i < extraCount; i++) {
      const catName = extraPool[Math.floor(rand() * extraPool.length)]
      const category = catMap.get(catName)!
      const amount = safeRound2(5 + rand() * 95) // R$5 - R$100
      const subs = Array.from(category.subMap.values())
      const subId = subs.length ? subs[Math.floor(rand() * subs.length)] : null
      const day = 1 + Math.floor(rand() * 26)
      transactionsToCreate.push({
        name: `${catName} compra ${i + 1} - ${year}-${pad(monthIndex + 1)}`,
        amount: brlToCents(amount),
        type: TransactionType.EXPENSE,
        recurring: false,
        categoryId: category.id,
        subcategoryId: subId,
        walletId,
        reference: makeUtcDate(year, monthIndex, day),
      })
    }

    // ---------- EVENTOS GRANDES (muito esporádicos) ----------
    if (rand() > 0.92) {
      const big = 200 + Math.floor(rand() * 4800) // R$200 - R$5000
      const day = 5 + Math.floor(rand() * 20)
      transactionsToCreate.push({
        name: `Compra grande - ${year}-${pad(monthIndex + 1)}`,
        amount: brlToCents(big),
        type: TransactionType.EXPENSE,
        recurring: false,
        categoryId: catMap.get('Lazer')!.id,
        walletId,
        reference: makeUtcDate(year, monthIndex, day),
      })
    }
  } // fim loop meses

  console.log(`Total transações geradas: ${transactionsToCreate.length}`)

  // Inserção em lote (createMany) em chunks
  const chunkSize = 200
  for (let i = 0; i < transactionsToCreate.length; i += chunkSize) {
    const chunk = transactionsToCreate.slice(i, i + chunkSize)
    await prisma.transaction.createMany({
      data: chunk.map((t) => ({
        name: t.name,
        amount: t.amount,
        type: t.type,
        recurring: t.recurring ?? false,
        categoryId: t.categoryId,
        subcategoryId: t.subcategoryId ?? undefined,
        walletId: t.walletId,
        reference: t.reference,
      })),
    })
    console.log(
      `Inseridos ${Math.min(i + chunkSize, transactionsToCreate.length)} / ${transactionsToCreate.length}`
    )
  }

  console.log('Seed finalizado com sucesso.')
}

main()
  .catch((e) => {
    console.error('Erro:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
