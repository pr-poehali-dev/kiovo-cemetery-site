import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMAGE = 'https://cdn.poehali.dev/projects/5cc42949-1e51-4e95-a6b9-902fa99ecf63/files/8d7edaf2-efdd-4bd8-a4a8-a2cadbbb2218.jpg';
const WORKSHOP_IMAGE = 'https://cdn.poehali.dev/projects/5cc42949-1e51-4e95-a6b9-902fa99ecf63/files/6e92eb2c-d260-4754-a697-e9fd05397b92.jpg';
const GALLERY_IMAGE = 'https://cdn.poehali.dev/projects/5cc42949-1e51-4e95-a6b9-902fa99ecf63/files/11b4a65f-6206-45de-965d-e54acaf265d0.jpg';

const PHONE = '+79637516823';
const PHONE_DISPLAY = '+7 (963) 751-68-23';
const MAX_LINK = 'https://max.ru/';

const NAV_ITEMS = [
  { id: 'home', label: 'Главная' },
  { id: 'about', label: 'О нас' },
  { id: 'configurator', label: 'Конструктор' },
  { id: 'benches', label: 'Лавочки' },
  { id: 'granite', label: 'Гранит' },
  { id: 'services', label: 'Услуги' },
  { id: 'care', label: 'Уход' },
  { id: 'gallery', label: 'Галерея' },
  { id: 'contacts', label: 'Контакты' },
];

type ConfigKey = 'persons' | 'stele' | 'pedestal' | 'tomb' | 'flowerbed' | 'plate' | 'cover' | 'vase' | 'decor';
interface ConfigOption { id: string; label: string; desc?: string; price: number; }

const CONFIGURATOR: { key: ConfigKey; title: string; options: ConfigOption[] }[] = [
  {
    key: 'stele', title: 'Стела',
    options: [
      { id: 'stele-classic', label: 'Классическая', desc: 'Прямоугольная', price: 18000 },
      { id: 'stele-arch',    label: 'Арочная',       desc: 'Сводчатый верх', price: 22000 },
      { id: 'stele-figured', label: 'Фигурная',      desc: 'Резной силуэт',  price: 27000 },
      { id: 'stele-combo',   label: 'Комбинированная', desc: 'Двухуровневая', price: 32000 },
    ],
  },
  {
    key: 'pedestal', title: 'Цоколь',
    options: [
      { id: 'ped-none', label: 'Без цоколя', price: 0 },
      { id: 'ped-low',  label: 'Низкий',  desc: 'До 20 см',    price: 5000 },
      { id: 'ped-mid',  label: 'Средний', desc: '20–40 см',    price: 8000 },
      { id: 'ped-high', label: 'Высокий', desc: 'Более 40 см', price: 12000 },
    ],
  },
  {
    key: 'tomb', title: 'Тумба',
    options: [
      { id: 'tomb-none',  label: 'Без тумбы', price: 0 },
      { id: 'tomb-small', label: 'Малая',    desc: '40×80 см',  price: 7000 },
      { id: 'tomb-large', label: 'Большая',  desc: '60×120 см', price: 11000 },
    ],
  },
  {
    key: 'flowerbed', title: 'Цветник',
    options: [
      { id: 'fl-none',    label: 'Без цветника', price: 0 },
      { id: 'fl-open',    label: 'Открытый',   desc: 'Земляной',   price: 3500 },
      { id: 'fl-granite', label: 'Гранитный',  desc: 'С бортиком', price: 8000 },
    ],
  },
  {
    key: 'plate', title: 'Плита',
    options: [
      { id: 'pl-none',    label: 'Без плиты', price: 0 },
      { id: 'pl-granite', label: 'Гранитная', desc: 'Полированная',     price: 14000 },
      { id: 'pl-paving',  label: 'Брусчатка', desc: 'Природный камень', price: 9000 },
    ],
  },
  {
    key: 'cover', title: 'Покрытие',
    options: [
      { id: 'cov-none',   label: 'Без покрытия', price: 0 },
      { id: 'cov-gravel', label: 'Гравий',   desc: 'Мраморная крошка', price: 4000 },
      { id: 'cov-tile',   label: 'Плитка',   desc: 'Гранитная',        price: 6500 },
    ],
  },
  {
    key: 'vase', title: 'Ваза',
    options: [
      { id: 'vas-none',    label: 'Без вазы',     price: 0 },
      { id: 'vas-classic', label: 'Классическая', desc: 'Гранитная',     price: 3500 },
      { id: 'vas-modern',  label: 'Современная',  desc: 'Строгий стиль', price: 4500 },
    ],
  },
  {
    key: 'decor', title: 'Оформление',
    options: [
      { id: 'dec-none',       label: 'Без декора',      price: 0 },
      { id: 'dec-cross',      label: 'Крест',            desc: 'Православный',    price: 5000 },
      { id: 'dec-portrait',   label: 'Портрет',          desc: 'Гравировка',       price: 8000 },
      { id: 'dec-pattern',    label: 'Рисунок',          desc: 'Орнамент/пейзаж', price: 6000 },
      { id: 'dec-cross-port', label: 'Крест + Портрет', desc: 'Комплект',         price: 12000 },
    ],
  },
];

const PERSONS_OPTIONS = [
  { id: '1', label: '1 человек', icon: '👤' },
  { id: '2', label: '2 человека', icon: '👥' },
];

type ConfigState = { [K in ConfigKey]: string } & { persons: string; epitaph: string };

const DEFAULT_CONFIG: ConfigState = {
  persons: '1',
  stele: 'stele-classic',
  pedestal: 'ped-none',
  tomb: 'tomb-none',
  flowerbed: 'fl-none',
  plate: 'pl-none',
  cover: 'cov-none',
  vase: 'vas-none',
  decor: 'dec-none',
  epitaph: '',
};

