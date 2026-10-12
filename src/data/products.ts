import type { Highlight, Product, ProductImage, ProductVariant } from '../types';
import { formatMoney } from '../lib/format';
import { FREE_SHIPPING_THRESHOLD } from '../lib/pricing';

const deliveryNote = `Door-to-door delivery is free on orders over ${formatMoney(FREE_SHIPPING_THRESHOLD)}. Express courier (1–2 working days) and Pargo locker pick-up are priced at checkout.`;

function gallery(name: string, color: string, files: string[]): ProductImage[] {
  return files.map((file, index) => ({
    src: `/images/${file}.jpg`,
    alt: `${name} in ${color}, photo ${index + 1}`,
  }));
}

interface Colorway {
  color: string;
  hex: string;
  code: string;
  files: string[];
}

interface Edition {
  model: string;
  code: string;
  price: number;
  detail: string;
  stock: Record<string, number>;
  highlights: Highlight[];
}

function variantsFor(prefix: string, name: string, colors: Colorway[], editions: Edition[]): ProductVariant[] {
  return colors.flatMap((color) =>
    editions.map((edition) => ({
      id: `${prefix}-${color.code}-${edition.code}`.toLowerCase(),
      sku: `${prefix}-${color.code}-${edition.code}`,
      color: color.color,
      colorHex: color.hex,
      model: edition.model,
      price: edition.price,
      stock: edition.stock[color.color] ?? 0,
      detail: edition.detail,
      highlights: edition.highlights,
      images: gallery(name, color.color, color.files),
    })),
  );
}

const standardHighlights: Highlight[] = [
  { value: '30 hrs', label: 'Battery' },
  { value: '40 mm', label: 'Driver' },
  { value: '252 g', label: 'Weight' },
];

const studioHighlights: Highlight[] = [
  { value: '40 hrs', label: 'Battery' },
  { value: 'Lossless', label: 'Codec' },
  { value: '268 g', label: 'Weight' },
];

const budsHighlights: Highlight[] = [
  { value: '6 hrs', label: 'Playback' },
  { value: 'IPX4', label: 'Resistance' },
  { value: '4.8 g', label: 'Each bud' },
];

const budsProHighlights: Highlight[] = [
  { value: '8 hrs', label: 'Playback' },
  { value: 'ANC', label: 'Noise control' },
  { value: 'Wireless', label: 'Case charge' },
];

const miniHighlights: Highlight[] = [
  { value: '12 hrs', label: 'Battery' },
  { value: 'IP67', label: 'Resistance' },
  { value: '20 W', label: 'Output' },
];

const homeHighlights: Highlight[] = [
  { value: 'Room EQ', label: 'Tuning' },
  { value: '60 W', label: 'Output' },
  { value: 'Wi-Fi', label: 'Streaming' },
];

const desktopHighlights: Highlight[] = [
  { value: 'USB-C', label: 'Input' },
  { value: '6.35 mm', label: 'Output' },
  { value: '1.1 kg', label: 'Weight' },
];

const referenceHighlights: Highlight[] = [
  { value: 'XLR', label: 'Balanced out' },
  { value: 'Class A', label: 'Topology' },
  { value: '2.4 kg', label: 'Weight' },
];

