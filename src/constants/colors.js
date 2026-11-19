export const CATEGORY_META = {
  Alimentação: { icon: 'restaurant', color: '#f59f00' },
  Transporte: { icon: 'car', color: '#339af0' },
  Lazer: { icon: 'game-controller', color: '#e64980' },
  Contas: { icon: 'receipt', color: '#12b886' },
  Estudos: { icon: 'school', color: '#7950f2' },
};

export const INCOME_META = {
  Salário: { icon: 'cash', color: '#12b886' },
  Freelance: { icon: 'laptop', color: '#339af0' },
  Investimentos: { icon: 'trending-up', color: '#7950f2' },
  Presente: { icon: 'gift', color: '#e64980' },
  Outros: { icon: 'ellipsis-horizontal-circle', color: '#868e96' },
};

export const CATEGORIES = Object.keys(CATEGORY_META);
export const INCOME_CATEGORIES = Object.keys(INCOME_META);

export function getCategoryMeta(category, fallbackColor) {
  return CATEGORY_META[category] ?? INCOME_META[category] ?? { icon: 'pricetag', color: fallbackColor };
}