function calcTotal(config: ConfigState): number {
  return CONFIGURATOR.reduce((acc, group) => {
    const opt = group.options.find(o => o.id === config[group.key]);
    return acc + (opt?.price ?? 0);
  }, 0);
}

function fmt(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

// ── Изометрия: вспомогательные функции ────────────────────────────────────────
// Изометрическая проекция: (x, y, z) → (svgX, svgY)
// x — вправо, y — глубина (вдаль), z — вверх
function iso(x: number, y: number, z: number, ox: number, oy: number): [number, number] {
  const sx = ox + (x - y) * Math.cos(Math.PI / 6) * 1;
  const sy = oy + (x + y) * Math.sin(Math.PI / 6) * 1 - z;
  return [sx, sy];
}

function isoPath(points: [number, number, number][], ox: number, oy: number): string {
  return points.map(([x, y, z], i) => {
    const [sx, sy] = iso(x, y, z, ox, oy);
    return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }).join(' ') + ' Z';
}

// Рисует изометрический параллелепипед
interface IsoBoxProps {
  x: number; y: number; z: number;   // координаты нижней передней левой точки
  w: number; d: number; h: number;   // ширина, глубина, высота
  colorTop: string; colorLeft: string; colorRight: string;
  ox: number; oy: number;
}
function IsoBox({ x, y, z, w, d, h, colorTop, colorLeft, colorRight, ox, oy }: IsoBoxProps) {
  // Верхняя грань
  const top = isoPath([
    [x,     y,     z + h],
    [x + w, y,     z + h],
    [x + w, y + d, z + h],
    [x,     y + d, z + h],
  ], ox, oy);
  // Левая (передняя) грань
  const left = isoPath([
    [x,     y,     z],
    [x + w, y,     z],
    [x + w, y,     z + h],
    [x,     y,     z + h],
  ], ox, oy);
  // Правая (боковая) грань
  const right = isoPath([
    [x + w, y,     z],
    [x + w, y + d, z],
    [x + w, y + d, z + h],
    [x + w, y,     z + h],
  ], ox, oy);

  return (
    <g>
      <path d={left}  fill={colorLeft}  stroke="#1a1a1a" strokeWidth={0.4} />
      <path d={right} fill={colorRight} stroke="#1a1a1a" strokeWidth={0.4} />
      <path d={top}   fill={colorTop}   stroke="#1a1a1a" strokeWidth={0.4} />
    </g>
  );
}

// Изометрическая трапеция-стела (фронтальная грань + верхняя + боковая)
interface IsoSlabProps {
  x: number; y: number; z: number;
  w: number; d: number; h: number;
  topShape: 'rect' | 'arch' | 'peak' | 'combo-top' | 'combo-bot';
  colorFront: string; colorSide: string; colorTop: string;
  ox: number; oy: number;
}
function IsoSlab({ x, y, z, w, d, h, topShape, colorFront, colorSide, colorTop, ox, oy }: IsoSlabProps) {
  // Фронтальная грань — меняется в зависимости от типа
  const frontPoints: [number, number, number][] = [];
  if (topShape === 'arch') {
    // Имитация арки через множество точек
    const steps = 12;
    const arcH = h * 0.22;
    // нижние точки
    frontPoints.push([x, y, z], [x + w, y, z]);
    // правый подъём
    frontPoints.push([x + w, y, z + h - arcH]);
    // арка по верху (правая → левая)
    for (let i = steps; i >= 0; i--) {
      const t = (i / steps) * Math.PI;
      const px = x + w / 2 + (w / 2) * Math.cos(t);
      const pz = z + h - arcH + arcH * Math.sin(t);
      frontPoints.push([px, y, pz]);
    }
    frontPoints.push([x, y, z + h - arcH]);
  } else if (topShape === 'peak') {
    frontPoints.push(
      [x, y, z],
      [x + w, y, z],
      [x + w, y, z + h - h * 0.12],
      [x + w * 0.72, y, z + h],
      [x + w * 0.5, y, z + h + h * 0.09],
      [x + w * 0.28, y, z + h],
      [x, y, z + h - h * 0.12],
    );
  } else {
    // rect / combo-top / combo-bot — просто прямоугольник
    frontPoints.push([x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]);
  }

  const frontPath = frontPoints.map(([px, py, pz], i) => {
    const [sx, sy] = iso(px, py, pz, ox, oy);
    return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }).join(' ') + ' Z';

  // Боковая грань — используем rect-форму (упрощение)
  const sideRight = isoPath([
    [x + w, y,     z],
    [x + w, y + d, z],
    [x + w, y + d, z + h],
    [x + w, y,     z + h],
  ], ox, oy);

  // Верхняя грань
  const topFace = isoPath([
    [x,     y,     z + h],
    [x + w, y,     z + h],
    [x + w, y + d, z + h],
    [x,     y + d, z + h],
  ], ox, oy);

  return (
    <g>
      <path d={frontPath} fill={colorFront} stroke="#1a1a1a" strokeWidth={0.4} />
      <path d={sideRight}  fill={colorSide}  stroke="#1a1a1a" strokeWidth={0.4} />
      {topShape === 'rect' && <path d={topFace} fill={colorTop} stroke="#1a1a1a" strokeWidth={0.4} />}
    </g>
  );
}

// ── 3D Превью памятника ────────────────────────────────────────────────────────

function MonumentPreview({ config }: { config: ConfigState }) {
  const hasPedestal  = config.pedestal !== 'ped-none';
  const hasTomb      = config.tomb !== 'tomb-none';
  const hasFlowerbed = config.flowerbed !== 'fl-none';
  const hasPlate     = config.plate !== 'pl-none';
  const hasCover     = config.cover !== 'cov-none';
  const hasVase      = config.vase !== 'vas-none';
  const hasDecor     = config.decor !== 'dec-none';
  const twoPersons   = config.persons === '2';

  const SVG_W = 380;
  const SVG_H = 420;
  // Точка начала координат в SVG
  const OX = SVG_W / 2;
  const OY = SVG_H - 60;

  // Масштаб: 1 единица = px в изометрии
  const S = 1;

  // Размеры (в изо-единицах)
  const sW = twoPersons ? 90 : 60;   // ширина стелы
  const sD = 14;                      // глубина стелы
  const sH = config.stele === 'stele-combo' ? 140
    : config.stele === 'stele-figured' ? 155
    : config.stele === 'stele-arch' ? 150 : 140;

  const pedH = config.pedestal === 'ped-high' ? 36
    : config.pedestal === 'ped-mid' ? 24
    : hasPedestal ? 14 : 0;
  const pedW = sW + 10;
  const pedD = sD + 8;

  const tombH = config.tomb === 'tomb-large' ? 20 : hasTomb ? 12 : 0;
  const tombW = sW + 22;
  const tombD = sD + 18;

  const plateH = hasPlate ? 8 : 0;
  const plateW = sW + 30;
  const plateD = sD + 50;

  const coverH = hasCover ? 5 : 0;
  const coverW = plateW;
  const coverD = plateD;

  const flowerBorderH = hasFlowerbed ? 10 : 0;
  const flowerW = sW + 50;
  const flowerD = sD + 80;

  // Все элементы стоят на оси Z=0 (земля) и растут вверх
  // считаем z-координаты снизу вверх
  let curZ = 0;

  const flowerZ  = curZ; curZ += flowerBorderH;
  const coverZ   = curZ; curZ += coverH;
  const plateZ   = curZ; curZ += plateH;
  const tombZ    = curZ; curZ += tombH;
  const pedZ     = curZ; curZ += pedH;
  const steleZ   = curZ;

  // Центровка по x, y
  const cx = (obj: number) => -obj / 2;
  const cy = (obj: number) => -obj / 2;

  // Цвета
  const GRANITE_FRONT = '#303030';
  const GRANITE_SIDE  = '#222222';
  const GRANITE_TOP   = '#404040';

  const GRANITE2_FRONT = '#3a3a3a';
  const GRANITE2_SIDE  = '#2a2a2a';
  const GRANITE2_TOP   = '#4a4a4a';

  const GOLD = '#C9A84C';
  const GOLD_D = '#9A7B34';

  const plateColor = config.plate === 'pl-paving'
    ? { front: '#8A7A68', side: '#6A5A4A', top: '#9A8A78' }
    : { front: GRANITE_FRONT, side: GRANITE_SIDE, top: GRANITE_TOP };

  const coverColor = config.cover === 'cov-gravel'
    ? { front: '#C0B8A0', side: '#A0A090', top: '#D0C8B0' }
    : { front: '#555', side: '#444', top: '#666' };

  const flowerColor = config.flowerbed === 'fl-granite'
    ? { front: GRANITE_FRONT, side: GRANITE_SIDE, top: GRANITE_TOP }
    : { front: '#6A8050', side: '#4A6030', top: '#7A9060' };

  const topShape = config.stele === 'stele-arch' ? 'arch'
    : config.stele === 'stele-figured' ? 'peak'
    : 'rect';

  // Помощник: изо-координата + окружность (для вазы)
  const isoXY = (x: number, y: number, z: number) => iso(x * S, y * S, z * S, OX, OY);

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      width="100%"
      style={{ maxHeight: 400, display: 'block', margin: '0 auto', transition: 'all 0.3s ease' }}
      aria-label="3D-схема памятника"
    >
      <defs>
        <radialGradient id="groundGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C8D8B0" />
          <stop offset="100%" stopColor="#8FA870" />
        </radialGradient>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8E4DC" />
          <stop offset="100%" stopColor="#F5F0E8" />
        </linearGradient>
      </defs>

      {/* Фон */}
      <rect width={SVG_W} height={SVG_H} fill="url(#skyGrad)" />

      {/* Земля — изометрический ромб */}
      {(() => {
        const gSize = 120;
        const pts: [number,number,number][] = [
          [-gSize, 0, 0], [gSize, 0, 0], [gSize, gSize * 1.2, 0], [-gSize, gSize * 1.2, 0]
        ];
        const d = isoPath(pts, OX, OY);
        return <path d={d} fill="url(#groundGrad)" stroke="#7A9060" strokeWidth={0.5} />;
      })()}

      {/* Цветник — основание */}
      {hasFlowerbed && (
        <IsoBox
          x={cx(flowerW)} y={cy(flowerD)} z={flowerZ * S}
          w={flowerW} d={flowerD} h={flowerBorderH}
          colorTop={flowerColor.top}
          colorLeft={flowerColor.front}
          colorRight={flowerColor.side}
          ox={OX} oy={OY}
        />
      )}

      {/* Покрытие */}
      {hasCover && (
        <IsoBox
          x={cx(coverW)} y={cy(coverD)} z={coverZ * S}
          w={coverW} d={coverD} h={coverH}
          colorTop={coverColor.top}
          colorLeft={coverColor.front}
          colorRight={coverColor.side}
          ox={OX} oy={OY}
        />
      )}

      {/* Плита */}
      {hasPlate && (
        <IsoBox
          x={cx(plateW)} y={cy(plateD)} z={plateZ * S}
          w={plateW} d={plateD} h={plateH}
          colorTop={plateColor.top}
          colorLeft={plateColor.front}
          colorRight={plateColor.side}
          ox={OX} oy={OY}
        />
      )}

      {/* Тумба */}
      {hasTomb && (
        <IsoBox
          x={cx(tombW)} y={cy(tombD)} z={tombZ * S}
          w={tombW} d={tombD} h={tombH}
          colorTop={GRANITE_TOP}
          colorLeft={GRANITE_FRONT}
          colorRight={GRANITE_SIDE}
          ox={OX} oy={OY}
        />
      )}

      {/* Цоколь */}
      {hasPedestal && (
        <IsoBox
          x={cx(pedW)} y={cy(pedD)} z={pedZ * S}
          w={pedW} d={pedD} h={pedH}
          colorTop={GRANITE2_TOP}
          colorLeft={GRANITE2_FRONT}
          colorRight={GRANITE2_SIDE}
          ox={OX} oy={OY}
        />
      )}

      {/* Стела */}
      {config.stele === 'stele-combo' ? (
        // Комбинированная: нижняя широкая часть + верхняя узкая
        <g>
          <IsoBox
            x={cx(sW)} y={cy(sD)} z={steleZ * S}
            w={sW} d={sD} h={sH * 0.45}
            colorTop={GRANITE_TOP}
            colorLeft={GRANITE_FRONT}
            colorRight={GRANITE_SIDE}
            ox={OX} oy={OY}
          />
          <IsoBox
            x={cx(sW * 0.65)} y={cy(sD)} z={(steleZ + sH * 0.42) * S}
            w={sW * 0.65} d={sD} h={sH * 0.6}
            colorTop={GRANITE2_TOP}
            colorLeft={GRANITE2_FRONT}
            colorRight={GRANITE2_SIDE}
            ox={OX} oy={OY}
          />
        </g>
      ) : (
        <IsoSlab
          x={cx(sW)} y={cy(sD)} z={steleZ * S}
          w={sW} d={sD} h={sH}
          topShape={topShape}
          colorFront={GRANITE_FRONT}
          colorSide={GRANITE_SIDE}
          colorTop={GRANITE_TOP}
          ox={OX} oy={OY}
        />
      )}

      {/* Декор на лицевой грани стелы */}
      {hasDecor && (() => {
        // Центр фронтальной грани стелы в SVG
        const faceCx = cx(sW) + sW / 2;
        const decorBaseZ = steleZ + sH * 0.55;
        const [sx, sy] = iso(faceCx, cy(sD), decorBaseZ, OX, OY);
        const [topSx, topSy] = iso(faceCx, cy(sD), steleZ + sH * 0.12, OX, OY);

        if (config.decor === 'dec-cross' || config.decor === 'dec-cross-port') {
          return (
            <g fill={GOLD} opacity={0.92}>
              <rect x={topSx - 3} y={topSy - 44} width={6} height={46} rx={1} />
              <rect x={topSx - 16} y={topSy - 28} width={32} height={6} rx={1} />
            </g>
          );
        }
        if (config.decor === 'dec-portrait') {
          return (
            <g>
              <rect x={sx - 22} y={sy - 28} width={44} height={50}
                fill="none" stroke={GOLD} strokeWidth={1.5} rx={2} />
              <circle cx={sx} cy={sy - 8} r={15} fill="#2a2a2a" stroke={GOLD} strokeWidth={0.5} />
              <circle cx={sx} cy={sy - 12} r={7} fill="#404040" />
            </g>
          );
        }
        if (config.decor === 'dec-pattern') {
          return (
            <g stroke={GOLD} strokeWidth={1} fill="none" opacity={0.7}>
              <path d={`M ${topSx - 22} ${topSy + 8} Q ${topSx} ${topSy - 8} ${topSx + 22} ${topSy + 8}`} />
              <path d={`M ${topSx - 18} ${topSy + 20} Q ${topSx} ${topSy + 4} ${topSx + 18} ${topSy + 20}`} />
              <circle cx={topSx} cy={topSy + 34} r={12} />
              <circle cx={topSx} cy={topSy + 34} r={5} />
            </g>
          );
        }
        return null;
      })()}

      {/* Надпись-гравировка на стеле */}
      {(() => {
        const faceCx = cx(sW) + sW / 2;
        const [sx, sy] = iso(faceCx, cy(sD), steleZ + sH * 0.28, OX, OY);
        const lineW = sW * 0.55;
        return (
          <g opacity={0.28} stroke="white" strokeWidth={1.2}>
            <line x1={sx - lineW * 0.5} y1={sy}      x2={sx + lineW * 0.5} y2={sy} />
            <line x1={sx - lineW * 0.4} y1={sy + 9}  x2={sx + lineW * 0.4} y2={sy + 9} />
            <line x1={sx - lineW * 0.3} y1={sy + 18} x2={sx + lineW * 0.3} y2={sy + 18} />
          </g>
        );
      })()}

      {/* Разделитель 2 лица */}
      {twoPersons && (() => {
        const [bx, by] = iso(0, cy(sD), steleZ, OX, OY);
        const [tx, ty] = iso(0, cy(sD), steleZ + sH, OX, OY);
        return (
          <line x1={bx} y1={by} x2={tx} y2={ty}
            stroke={GOLD} strokeWidth={0.8} strokeDasharray="5 3" opacity={0.5} />
        );
      })()}

      {/* Ваза */}
      {hasVase && (() => {
        const vaseX = cx(sW) + sW + 12;
        const vaseY = cy(sD);
        const vaseZ = (tombH > 0 ? tombZ + tombH : steleZ);
        const [vx, vy] = iso(vaseX, vaseY, vaseZ, OX, OY);
        const vH = config.vase === 'vas-modern' ? 30 : 25;
        return (
          <g>
            <ellipse cx={vx} cy={vy} rx={10} ry={4} fill={GRANITE_TOP} />
            <path
              d={`M ${vx - 9} ${vy} Q ${vx - 11} ${vy - vH * 0.7} ${vx - 6} ${vy - vH} Q ${vx} ${vy - vH - 5} ${vx + 6} ${vy - vH} Q ${vx + 11} ${vy - vH * 0.7} ${vx + 9} ${vy} Z`}
              fill={GRANITE_FRONT}
              stroke={GRANITE_SIDE}
              strokeWidth={0.5}
            />
            <ellipse cx={vx} cy={vy - vH} rx={6} ry={2.5} fill={GRANITE2_TOP} />
          </g>
        );
      })()}

      {/* Подпись */}
      <text x={SVG_W / 2} y={SVG_H - 8} textAnchor="middle"
        fontSize={10} fill="#9B9B8B" fontFamily="Golos Text, sans-serif">
        Схема носит иллюстративный характер
      </text>
    </svg>
  );
}

