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

// ── Изометрия ─────────────────────────────────────────────────────────────────
// Система координат: X вправо, Y вглубь (от зрителя), Z вверх.
// Камера: сверху-спереди-слева. Видимые грани: передняя (Y=0), правая (X=w), верхняя (Z=h).
// Painter's order (дальние → ближние): нижняя, задняя, левая, правая, передняя, верхняя.

const COS30 = Math.cos(Math.PI / 6); // ≈ 0.866
const SIN30 = Math.sin(Math.PI / 6); // = 0.5

function proj(x: number, y: number, z: number, ox: number, oy: number): [number, number] {
  // Стандартная изометрия: X идёт вправо-вниз, Y — влево-вниз, Z — вверх
  return [
    ox + (x - y) * COS30,
    oy - z + (x + y) * SIN30,
  ];
}

function pts2path(pts: [number, number][]): string {
  return pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ') + 'Z';
}


interface BoxColors {
  top:   string;  // верх — самая светлая (прямой свет сверху)
  front: string;  // передняя (Y=0) — средняя освещённость
  right: string;  // правая (X=w) — тёмная (в тени)
  back:  string;  // задняя + левая — почти чёрная
}

function makeColors(hexBase: string): BoxColors {
  const ri = parseInt(hexBase.slice(1,3),16);
  const gi = parseInt(hexBase.slice(3,5),16);
  const bi = parseInt(hexBase.slice(5,7),16);
  const mk = (f: number) => {
    const c = (v: number) => Math.max(0, Math.min(255, Math.round(v*f)));
    return `#${c(ri).toString(16).padStart(2,'0')}${c(gi).toString(16).padStart(2,'0')}${c(bi).toString(16).padStart(2,'0')}`;
  };
  return {
    top:   mk(1.55),   // очень светлая
    front: mk(0.85),   // чуть темнее базы — хорошо читаемая
    right: mk(0.50),   // тёмная боковая
    back:  mk(0.35),   // почти чёрная задняя/левая
  };
}

// IsoBox — полный параллелепипед, все 6 граней, правильный Z-order.
// Дополнительно на переднюю грань накладывается диагональный блик (highlight).
function IsoBox({
  x, y, z, w, d, h, colors, ox, oy, sw = 0.5, highlight = false,
}: {
  x: number; y: number; z: number;
  w: number; d: number; h: number;
  colors: BoxColors; ox: number; oy: number;
  sw?: number; highlight?: boolean;
}) {
  const p = (dx: number, dy: number, dz: number): [number,number] =>
    proj(x + dx*w, y + dy*d, z + dz*h, ox, oy);
  const sc = '#0a0a0a';

  // Все 6 граней
  const fBot   = pts2path([p(0,0,0), p(1,0,0), p(1,1,0), p(0,1,0)]);
  const fBack  = pts2path([p(0,1,0), p(1,1,0), p(1,1,1), p(0,1,1)]);
  const fLeft  = pts2path([p(0,0,0), p(0,1,0), p(0,1,1), p(0,0,1)]);
  const fRight = pts2path([p(1,0,0), p(1,1,0), p(1,1,1), p(1,0,1)]);
  const fFront = pts2path([p(0,0,0), p(1,0,0), p(1,0,1), p(0,0,1)]);
  const fTop   = pts2path([p(0,0,1), p(1,0,1), p(1,1,1), p(0,1,1)]);

  // Блик на передней грани: тонкая светлая полоса по диагонали (верхний-левый угол)
  const hlPts = highlight ? pts2path([p(0.02,0,0.96), p(0.22,0,0.96), p(0.02,0,0.65)]) : '';

  return (
    <g>
      <path d={fBot}   fill={colors.back}  stroke={sc} strokeWidth={sw} strokeLinejoin="round"/>
      <path d={fBack}  fill={colors.back}  stroke={sc} strokeWidth={sw} strokeLinejoin="round"/>
      <path d={fLeft}  fill={colors.back}  stroke={sc} strokeWidth={sw} strokeLinejoin="round"/>
      <path d={fRight} fill={colors.right} stroke={sc} strokeWidth={sw} strokeLinejoin="round"/>
      <path d={fFront} fill={colors.front} stroke={sc} strokeWidth={sw} strokeLinejoin="round"/>
      <path d={fTop}   fill={colors.top}   stroke={sc} strokeWidth={sw} strokeLinejoin="round"/>
      {highlight && hlPts && (
        <path d={hlPts} fill="rgba(255,255,255,0.18)" stroke="none"/>
      )}
    </g>
  );
}

