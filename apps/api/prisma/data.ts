export const initialCategories = [
  { name: 'Salário', icon: 'Landmark', type: 'REVENUE' },
  { name: 'Freelancer', icon: 'Briefcase', type: 'REVENUE' },
  { name: 'Investimentos', icon: 'TrendingUp', type: 'REVENUE' },
  { name: 'Outras Receitas', icon: 'PlusCircle', type: 'REVENUE' },

  {
    name: 'Moradia',
    icon: 'Home',
    type: 'SPENT',
    subcategories: [
      { name: 'Aluguel/Financiamento', icon: 'Home' },
      { name: 'Contas de Consumo', icon: 'Zap' },
      { name: 'Internet', icon: 'Wifi' },
      { name: 'Manutenção', icon: 'Wrench' },
    ],
  },
  {
    name: 'Alimentação',
    icon: 'Utensils',
    type: 'SPENT',
    subcategories: [
      { name: 'Supermercado', icon: 'ShoppingCart' },
      { name: 'Restaurantes', icon: 'Utensils' },
      { name: 'Delivery', icon: 'Bike' },
    ],
  },
  {
    name: 'Transporte',
    icon: 'Car',
    type: 'SPENT',
    subcategories: [
      { name: 'Combustível', icon: 'Fuel' },
      { name: 'Transporte Público', icon: 'Bus' },
      { name: 'Aplicativos', icon: 'Car' },
    ],
  },
  {
    name: 'Lazer',
    icon: 'Gamepad2',
    type: 'SPENT',
    subcategories: [
      { name: 'Assinaturas', icon: 'Rss' },
      { name: 'Viagens', icon: 'Plane' },
      { name: 'Bares e Festas', icon: 'GlassWater' },
    ],
  },
]