// ── Данные ──────────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: 'Hammer',       title: 'Изготовление памятников',    desc: 'Полный цикл производства из натурального гранита. Строгий контроль качества на каждом этапе.' },
  { icon: 'PenTool',      title: 'Художественная гравировка',  desc: 'Портреты, надписи, орнаменты. Лазерная и ручная гравировка высокой чёткости.' },
  { icon: 'Truck',        title: 'Доставка и установка',       desc: 'Профессиональный монтаж в соответствии со всеми требованиями. Работаем по всему региону.' },
  { icon: 'RefreshCw',    title: 'Реставрация',                desc: 'Восстановление и очистка существующих памятников, обновление надписей и покрытий.' },
  { icon: 'Layers',       title: 'Благоустройство',            desc: 'Комплексное оформление: ограда, дорожки, цветник, лавочка и столик.' },
  { icon: 'Sprout',       title: 'Уход за захоронением',       desc: 'Регулярное обслуживание: уборка, посадка цветов, покраска ограды, сезонный уход.' },
];

const CARE_SERVICES = [
  { icon: 'Leaf',         title: 'Генеральная уборка',      price: 'от 1 500 ₽',    desc: 'Очистка надгробия, уборка листьев и мусора, протирка поверхностей.' },
  { icon: 'Droplets',     title: 'Мытьё памятника',         price: 'от 800 ₽',      desc: 'Аккуратная промывка гранита специальными средствами без повреждения гравировки.' },
  { icon: 'Flower2',      title: 'Посадка цветов',          price: 'от 2 000 ₽',    desc: 'Подбор и посадка однолетних или многолетних растений с учётом сезона.' },
  { icon: 'PaintBucket',  title: 'Покраска ограды',         price: 'от 1 500 ₽',    desc: 'Зачистка и покраска металлической ограды качественными материалами.' },
  { icon: 'Calendar',     title: 'Сезонное обслуживание',   price: 'от 4 000 ₽',    desc: 'Комплексный уход 4 раза в год: весна, лето, осень, зима.' },
  { icon: 'ShieldCheck',  title: 'Годовой контракт',        price: 'от 8 000 ₽/год', desc: 'Полное обслуживание в течение года. Фотоотчёт после каждого визита.' },
];