// IsoStele — стела с фигурным верхом. Все грани строятся через proj().
// Декор на передней грани передаётся через children и позиционируется в изо-пространстве.
function IsoStele({
  x, y, z, w, d, h, shape, colors, ox, oy,
}: {
  x: number; y: number; z: number; w: number; d: number; h: number;
  shape: 'rect' | 'arch' | 'peak';
  colors: BoxColors; ox: number; oy: number;
}) {
  const p3 = (dx: number, dy: number, dz: number): [number,number] =>
    proj(x+dx, y+dy, z+dz, ox, oy);
  const sc = '#0a0a0a';

  // Профиль передней/задней грани (yOff = 0 или d)
  const profile = (yOff: number): [number,number][] => {
    if (shape === 'arch') {
      const arcR = w / 2;
      const arcBase = h - arcR;
      const pts: [number,number][] = [p3(0,yOff,0), p3(w,yOff,0), p3(w,yOff,arcBase)];
      for (let i = 0; i <= 24; i++) {
        const t = (i / 24) * Math.PI;
        pts.push(proj(x + w/2 + arcR*Math.cos(Math.PI-t), y+yOff, z+arcBase+arcR*Math.sin(t), ox, oy));
      }
      pts.push(p3(0,yOff,arcBase));
      return pts;
    }
    if (shape === 'peak') {
      return [
        p3(0,   yOff, 0),      p3(w,     yOff, 0),
        p3(w,   yOff, h*0.76), p3(w*0.72,yOff, h*0.90),
        p3(w*0.5,yOff, h),     p3(w*0.28,yOff, h*0.90),
        p3(0,   yOff, h*0.76),
      ];
    }
    return [p3(0,yOff,0), p3(w,yOff,0), p3(w,yOff,h), p3(0,yOff,h)];
  };

  const frontPts = profile(0);
  const backPts  = profile(d);

  // Высота боковых граней по форме
  const sideH = shape === 'rect' ? h : shape === 'peak' ? h*0.76 : (h - w/2);

  const fBot   = pts2path([p3(0,0,0), p3(w,0,0), p3(w,d,0), p3(0,d,0)]);
  const fBack  = pts2path(backPts);
  const fLeft  = pts2path([p3(0,0,0), p3(0,d,0), p3(0,d,sideH), p3(0,0,sideH)]);
  const fRight = pts2path([p3(w,0,0), p3(w,d,0), p3(w,d,sideH), p3(w,0,sideH)]);
  const fFront = pts2path(frontPts);
  const fTop   = pts2path([p3(0,0,h), p3(w,0,h), p3(w,d,h), p3(0,d,h)]);

  // Блик: верхний левый угол передней грани
  const hlPts  = pts2path([p3(0.5,0,h-2), p3(w*0.25,0,h-2), p3(0.5,0,h*0.6)]);

  return (
    <g>
      <path d={fBot}   fill={colors.back}  stroke={sc} strokeWidth={0.5} strokeLinejoin="round"/>
      <path d={fBack}  fill={colors.back}  stroke={sc} strokeWidth={0.5} strokeLinejoin="round"/>
      <path d={fLeft}  fill={colors.back}  stroke={sc} strokeWidth={0.5} strokeLinejoin="round"/>
      <path d={fRight} fill={colors.right} stroke={sc} strokeWidth={0.5} strokeLinejoin="round"/>
      <path d={fFront} fill={colors.front} stroke={sc} strokeWidth={0.5} strokeLinejoin="round"/>
      {shape === 'rect' && (
        <path d={fTop}  fill={colors.top}  stroke={sc} strokeWidth={0.5} strokeLinejoin="round"/>
      )}
      {/* Блик на полированном граните */}
      <path d={hlPts} fill="rgba(255,255,255,0.12)" stroke="none"/>
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

  const SVG_W = 400;
  const SVG_H = 460;
  const OX = SVG_W / 2 - 10;
  const OY = SVG_H - 80;  // горизонт внизу: ближний край (Y=0) — самый нижний

  // ─ Размеры ─
  // Система координат: памятник стоит у Y=0 (передняя стенка), уходит вглубь (Y+).
  // Покрытие могилы находится ПЕРЕД памятником: от Y = -coverDepth до Y = 0.

  // ─ Глубина достаточная, чтобы верхняя грань была хорошо видна ─
  const sW = twoPersons ? 88 : 54;
  const sD = 28;   // глубина стелы — видимая верхняя грань
  const sH = config.stele === 'stele-combo' ? 130
    : config.stele === 'stele-arch' ? 145
    : config.stele === 'stele-figured' ? 148 : 138;

  const pedH = config.pedestal === 'ped-high' ? 34 : config.pedestal === 'ped-mid' ? 22 : hasPedestal ? 12 : 0;
  const pedW = sW + 12; const pedD = sD + 10;

  const tombH = config.tomb === 'tomb-large' ? 18 : hasTomb ? 11 : 0;
  const tombW = sW + 22; const tombD = sD + 20;

  // ─ Все элементы «перед» памятником: Y отрицательный (ближе к зрителю) ─
  // Плита могилы — горизонтальная плита перед стелой
  const plateH    = hasPlate ? 7 : 0;
  const plateW    = sW + 30;
  const plateFront = 75;   // глубина плиты перед памятником

  // Покрытие могилы — поверх/вместо плиты, перед памятником
  const coverH     = hasCover ? 5 : 0;
  const coverWid   = plateW + 4;
  const coverFront = plateFront + 4;

  // Цветник — бортик вокруг могильной зоны, перед памятником
  const flowerH     = hasFlowerbed ? 10 : 0;
  const flowerW     = sW + 50;
  const flowerFront = plateFront + 14;

  // ─ Z-стеки (снизу вверх) ─
  let curZ = 0;
  const tombZ  = curZ; curZ += tombH;
  const pedZ   = curZ; curZ += pedH;
  const steleZ = curZ;

  // ─ Расстановка по Y ─
  // Y=0 — самое ближнее к зрителю. Больший Y = дальше (вглубь сцены).
  // Плита ближе к нам (малый Y), памятник дальше (большой Y).

  const graveDepth = plateFront; // расстояние могилы перед памятником

  // Плита — у зрителя (Y=0..plateFront)
  const plateX = -plateW / 2; const plateY = 0;
  // Покрытие — чуть меньше плиты по глубине
  const covX   = -coverWid / 2; const covY   = 0;
  // Цветник — охватывает всю могильную зону
  const flX    = -flowerW / 2;  const flY    = 0;

  // Памятник — за могилой (дальше от зрителя)
  const sX = -sW / 2;
  const sY = graveDepth;  // задняя часть сцены

  // Цоколь и тумба выровнены по передней стенке памятника
  const pedX  = -pedW / 2;  const pedY  = graveDepth - (pedD  - sD) / 2;
  const tombX = -tombW / 2; const tombY = graveDepth - (tombD - sD) / 2;

  // ─ Цвета ─
  const GRANITE    = makeColors('#2c2c2c');
  const GRANITE_LT = makeColors('#3a3a3a');
  const PAVING     = makeColors('#7a6a58');
  const GRAVEL     = makeColors('#c8bc9e');
  const TILE_C     = makeColors('#4a4a4a');
  const GRASS      = makeColors('#526838');
  const GRANITE_FL = makeColors('#303030');

  const GOLD = '#C9A84C';

  const steleColors = GRANITE_LT;
  const shape: 'rect' | 'arch' | 'peak' =
    config.stele === 'stele-arch' ? 'arch'
    : config.stele === 'stele-figured' ? 'peak'
    : 'rect';

  const plateColors  = config.plate === 'pl-paving' ? PAVING : GRANITE;
  const coverColors  = config.cover === 'cov-gravel' ? GRAVEL : TILE_C;
  const flowerColors = config.flowerbed === 'fl-granite' ? GRANITE_FL : GRASS;

  // Тень — центр всей сцены
  const sceneDepth = graveDepth + sD;
  const sceneCenterY = sceneDepth / 2;
  const [shadowX, shadowY] = proj(0, sceneCenterY, 0, OX, OY);
  const shadowRX = Math.max(flowerW, tombW, sW) * 0.48;
  const shadowRY = sceneDepth * 0.16;

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      width="100%"
      style={{ maxHeight: 420, display: 'block', margin: '0 auto' }}
      aria-label="3D-схема памятника"
    >
      <defs>
        <radialGradient id="gGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d0dfc0" />
          <stop offset="100%" stopColor="#8aaa6a" />
        </radialGradient>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eae6de" />
          <stop offset="100%" stopColor="#f5f0e8" />
        </linearGradient>
        <filter id="blur3">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Фон */}
      <rect width={SVG_W} height={SVG_H} fill="url(#skyG)" />

      {/* Земля: Y=0 ближний к зрителю, Y большой — дальше */}
      {(() => {
        const gX = 160; const gYnear = 0; const gYfar = 160;
        const gpts: [number,number][] = [
          proj(-gX, gYnear, 0, OX, OY),
          proj( gX, gYnear, 0, OX, OY),
          proj( gX, gYfar,  0, OX, OY),
          proj(-gX, gYfar,  0, OX, OY),
        ];
        return <path d={pts2path(gpts)} fill="url(#gGrad)" stroke="#7A9060" strokeWidth={0.6} />;
      })()}

      {/* Тень */}
      <ellipse
        cx={shadowX + shadowRX * 0.3} cy={shadowY + shadowRY * 0.5}
        rx={shadowRX} ry={shadowRY}
        fill="rgba(0,0,0,0.22)" filter="url(#blur3)"
      />

      {/* Painter's order: сначала дальнее (большой Y = памятник), потом ближнее (малый Y = плита) */}

      {/* Тумба — за могилой, у основания памятника */}
      {hasTomb && (
        <IsoBox
          x={tombX} y={tombY} z={tombZ}
          w={tombW} d={tombD} h={tombH}
          colors={GRANITE} ox={OX} oy={OY}
        />
      )}

      {/* Цоколь */}
      {hasPedestal && (
        <IsoBox
          x={pedX} y={pedY} z={pedZ}
          w={pedW} d={pedD} h={pedH}
          colors={GRANITE} ox={OX} oy={OY}
        />
      )}

      {/* Стела — дальше всего (большой Y) */}
      {config.stele === 'stele-combo' ? (
        <>
          <IsoBox x={sX} y={sY} z={steleZ}
            w={sW} d={sD} h={sH * 0.42}
            colors={GRANITE} ox={OX} oy={OY} highlight />
          <IsoBox x={sX + sW * 0.19} y={sY} z={steleZ + sH * 0.40}
            w={sW * 0.62} d={sD} h={sH * 0.62}
            colors={GRANITE_LT} ox={OX} oy={OY} highlight />
        </>
      ) : (
        <IsoStele
          x={sX} y={sY} z={steleZ}
          w={sW} d={sD} h={sH}
          shape={shape} colors={steleColors}
          ox={OX} oy={OY}
        />
      )}

      {/* Цветник — ближе к зрителю (меньший Y), рисуется после памятника */}
      {hasFlowerbed && (
        <IsoBox
          x={flX} y={flY} z={0}
          w={flowerW} d={flowerFront} h={flowerH}
          colors={flowerColors} ox={OX} oy={OY}
        />
      )}

      {/* Покрытие могилы — ещё ближе */}
      {hasCover && (
        <IsoBox
          x={covX} y={covY} z={0}
          w={coverWid} d={coverFront} h={coverH}
          colors={coverColors} ox={OX} oy={OY}
        />
      )}

      {/* Плита — самая ближняя к зрителю */}
      {hasPlate && (
        <IsoBox
          x={plateX} y={plateY} z={0}
          w={plateW} d={plateFront} h={plateH}
          colors={plateColors} ox={OX} oy={OY}
        />
      )}

      {/* Ваза */}
      {hasVase && (() => {
        const vBaseZ = tombH > 0 ? tombZ + tombH : pedH > 0 ? pedZ + pedH : steleZ;
        const vH = config.vase === 'vas-modern' ? 26 : 22;
        const vW = 9; const vD = 9;
        const vX = sX + sW + 4;
        const vY = sY + 1;
        return (
          <g>
            <IsoBox x={vX}   y={vY}   z={vBaseZ}           w={vW}   d={vD}   h={4}         colors={GRANITE}    ox={OX} oy={OY} sw={0.4}/>
            <IsoBox x={vX+2} y={vY+2} z={vBaseZ+4}         w={vW-4} d={vD-4} h={vH*0.75}   colors={GRANITE}    ox={OX} oy={OY} sw={0.4}/>
            <IsoBox x={vX+1} y={vY+1} z={vBaseZ+4+vH*0.75} w={vW-2} d={vD-2} h={vH*0.25}  colors={GRANITE_LT} ox={OX} oy={OY} sw={0.4}/>
          </g>
        );
      })()}

      {/* Декор на передней грани стелы — всё через proj() */}
      {hasDecor && (() => {
        const dCX = sX + sW / 2;
        const dY  = sY;
        const zTop = steleZ + sH * 0.80;
        const zMid = steleZ + sH * 0.58;

        const [topX, topY] = proj(dCX, dY, zTop, OX, OY);
        const [midX, midY] = proj(dCX, dY, zMid, OX, OY);

        // Пикселей на единицу ширины стелы
        const [pL] = proj(sX,    dY, zMid, OX, OY);
        const [pR] = proj(sX+sW, dY, zMid, OX, OY);
        const u = (pR - pL) / sW;

        if (config.decor === 'dec-cross' || config.decor === 'dec-cross-port') {
          const armLen = u * 10; const barH = u * 34;
          return (
            <g fill={GOLD} opacity={0.93}>
              <rect x={topX-2} y={topY} width={4} height={barH} rx={1}/>
              <rect x={topX-armLen} y={topY+10} width={armLen*2} height={4} rx={1}/>
              {config.decor === 'dec-cross-port' && (() => {
                const pw = u*22; const ph = u*24;
                return (
                  <g>
                    <rect x={midX-pw/2} y={midY-ph/2} width={pw} height={ph}
                      fill={GRANITE_LT.front} stroke={GOLD} strokeWidth={1.2} rx={1}/>
                    <circle cx={midX} cy={midY-ph*0.08} r={ph*0.24}
                      fill={GRANITE.back} stroke={GOLD} strokeWidth={0.7}/>
                  </g>
                );
              })()}
            </g>
          );
        }
        if (config.decor === 'dec-portrait') {
          const pw = u*24; const ph = u*28;
          return (
            <g>
              <rect x={midX-pw/2} y={midY-ph/2} width={pw} height={ph}
                fill={GRANITE_LT.front} stroke={GOLD} strokeWidth={1.3} rx={1}/>
              <circle cx={midX} cy={midY-ph*0.1} r={ph*0.26}
                fill={GRANITE.back} stroke={GOLD} strokeWidth={0.7}/>
              <circle cx={midX} cy={midY-ph*0.17} r={ph*0.11} fill="#555"/>
            </g>
          );
        }
        if (config.decor === 'dec-pattern') {
          return (
            <g stroke={GOLD} strokeWidth={0.9} fill="none" opacity={0.83}>
              <path d={`M${topX-u*18},${topY+4} Q${topX},${topY-10} ${topX+u*18},${topY+4}`}/>
              <path d={`M${topX-u*13},${topY+14} Q${topX},${topY+2} ${topX+u*13},${topY+14}`}/>
              <circle cx={midX} cy={midY} r={u*12}/>
              <circle cx={midX} cy={midY} r={u*5}/>
            </g>
          );
        }
        return null;
      })()}

      {/* Гравировка — строки текста */}
      {(() => {
        const dY  = sY;
        const zTx = steleZ + sH * 0.30;
        const [lx, ly] = proj(sX + sW/2, dY, zTx, OX, OY);
        const [pL] = proj(sX,    dY, zTx, OX, OY);
        const [pR] = proj(sX+sW, dY, zTx, OX, OY);
        const hw = (pR - pL) * 0.4;
        return (
          <g opacity={0.24} stroke="white" strokeWidth={1.0} strokeLinecap="round">
            <line x1={lx-hw}     y1={ly}    x2={lx+hw}     y2={ly}/>
            <line x1={lx-hw*0.8} y1={ly+8}  x2={lx+hw*0.8} y2={ly+8}/>
            <line x1={lx-hw*0.6} y1={ly+16} x2={lx+hw*0.6} y2={ly+16}/>
          </g>
        );
      })()}

      {/* Разделитель 2 лица */}
      {twoPersons && (() => {
        const [bx, by] = proj(sX+sW/2, sY, steleZ,          OX, OY);
        const [tx, ty] = proj(sX+sW/2, sY, steleZ+sH*0.92,  OX, OY);
        return (
          <line x1={bx} y1={by} x2={tx} y2={ty}
            stroke={GOLD} strokeWidth={0.9} strokeDasharray="5 3" opacity={0.55}/>
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