export const CATEGORY_META = {
  Alimentação: { icon: 'restaurant', color: '#f59f00' },
  Transporte: { icon: 'car', color: '#339af0' },
  Lazer: { icon: 'game-controller', color: '#e64980' },
  Contas: { icon: 'receipt', color: '#12b886' },
  Estudos: { icon: 'school', color: '#7950f2' },
};

export const CATEGORIES = Object.keys(CATEGORY_META);

export function getCategoryMeta(category, fallbackColor) {
  return CATEGORY_META[category] ?? { icon: 'pricetag', color: fallbackColor };
}