const GRANITE_TYPES = [
  { name: 'Габбро-диабаз',  color: '#2A2A2A', origin: 'Карелия', desc: 'Классический чёрный, наиболее востребованный' },
  { name: 'Лезниковский',   color: '#8B7B6B', origin: 'Россия',  desc: 'Красновато-коричневый, изысканный' },
  { name: 'Возрождение',    color: '#4A5568', origin: 'Россия',  desc: 'Серо-голубой, современный' },
  { name: 'Дымовский',      color: '#6B7280', origin: 'Россия',  desc: 'Серый, универсальный' },
  { name: 'Токовский',      color: '#9B5E4A', origin: 'Россия',  desc: 'Тёмно-красный, благородный' },
  { name: 'Балтийский',     color: '#374151', origin: 'Россия',  desc: 'Тёмно-серый, строгий' },
];

const GALLERY_ITEMS = [
  { img: GALLERY_IMAGE,   caption: 'Двойной мемориальный комплекс' },
  { img: HERO_IMAGE,      caption: 'Классический памятник с крестом' },
  { img: WORKSHOP_IMAGE,  caption: 'Изготовление в мастерской' },
  { img: GALLERY_IMAGE,   caption: 'Комплекс с лавочкой и столиком' },
  { img: HERO_IMAGE,      caption: 'Гравировка портрета' },
  { img: WORKSHOP_IMAGE,  caption: 'Благоустройство захоронения' },
];

