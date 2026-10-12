export const SA_BANKS = ['Capitec', 'FNB', 'Standard Bank', 'Nedbank', 'Absa'] as const;

export type SouthAfricanBank = (typeof SA_BANKS)[number];