export const products: Product[] = [
  {
    id: 'aether-one',
    name: 'Aether One',
    tagline: 'Silence, tuned.',
    description:
      'A custom 40 mm biocellulose driver and adaptive noise control, finished in anodized aluminum that stays cool through a long session. It folds flat into a knit-lined case and disappears until the music starts.',
    category: 'Headphones',
    rating: 4.8,
    reviewCount: 428,
    variantLabel: 'Model',
    specs: [
      { label: 'Drivers', value: '40 mm biocellulose' },
      { label: 'Noise control', value: 'Adaptive hybrid ANC' },
      { label: 'Bluetooth', value: '5.4, multipoint' },
      { label: 'Battery', value: '30 hrs Standard / 40 hrs Studio' },
      { label: 'Codecs', value: 'AAC, SBC, aptX Lossless on Studio' },
      { label: 'Weight', value: '252 g Standard / 268 g Studio' },
      { label: 'Charging', value: 'USB-C, 10 min adds 5 hrs' },
      { label: 'Included', value: 'Case, cable, 2 m audio lead' },
    ],
    shipping: [
      'Dispatched within one working day. Standard door-to-door courier arrives in 3–5 working days. Express courier arrives in 1–2 working days.',
      deliveryNote,
    ],
    warranty: [
      'Two-year limited warranty covering materials and workmanship. Register within 30 days and battery coverage extends for a third year.',
      'Ear cushions and the headband sleeve are replaceable parts. We stock them for the life of the warranty.',
    ],
    variants: variantsFor(
      'AET',
      'Aether One',
      [
        {
          color: 'Midnight',
          hex: '#171717',
          code: 'MID',
          files: ['headphones-dark-a', 'headphones-dark-b', 'headphones-dark-c'],
        },
        {
          color: 'Sand',
          hex: '#e4d5c3',
          code: 'SND',
          files: ['headphones-light-a', 'headphones-light-b', 'headphones-life'],
        },
        {
          color: 'Graphite',
          hex: '#3a4150',
          code: 'GRP',
          files: ['headphones-life', 'headphones-dark-c', 'headphones-dark-b'],
        },
      ],
      [
        {
          model: 'Standard',
          code: 'STD',
          price: 549900,
          detail: '30-hour battery, adaptive ANC, and Bluetooth 5.4.',
          stock: { Midnight: 3, Sand: 14, Graphite: 0 },
          highlights: standardHighlights,
        },
        {
          model: 'Studio',
          code: 'STU',
          price: 799900,
          detail: '40-hour battery, adaptive ANC, and aptX Lossless.',
          stock: { Midnight: 8, Sand: 2, Graphite: 6 },
          highlights: studioHighlights,
        },
      ],
    ),
  },
  {
    id: 'lumen-buds',
    name: 'Lumen Buds',
    tagline: 'Quiet that fits a pocket.',
    description:
      'Pressure-fit tips, a vented acoustic chamber, and a case that charges from empty to full in under an hour. Small enough for a coat pocket, quiet enough for a commute.',
    category: 'Earbuds',
    rating: 4.6,
    reviewCount: 812,
    variantLabel: 'Model',
    specs: [
      { label: 'Drivers', value: '11 mm dynamic' },
      { label: 'Fit', value: 'Four silicone tip sizes' },
      { label: 'Resistance', value: 'IPX4 sweat resistance' },
      { label: 'Battery', value: '6 hrs Buds / 8 hrs Pro' },
      { label: 'Case', value: '24 hrs extra / 36 hrs on Pro' },
      { label: 'Noise control', value: 'Transparency, ANC on Pro' },
      { label: 'Charging', value: 'USB-C, wireless on Pro' },
      { label: 'Bluetooth', value: '5.4' },
    ],
    shipping: [
      'Leaves the studio within one working day in a rigid travel carton. Door-to-door courier is 3–5 working days. Express is 1–2 working days.',
      'A single pair of Buds ships at the door-to-door rate until the order crosses the free-delivery threshold. Pargo locker pick-up is available at checkout.',
      deliveryNote,
    ],
    warranty: [
      'Two-year warranty on the buds and the charging case, including battery capacity that falls below 80 percent.',
      'Lost tips are replaced once, at no charge, during the first year.',
    ],
    variants: variantsFor(
      'LUM',
      'Lumen Buds',
      [
        {
          color: 'Ivory',
          hex: '#f3efe6',
          code: 'IVR',
          files: ['buds-b', 'buds-a', 'buds-c'],
        },
        {
          color: 'Onyx',
          hex: '#161616',
          code: 'ONX',
          files: ['buds-a', 'buds-c', 'buds-b'],
        },
        {
          color: 'Sage',
          hex: '#8fa08a',
          code: 'SGE',
          files: ['buds-c', 'buds-b', 'buds-a'],
        },
      ],
      [
        {
          model: 'Buds',
          code: 'BDS',
          price: 89900,
          detail: 'Six hours of playback, plus 24 more in the case.',
          stock: { Ivory: 12, Onyx: 20, Sage: 9 },
          highlights: budsHighlights,
        },
        {
          model: 'Buds Pro',
          code: 'PRO',
          price: 249900,
          detail: 'Eight hours of playback, ANC, and a wireless charging case.',
          stock: { Ivory: 4, Onyx: 1, Sage: 7 },
          highlights: budsProHighlights,
        },
      ],
    ),
  },
  {
    id: 'arc-speaker',
    name: 'Arc Speaker',
    tagline: 'A room, scaled down.',
    description:
      'A sealed enclosure and a custom waveguide, tuned to stay clear when you turn it up. Take the Mini outside, or leave the Home edition on a shelf and let it fill the room.',
    category: 'Speakers',
    rating: 4.7,
    reviewCount: 256,
    variantLabel: 'Size',
    specs: [
      { label: 'Mini output', value: '20 W, passive radiator' },
      { label: 'Home output', value: '60 W, dual drivers' },
      { label: 'Battery', value: '12 hrs on Mini, mains on Home' },
      { label: 'Resistance', value: 'IP67 on Mini' },
      { label: 'Connectivity', value: 'Bluetooth 5.3, Wi-Fi on Home' },
      { label: 'Tuning', value: 'Room EQ on Home' },
      { label: 'Height', value: '168 mm Mini / 210 mm Home' },
      { label: 'Controls', value: 'On-device dial and app' },
    ],
    shipping: [
      'Mini ships in a padded mailer. Home ships in a double-walled carton with foam end-caps. Both leave within one working day.',
      deliveryNote,
    ],
    warranty: [
      'Two-year limited warranty. The grille and housing are covered for cracks during the first year of ordinary use.',
      'Home units include a one-time remote room-EQ session if the first placement sounds uneven.',
    ],
    variants: variantsFor(
      'ARC',
      'Arc Speaker',
      [
        {
          color: 'Stone',
          hex: '#cfc6ba',
          code: 'STN',
          files: ['speaker-b', 'speaker-a', 'speaker-c'],
        },
        {
          color: 'Black',
          hex: '#111111',
          code: 'BLK',
          files: ['speaker-a', 'speaker-b', 'speaker-c'],
        },
        {
          color: 'Copper',
          hex: '#b4683c',
          code: 'CPR',
          files: ['speaker-c', 'speaker-b', 'speaker-a'],
        },
      ],
      [
        {
          model: 'Mini',
          code: 'MIN',
          price: 229900,
          detail: 'A 20-watt driver, twelve-hour battery, and a strap that clips to a bag.',
          stock: { Stone: 11, Black: 3, Copper: 0 },
          highlights: miniHighlights,
        },
        {
          model: 'Home',
          code: 'HME',
          price: 449900,
          detail: 'Sixty watts, room EQ, and Wi-Fi streaming for the shelf.',
          stock: { Stone: 5, Black: 15, Copper: 4 },
          highlights: homeHighlights,
        },
      ],
    ),
  },
  {
    id: 'nimbus-dac',
    name: 'Nimbus DAC',
    tagline: 'The last inch of detail.',
    description:
      'A desktop DAC and headphone amplifier for people who already like their headphones and want to hear more of them. Clean gain, a precise volume ladder, and a chassis that runs cool.',
    category: 'Amplifiers',
    rating: 4.9,
    reviewCount: 94,
    variantLabel: 'Edition',
    specs: [
      { label: 'DAC', value: '32-bit / 384 kHz' },
      { label: 'Desktop output', value: '6.35 mm, 300 mW at 32 ohm' },
      { label: 'Reference output', value: '6.35 mm and 4-pin XLR' },
      { label: 'Inputs', value: 'USB-C, optical on Reference' },
      { label: 'Noise', value: 'Below 0.001% THD' },
      { label: 'Volume', value: 'Stepped analog ladder' },
      { label: 'Power', value: 'External 15 V supply' },
      { label: 'Chassis', value: 'Machined aluminum' },
    ],
    shipping: [
      'Each unit is inspected, then packed in a fitted insert. Orders leave within one working day.',
      deliveryNote,
    ],
    warranty: [
      'Three-year warranty on the chassis and power supply.',
      'Reference units include one calibration, on request, during the warranty window.',
    ],
    variants: variantsFor(
      'NMB',
      'Nimbus DAC',
      [
        {
          color: 'Silver',
          hex: '#e4e4e7',
          code: 'SLV',
          files: ['studio-b', 'studio-a', 'studio-c'],
        },
        {
          color: 'Black',
          hex: '#0e0e0e',
          code: 'BLK',
          files: ['studio-a', 'studio-c', 'studio-b'],
        },
      ],
      [
        {
          model: 'Desktop',
          code: 'DSK',
          price: 849900,
          detail: 'A compact DAC and amplifier for the desk, with a 6.35 mm output.',
          stock: { Silver: 6, Black: 9 },
          highlights: desktopHighlights,
        },
        {
          model: 'Reference',
          code: 'REF',
          price: 1299900,
          detail: 'Discrete class-A amplification with balanced XLR and a quieter noise floor.',
          stock: { Silver: 2, Black: 4 },
          highlights: referenceHighlights,
        },
      ],
    ),
  },
];

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}