const BENCH_TYPES = [
  { name: 'Лавочка со столиком',      material: 'Гранит + металл', desc: 'Классический набор для тихого уединения' },
  { name: 'Лавочка одиночная',        material: 'Гранит',          desc: 'Строгий минималистичный стиль' },
  { name: 'Скамья с подлокотниками',  material: 'Гранит + ковка',  desc: 'Элегантная кованая работа ручного исполнения' },
  { name: 'Комплект с оградой',       material: 'Гранит + металл', desc: 'Единый архитектурный ансамбль' },
];

// ── Вспомогательные компоненты ───────────────────────────────────────────────

function SectionHeading({ label, title, subtitle, light }: { label: string; title: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center gap-4 justify-center mb-3">
        <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
        <span className="text-xs font-body tracking-[0.25em] uppercase" style={{ color: 'var(--gold)' }}>{label}</span>
        <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
      </div>
      <h2 className={`font-display text-4xl md:text-5xl font-light mb-4 leading-tight${light ? ' text-white' : ''}`}
        style={light ? undefined : { color: 'var(--charcoal)' }}>{title}</h2>
      {subtitle && (
        <p className={`font-body max-w-xl mx-auto text-base leading-relaxed${light ? ' text-white/50' : ''}`}
          style={light ? undefined : { color: 'var(--stone)' }}>{subtitle}</p>
      )}
    </div>
  );
}

