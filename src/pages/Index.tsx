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

// ── 2D SVG превью ─────────────────────────────────────────────────────────────

function MonumentPreview({ config }: { config: ConfigState }) {
  const hasPedestal  = config.pedestal !== 'ped-none';
  const hasTomb      = config.tomb !== 'tomb-none';
  const hasFlowerbed = config.flowerbed !== 'fl-none';
  const hasPlate     = config.plate !== 'pl-none';
  const hasCover     = config.cover !== 'cov-none';
  const hasVase      = config.vase !== 'vas-none';
  const hasDecor     = config.decor !== 'dec-none';
  const twoPersons   = config.persons === '2';

  const svgW = 340;
  const svgH = 420;
  const groundY = svgH - 60;
  const gold = '#C9A84C';
  const dark = '#2A2A2A';
  const mid  = '#3D3D3D';

  const steleW = twoPersons ? 200 : 120;
  const steleH = config.stele === 'stele-combo' ? 200
    : config.stele === 'stele-figured' ? 215
    : config.stele === 'stele-arch' ? 205 : 190;

  const pedestalH = config.pedestal === 'ped-high' ? 50 : config.pedestal === 'ped-mid' ? 35 : hasPedestal ? 20 : 0;
  const tombH     = config.tomb === 'tomb-large' ? 28 : hasTomb ? 18 : 0;
  const plateH    = hasPlate ? 14 : 0;
  const coverH    = hasCover ? 10 : 0;
  const flowerH   = hasFlowerbed ? 22 : 0;

  const totalBaseH = pedestalH + tombH + plateH + coverH + flowerH;
  const steleBottomY = groundY - totalBaseH - steleH;
  const pedestalY    = steleBottomY + steleH;
  const tombY        = pedestalY + pedestalH;
  const plateY       = tombY + tombH;
  const coverY       = plateY + plateH;
  const flowerY      = coverY + coverH;
  const steleX       = (svgW - steleW) / 2;

  const SteleShape = () => {
    if (config.stele === 'stele-arch') {
      const arcH = 42;
      return (
        <path
          d={`M ${steleX} ${steleBottomY + arcH}
              Q ${steleX} ${steleBottomY} ${steleX + steleW / 2} ${steleBottomY}
              Q ${steleX + steleW} ${steleBottomY} ${steleX + steleW} ${steleBottomY + arcH}
              L ${steleX + steleW} ${steleBottomY + steleH}
              L ${steleX} ${steleBottomY + steleH} Z`}
          fill={dark}
        />
      );
    }
    if (config.stele === 'stele-figured') {
      return (
        <path
          d={`M ${steleX} ${steleBottomY + steleH}
              L ${steleX} ${steleBottomY + 40}
              Q ${steleX} ${steleBottomY} ${steleX + steleW * 0.28} ${steleBottomY}
              Q ${steleX + steleW * 0.5} ${steleBottomY - 18} ${steleX + steleW * 0.72} ${steleBottomY}
              Q ${steleX + steleW} ${steleBottomY} ${steleX + steleW} ${steleBottomY + 40}
              L ${steleX + steleW} ${steleBottomY + steleH} Z`}
          fill={dark}
        />
      );
    }
    if (config.stele === 'stele-combo') {
      const rx = steleX + steleW * 0.15;
      const rw2 = steleW * 0.7;
      return (
        <g>
          <rect x={steleX} y={steleBottomY + 80} width={steleW} height={steleH - 80} fill={dark} />
          <rect x={rx} y={steleBottomY} width={rw2} height={90} fill={mid} />
        </g>
      );
    }
    return <rect x={steleX} y={steleBottomY} width={steleW} height={steleH} fill={dark} />;
  };

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%"
      style={{ maxHeight: 370, display: 'block', margin: '0 auto' }}
      aria-label="Схема памятника">

      <rect width={svgW} height={svgH} fill="#F5F0E8" />
      <rect x={0} y={groundY} width={svgW} height={svgH - groundY} fill="#6B7C5A" opacity="0.3" />
      <line x1={0} y1={groundY} x2={svgW} y2={groundY} stroke="#8B9A72" strokeWidth={1.5} />

      {/* Покрытие */}
      {hasCover && (
        <rect x={steleX - 22} y={coverY} width={steleW + 44} height={coverH}
          fill={config.cover === 'cov-gravel' ? '#D1C9B8' : '#5C5C5C'} rx={1} />
      )}

      {/* Плита */}
      {hasPlate && (
        <rect x={steleX - 16} y={plateY} width={steleW + 32} height={plateH}
          fill={config.plate === 'pl-granite' ? '#3A3A3A' : '#B0A090'} rx={1} />
      )}

      {/* Цветник */}
      {hasFlowerbed && (
        <g>
          <rect x={steleX - 28} y={flowerY} width={steleW + 56} height={flowerH}
            fill={config.flowerbed === 'fl-granite' ? '#3D3D3D' : '#7A9B5A'} rx={2} />
          {config.flowerbed === 'fl-granite' && (
            <>
              <rect x={steleX - 28} y={flowerY} width={6} height={flowerH} fill="#4A4A4A" />
              <rect x={steleX + steleW + 22} y={flowerY} width={6} height={flowerH} fill="#4A4A4A" />
            </>
          )}
        </g>
      )}

      {/* Тумба */}
      {hasTomb && (
        <rect x={steleX - 12} y={tombY} width={steleW + 24} height={tombH} fill={dark} rx={1} />
      )}

      {/* Цоколь */}
      {hasPedestal && (
        <rect x={steleX - 6} y={pedestalY} width={steleW + 12} height={pedestalH} fill={mid} rx={1} />
      )}

      <SteleShape />

      {/* Декор — крест */}
      {hasDecor && config.decor === 'dec-cross' && (
        <g fill={gold} opacity={0.9}>
          <rect x={steleX + steleW / 2 - 3} y={steleBottomY + 20} width={6} height={42} />
          <rect x={steleX + steleW / 2 - 15} y={steleBottomY + 34} width={30} height={6} />
        </g>
      )}

      {/* Декор — портрет */}
      {hasDecor && (config.decor === 'dec-portrait' || config.decor === 'dec-cross-port') && (() => {
        const py = config.decor === 'dec-cross-port' ? steleBottomY + 58 : steleBottomY + 24;
        return (
          <g>
            {config.decor === 'dec-cross-port' && (
              <g fill={gold} opacity={0.85}>
                <rect x={steleX + steleW / 2 - 3} y={steleBottomY + 18} width={5} height={32} />
                <rect x={steleX + steleW / 2 - 11} y={steleBottomY + 29} width={22} height={5} />
              </g>
            )}
            <rect x={steleX + steleW / 2 - 23} y={py} width={46} height={56}
              fill="none" stroke={gold} strokeWidth={1.5} rx={2} />
            <circle cx={steleX + steleW / 2} cy={py + 20} r={14} fill={mid} />
            <circle cx={steleX + steleW / 2} cy={py + 16} r={6} fill="#555" />
            <path d={`M ${steleX + steleW / 2 - 14} ${py + 34} Q ${steleX + steleW / 2} ${py + 28} ${steleX + steleW / 2 + 14} ${py + 34}`}
              fill={mid} stroke="none" />
          </g>
        );
      })()}

      {/* Декор — рисунок */}
      {hasDecor && config.decor === 'dec-pattern' && (
        <g stroke={gold} strokeWidth={1} fill="none" opacity={0.65}>
          <path d={`M ${steleX + 16} ${steleBottomY + 28} Q ${steleX + steleW / 2} ${steleBottomY + 8} ${steleX + steleW - 16} ${steleBottomY + 28}`} />
          <path d={`M ${steleX + 20} ${steleBottomY + 44} Q ${steleX + steleW / 2} ${steleBottomY + 24} ${steleX + steleW - 20} ${steleBottomY + 44}`} />
          <circle cx={steleX + steleW / 2} cy={steleBottomY + 60} r={14} />
          <circle cx={steleX + steleW / 2} cy={steleBottomY + 60} r={6} />
        </g>
      )}

      {/* Надпись */}
      <g opacity={0.3}>
        <line x1={steleX + 14} y1={steleBottomY + steleH - 54} x2={steleX + steleW - 14} y2={steleBottomY + steleH - 54} stroke="white" strokeWidth={1.5} />
        <line x1={steleX + 20} y1={steleBottomY + steleH - 41} x2={steleX + steleW - 20} y2={steleBottomY + steleH - 41} stroke="white" strokeWidth={1.5} />
        <line x1={steleX + 24} y1={steleBottomY + steleH - 29} x2={steleX + steleW - 24} y2={steleBottomY + steleH - 29} stroke="white" strokeWidth={1.5} />
      </g>

      {/* Ваза */}
      {hasVase && (
        <g>
          <ellipse cx={steleX + steleW + 22} cy={tombY > groundY ? groundY - 2 : tombY - 2}
            rx={10} ry={5} fill={dark} />
          <path d={`M ${steleX + steleW + 12} ${tombY > groundY ? groundY - 2 : tombY - 2}
                    Q ${steleX + steleW + 10} ${tombY > groundY ? groundY - 28 : tombY - 28}
                      ${steleX + steleW + 22} ${tombY > groundY ? groundY - 30 : tombY - 30}
                    Q ${steleX + steleW + 34} ${tombY > groundY ? groundY - 28 : tombY - 28}
                      ${steleX + steleW + 32} ${tombY > groundY ? groundY - 2 : tombY - 2} Z`}
            fill={dark} />
        </g>
      )}

      {/* Разделитель 2 лица */}
      {twoPersons && (
        <line x1={steleX + steleW / 2} y1={steleBottomY + 8}
          x2={steleX + steleW / 2} y2={steleBottomY + steleH - 22}
          stroke={gold} strokeWidth={0.8} strokeDasharray="4 3" opacity={0.5} />
      )}

      <text x={svgW / 2} y={svgH - 8} textAnchor="middle"
        fontSize={10} fill="#8B8B8B" fontFamily="Golos Text, sans-serif">
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