function OptionBtn({ label, desc, price, selected, onClick }: {
  label: string; desc?: string; price: number; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      className="option-card w-full text-left rounded-sm"
      style={selected ? { borderColor: 'var(--gold)', background: 'rgba(201,168,76,0.06)' } : {}}
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-1">
        <div className="font-body text-sm font-medium leading-tight" style={{ color: 'var(--charcoal)' }}>{label}</div>
        {price > 0 && <div className="font-body text-xs font-semibold flex-shrink-0" style={{ color: 'var(--gold)' }}>{fmt(price)}</div>}
      </div>
      {desc && <div className="font-body text-xs mt-0.5" style={{ color: 'var(--stone)' }}>{desc}</div>}
      {price === 0 && <div className="font-body text-xs" style={{ color: 'var(--stone)' }}>—</div>}
    </button>
  );
}

// ── Главный компонент ────────────────────────────────────────────────────────

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG);
  const previewRef = useRef<HTMLDivElement>(null);

  const total = calcTotal(config);

  const setOption = (key: string, value: string) => setConfig(prev => ({ ...prev, [key]: value }));

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.25 }
    );
    NAV_ITEMS.forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen font-body" style={{ background: 'var(--ivory)' }}>

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/5"
        style={{ background: 'rgba(28,36,48,0.96)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border flex items-center justify-center"
              style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
              <Icon name="Diamond" size={14} />
            </div>
            <div>
              <div className="font-display text-base font-light text-white leading-none tracking-wide">КЛАДБИЩЕ КИОВО</div>
              <div className="font-body text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--stone)' }}>
                Администрация · г. Лобня
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="nav-link transition-colors"
                style={{ color: activeSection === item.id ? 'white' : 'rgba(255,255,255,0.55)' }}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href={`tel:${PHONE}`} className="hidden md:flex items-center gap-2 font-body text-sm"
              style={{ color: 'var(--gold)' }}>
              <Icon name="Phone" size={14} />{PHONE_DISPLAY}
            </a>
            <button className="lg:hidden text-white/70" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={22} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 px-6" style={{ background: 'var(--charcoal)' }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="block w-full text-left py-3 font-body text-sm text-white/70 hover:text-white tracking-widest uppercase border-b border-white/5">
                {item.label}
              </button>
            ))}
            <a href={`tel:${PHONE}`} className="mt-4 flex items-center gap-2 font-body text-sm" style={{ color: 'var(--gold)' }}>
              <Icon name="Phone" size={14} />{PHONE_DISPLAY}
            </a>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(28,36,48,0.78) 0%, rgba(28,36,48,0.5) 50%, rgba(28,36,48,0.9) 100%)' }} />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 justify-center mb-6 animate-fade-in-up">
            <div className="h-px w-12 opacity-60" style={{ background: 'var(--gold)' }} />
            <span className="text-xs font-body tracking-[0.3em] uppercase text-white/60">
              Администрация кладбища Киово · г. Лобня
            </span>
            <div className="h-px w-12 opacity-60" style={{ background: 'var(--gold)' }} />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white mb-6 leading-tight animate-fade-in-up animate-delay-200">
            Достойная память<br />
            <em className="not-italic" style={{ color: 'var(--gold-light)' }}>о близких людях</em>
          </h1>
          <p className="font-body text-white/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-up animate-delay-400">
            Изготовление памятников из натурального гранита, благоустройство и постоянный уход за захоронениями.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-600">
            <button onClick={() => scrollTo('configurator')}
              className="font-body px-8 py-3.5 text-sm tracking-widest uppercase transition-all hover:opacity-90"
              style={{ background: 'var(--gold)', color: 'var(--charcoal)' }}>
              Создать памятник
            </button>
            <button onClick={() => scrollTo('contacts')}
              className="font-body px-8 py-3.5 text-sm tracking-widest uppercase border border-white/30 text-white hover:border-white/60 transition-all">
              Связаться с нами
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="font-body text-xs tracking-widest uppercase">Листайте вниз</span>
          <Icon name="ChevronDown" size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="py-10" style={{ background: 'var(--charcoal)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '20+',    label: 'Лет опыта' },
            { num: '5 000+', label: 'Выполненных заказов' },
            { num: '15',     label: 'Видов гранита' },
            { num: '10 лет', label: 'Гарантия' },
          ].map(s => (
            <div key={s.num}>
              <div className="font-display text-3xl font-light" style={{ color: 'var(--gold)' }}>{s.num}</div>
              <div className="font-body text-xs tracking-widest uppercase text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-body tracking-[0.25em] uppercase" style={{ color: 'var(--gold)' }}>О нас</span>
              <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-6 leading-tight" style={{ color: 'var(--charcoal)' }}>
              Администрация кладбища Киово
            </h2>
            <p className="font-body text-sm leading-relaxed mb-5" style={{ color: 'var(--stone)' }}>
              Мы находимся непосредственно на территории кладбища Киово в городе Лобня. Это позволяет нам оперативно помогать семьям и обеспечивать своевременный уход в любое время года.
            </p>
            <p className="font-body text-sm leading-relaxed mb-8" style={{ color: 'var(--stone)' }}>
              За более чем 20 лет работы мы приобрели репутацию надёжного и внимательного партнёра в важные жизненные моменты. Подходим к каждой семье с уважением и пониманием.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'Shield',  label: 'Гарантия 10 лет' },
                { icon: 'Award',   label: 'Собственное производство' },
                { icon: 'Clock',   label: 'Срок от 7 дней' },
                { icon: 'MapPin',  label: 'На территории кладбища' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 border flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                    <Icon name={f.icon} size={14} />
                  </div>
                  <span className="font-body text-sm" style={{ color: 'var(--charcoal)' }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={WORKSHOP_IMAGE} alt="Мастерская" className="w-full h-96 object-cover" />
            <div className="absolute -bottom-6 -left-6 p-6 hidden md:block" style={{ background: 'var(--charcoal)' }}>
              <div className="font-display text-4xl font-light" style={{ color: 'var(--gold)' }}>20+</div>
              <div className="font-body text-xs text-white/60 tracking-widest uppercase mt-1">Лет на рынке</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONFIGURATOR ── */}
      <section id="configurator" className="py-28 px-6" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="Конструктор"
            title="Создайте памятник"
            subtitle="Выбирайте элементы — схема обновляется в реальном времени"
          />
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Левая: параметры */}
            <div className="space-y-5">
              {/* Количество лиц */}
              <div className="bg-white p-6 border border-gray-100">
                <h3 className="font-display text-lg font-light mb-3 pb-2 border-b"
                  style={{ color: 'var(--charcoal)', borderColor: 'var(--gold)' }}>
                  Количество лиц
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {PERSONS_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => setOption('persons', opt.id)}
                      className="flex items-center gap-2 px-5 py-3 border text-sm font-body transition-all"
                      style={{
                        borderColor: config.persons === opt.id ? 'var(--gold)' : '#E5E7EB',
                        background: config.persons === opt.id ? 'rgba(201,168,76,0.06)' : 'white',
                        color: 'var(--charcoal)',
                      }}>
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Группы параметров */}
              {CONFIGURATOR.map(group => (
                <div key={group.key} className="bg-white p-6 border border-gray-100">
                  <h3 className="font-display text-lg font-light mb-3 pb-2 border-b"
                    style={{ color: 'var(--charcoal)', borderColor: 'var(--gold)' }}>
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {group.options.map(opt => (
                      <OptionBtn key={opt.id}
                        label={opt.label} desc={opt.desc} price={opt.price}
                        selected={config[group.key] === opt.id}
                        onClick={() => setOption(group.key, opt.id)} />
                    ))}
                  </div>
                </div>
              ))}

              {/* Эпитафия */}
              <div className="bg-white p-6 border border-gray-100">
                <h3 className="font-display text-lg font-light mb-3 pb-2 border-b"
                  style={{ color: 'var(--charcoal)', borderColor: 'var(--gold)' }}>
                  Надпись / эпитафия
                </h3>
                <textarea value={config.epitaph} onChange={e => setOption('epitaph', e.target.value)}
                  placeholder="Введите текст..." rows={3}
                  className="w-full border p-3 font-display text-base font-light focus:outline-none resize-none transition-colors"
                  style={{ borderColor: config.epitaph ? 'var(--gold)' : '#E5E7EB', color: 'var(--charcoal)' }} />
                <div className="text-xs mt-1 font-body" style={{ color: 'var(--stone)' }}>
                  Рекомендуется до 200 символов
                </div>
              </div>
            </div>

            {/* Правая: превью */}
            <div className="lg:sticky lg:top-24" ref={previewRef}>
              <div className="bg-white border border-gray-100 p-6">
                <div className="text-xs font-body tracking-widest uppercase text-center mb-4"
                  style={{ color: 'var(--stone)' }}>
                  Предварительный вид
                </div>
                <MonumentPreview config={config} />
              </div>
              <div className="mt-4 p-6" style={{ background: 'var(--charcoal)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-body text-sm text-white/60 uppercase tracking-wider">Примерная стоимость</div>
                  <div className="font-display text-3xl font-light" style={{ color: 'var(--gold)' }}>{fmt(total)}</div>
                </div>
                <p className="font-body text-xs text-white/40 mb-5">
                  Окончательная цена определяется при консультации с учётом размеров, породы гранита и сложности гравировки.
                </p>
                <button onClick={() => scrollTo('contacts')}
                  className="w-full py-3.5 font-body text-sm tracking-widest uppercase transition-all hover:opacity-90"
                  style={{ background: 'var(--gold)', color: 'var(--charcoal)' }}>
                  Получить точный расчёт
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENCHES ── */}
      <section id="benches" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Лавочки"
            title="Мемориальная мебель"
            subtitle="Гранитные лавочки и столики — для тихого уединения рядом с близким человеком"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENCH_TYPES.map(bench => (
              <div key={bench.name} className="p-6 border border-gray-100 hover:border-amber-200 transition-all"
                style={{ background: 'var(--ivory)' }}>
                <div className="w-12 h-12 mb-4 flex items-center justify-center border"
                  style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                  <Icon name="Armchair" size={22} />
                </div>
                <h3 className="font-display text-xl font-light mb-1" style={{ color: 'var(--charcoal)' }}>{bench.name}</h3>
                <div className="font-body text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--gold)' }}>{bench.material}</div>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--stone)' }}>{bench.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRANITE ── */}
      <section id="granite" className="py-28 px-6" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Материалы"
            title="Виды гранита"
            subtitle="Работаем с проверенными породами из ведущих российских карьеров"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GRANITE_TYPES.map(g => (
              <div key={g.name} className="flex gap-4 p-6 bg-white border border-gray-100 hover:border-amber-200 transition-all">
                <div className="w-14 h-20 flex-shrink-0 rounded-sm"
                  style={{ background: g.color, border: '1px solid rgba(0,0,0,0.1)' }} />
                <div>
                  <h3 className="font-display text-xl font-light" style={{ color: 'var(--charcoal)' }}>{g.name}</h3>
                  <div className="font-body text-xs tracking-wider uppercase mb-2" style={{ color: 'var(--gold)' }}>{g.origin}</div>
                  <p className="font-body text-sm" style={{ color: 'var(--stone)' }}>{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-8 border-l-2 bg-white" style={{ borderColor: 'var(--gold)' }}>
            <p className="font-display text-lg font-light italic" style={{ color: 'var(--charcoal)' }}>
              "Гранит — один из наиболее прочных природных материалов. Изделие сохраняет внешний вид и чёткость гравировки на протяжении многих десятилетий."
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-28 px-6" style={{ background: 'var(--charcoal)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="Услуги" title="Полный спектр услуг"
            subtitle="От создания до постоянного ухода — мы рядом в любой момент" light />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(s => (
              <div key={s.title} className="p-8 border border-white/10 hover:border-amber-400/30 transition-all">
                <div className="w-10 h-10 mb-5 flex items-center justify-center border"
                  style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                  <Icon name={s.icon} size={18} />
                </div>
                <h3 className="font-display text-xl font-light text-white mb-3">{s.title}</h3>
                <p className="font-body text-sm text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARE ── */}
      <section id="care" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Уход за могилой"
            title="Мы позаботимся о захоронении"
            subtitle="Регулярный профессиональный уход — чтобы место памяти всегда оставалось ухоженным"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARE_SERVICES.map(s => (
              <div key={s.title} className="p-6 border border-gray-100 hover:border-amber-200 transition-all"
                style={{ background: 'var(--ivory)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 flex items-center justify-center border"
                    style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                    <Icon name={s.icon} size={18} />
                  </div>
                  <span className="font-body text-sm font-semibold" style={{ color: 'var(--gold)' }}>{s.price}</span>
                </div>
                <h3 className="font-display text-xl font-light mb-2" style={{ color: 'var(--charcoal)' }}>{s.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--stone)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: 'var(--charcoal)' }}>
            <div>
              <div className="font-display text-2xl font-light text-white mb-1">Годовой абонемент</div>
              <p className="font-body text-sm text-white/50">Постоянный уход весь год. Фотоотчёт после каждого посещения.</p>
            </div>
            <button onClick={() => scrollTo('contacts')}
              className="flex-shrink-0 font-body px-8 py-3.5 text-sm tracking-widest uppercase transition-all hover:opacity-90"
              style={{ background: 'var(--gold)', color: 'var(--charcoal)' }}>
              Узнать подробнее
            </button>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="py-28 px-6" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading label="Галерея" title="Наши работы" subtitle="Примеры выполненных проектов" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <div key={i} className="group relative overflow-hidden aspect-square">
                <img src={item.img} alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(28,36,48,0.6)' }}>
                  <span className="font-body text-sm text-white">{item.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTS ── */}
      <section id="contacts" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Контакты"
            title="Мы здесь для вас"
            subtitle="Приходите лично или свяжитесь удобным способом — ответим в течение 30 минут"
          />
          <div className="grid md:grid-cols-2 gap-12">
            {/* Контактная информация */}
            <div className="space-y-8">
              <div>
                <div className="font-body text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--stone)' }}>Адрес</div>
                <p className="font-display text-2xl font-light" style={{ color: 'var(--charcoal)' }}>
                  г. Лобня, кладбище Киово
                </p>
                <p className="font-body text-sm mt-1" style={{ color: 'var(--stone)' }}>
                  Мы находимся непосредственно на территории кладбища
                </p>
              </div>
              <div>
                <div className="font-body text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--stone)' }}>Телефон</div>
                <a href={`tel:${PHONE}`} className="font-display text-2xl font-light hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--charcoal)' }}>
                  {PHONE_DISPLAY}
                </a>
              </div>
              <div>
                <div className="font-body text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--stone)' }}>Режим работы</div>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>
                  Пн–Пт: 9:00 – 18:00<br />
                  Сб: 10:00 – 16:00<br />
                  Вс: по договорённости
                </p>
              </div>
              <div>
                <div className="font-body text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--stone)' }}>Связаться</div>
                <div className="flex gap-3 flex-wrap">
                  <a href={`tel:${PHONE}`}
                    className="flex items-center gap-2 px-5 py-3 border font-body text-sm transition-all hover:opacity-80"
                    style={{ borderColor: 'var(--gold)', color: 'var(--charcoal)' }}>
                    <Icon name="Phone" size={16} />
                    Позвонить
                  </a>
                  <a href={MAX_LINK} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 font-body text-sm transition-all hover:opacity-90"
                    style={{ background: 'var(--charcoal)', color: 'var(--gold)' }}>
                    <Icon name="MessageCircle" size={16} />
                    Написать в MAX
                  </a>
                </div>
              </div>
            </div>

            {/* Яндекс.Карта */}
            <div>
              <div className="font-body text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--stone)' }}>На карте</div>
              <div className="w-full overflow-hidden border border-gray-100" style={{ height: 380 }}>
                <iframe
                  title="Кладбище Киово на карте"
                  src="https://yandex.ru/map-widget/v1/?ll=37.413%2C56.007&z=15&pt=37.413%2C56.007,pm2rdl&text=%D0%BA%D0%BB%D0%B0%D0%B4%D0%B1%D0%B8%D1%89%D0%B5+%D0%9A%D0%B8%D0%BE%D0%B2%D0%BE+%D0%9B%D0%BE%D0%B1%D0%BD%D1%8F"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  style={{ border: 0, display: 'block' }}
                />
              </div>
              <p className="font-body text-xs mt-2" style={{ color: 'var(--stone)' }}>
                Если карта не открывается —{' '}
                <a href="https://yandex.ru/maps/?text=кладбище+Киово+Лобня"
                  target="_blank" rel="noopener noreferrer"
                  className="underline" style={{ color: 'var(--gold)' }}>
                  открыть в Яндекс.Картах
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6" style={{ background: 'var(--charcoal)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border flex items-center justify-center"
                style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                <Icon name="Diamond" size={14} />
              </div>
              <div>
                <div className="font-display text-base font-light text-white tracking-wide">КЛАДБИЩЕ КИОВО</div>
                <div className="font-body text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--stone)' }}>
                  Администрация · г. Лобня
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)}
                  className="nav-link text-white/40 hover:text-white/70 text-xs">
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-white/30">© 2025 Администрация кладбища Киово. г. Лобня.</p>
            <a href={`tel:${PHONE}`} className="font-body text-xs" style={{ color: 'var(--gold)' }}>{PHONE_DISPLAY}</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Index;