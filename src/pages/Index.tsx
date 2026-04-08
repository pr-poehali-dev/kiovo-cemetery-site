import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const HERO_IMAGE = 'https://cdn.poehali.dev/projects/5cc42949-1e51-4e95-a6b9-902fa99ecf63/files/8d7edaf2-efdd-4bd8-a4a8-a2cadbbb2218.jpg';
const WORKSHOP_IMAGE = 'https://cdn.poehali.dev/projects/5cc42949-1e51-4e95-a6b9-902fa99ecf63/files/6e92eb2c-d260-4754-a697-e9fd05397b92.jpg';
const GALLERY_IMAGE = 'https://cdn.poehali.dev/projects/5cc42949-1e51-4e95-a6b9-902fa99ecf63/files/11b4a65f-6206-45de-965d-e54acaf265d0.jpg';

const NAV_ITEMS = [
  { id: 'home', label: 'Главная' },
  { id: 'about', label: 'О нас' },
  { id: 'configurator', label: 'Конструктор' },
  { id: 'benches', label: 'Лавочки' },
  { id: 'granite', label: 'Гранит' },
  { id: 'services', label: 'Услуги' },
  { id: 'gallery', label: 'Галерея' },
  { id: 'contacts', label: 'Контакты' },
];

const CONFIGURATOR_OPTIONS = {
  persons: [
    { id: '1', label: '1 лицо', icon: '👤' },
    { id: '2', label: '2 лица', icon: '👥' },
  ],
  stele: [
    { id: 'stele-classic', label: 'Классическая', desc: 'Прямоугольная стела' },
    { id: 'stele-arch', label: 'Арочная', desc: 'Сводчатый верх' },
    { id: 'stele-figured', label: 'Фигурная', desc: 'Резной силуэт' },
    { id: 'stele-combo', label: 'Комбинированная', desc: 'Двухуровневая' },
  ],
  pedestal: [
    { id: 'ped-low', label: 'Низкий', desc: 'До 20 см' },
    { id: 'ped-mid', label: 'Средний', desc: '20–40 см' },
    { id: 'ped-high', label: 'Высокий', desc: 'Более 40 см' },
  ],
  tomb: [
    { id: 'tomb-none', label: 'Без тумбы', desc: '' },
    { id: 'tomb-small', label: 'Малая', desc: '40×80 см' },
    { id: 'tomb-large', label: 'Большая', desc: '60×120 см' },
  ],
  flowerbed: [
    { id: 'fl-none', label: 'Без цветника', desc: '' },
    { id: 'fl-open', label: 'Открытый', desc: 'Земляной' },
    { id: 'fl-granite', label: 'Гранитный', desc: 'С бортиком' },
  ],
  plate: [
    { id: 'pl-none', label: 'Без плиты', desc: '' },
    { id: 'pl-granite', label: 'Гранитная', desc: 'Полированная' },
    { id: 'pl-paving', label: 'Брусчатка', desc: 'Природный камень' },
  ],
  cover: [
    { id: 'cov-none', label: 'Без покрытия', desc: '' },
    { id: 'cov-gravel', label: 'Гравий', desc: 'Мраморная крошка' },
    { id: 'cov-tile', label: 'Плитка', desc: 'Гранитная' },
  ],
  vase: [
    { id: 'vas-none', label: 'Без вазы', desc: '' },
    { id: 'vas-classic', label: 'Классическая', desc: 'Гранитная' },
    { id: 'vas-modern', label: 'Современная', desc: 'Строгий стиль' },
  ],
  decor: [
    { id: 'dec-none', label: 'Без декора', desc: '' },
    { id: 'dec-cross', label: 'Крест', desc: 'Православный' },
    { id: 'dec-portrait', label: 'Портрет', desc: 'Гравировка' },
    { id: 'dec-pattern', label: 'Рисунок', desc: 'Орнамент/пейзаж' },
    { id: 'dec-cross-port', label: 'Крест + Портрет', desc: 'Комплект' },
  ],
};

const SERVICES = [
  { icon: 'Hammer', title: 'Изготовление памятников', desc: 'Полный цикл производства из натурального гранита. Контроль качества на каждом этапе.' },
  { icon: 'PenTool', title: 'Художественная гравировка', desc: 'Портреты, эпитафии, орнаменты. Лазерная и ручная гравировка высокой чёткости.' },
  { icon: 'Truck', title: 'Доставка и установка', desc: 'Профессиональный монтаж с соблюдением всех норм. Работаем по всему региону.' },
  { icon: 'RefreshCw', title: 'Реставрация', desc: 'Восстановление и чистка старых памятников. Обновление надписей и покрытий.' },
  { icon: 'Layers', title: 'Благоустройство', desc: 'Комплексное оформление могилы: ограда, дорожки, цветник, лавочка и столик.' },
  { icon: 'FileText', title: 'Документальное оформление', desc: 'Помощь в получении разрешений и оформлении документов на захоронение.' },
];

const GRANITE_TYPES = [
  { name: 'Габбро-диабаз', color: '#2A2A2A', origin: 'Карелия', desc: 'Классический чёрный, самый популярный' },
  { name: 'Лезниковский', color: '#8B7B6B', origin: 'Украина', desc: 'Красновато-коричневый, изысканный' },
  { name: 'Возрождение', color: '#4A5568', origin: 'Россия', desc: 'Серо-голубой, современный' },
  { name: 'Дымовский', color: '#6B7280', origin: 'Украина', desc: 'Серый, универсальный' },
  { name: 'Токовский', color: '#9B5E4A', origin: 'Украина', desc: 'Тёмно-красный, благородный' },
  { name: 'Балтийский', color: '#374151', origin: 'Россия', desc: 'Тёмно-серый, строгий' },
];

const GALLERY_ITEMS = [
  { img: GALLERY_IMAGE, caption: 'Двойной мемориальный комплекс' },
  { img: HERO_IMAGE, caption: 'Классический памятник с крестом' },
  { img: WORKSHOP_IMAGE, caption: 'Изготовление в мастерской' },
  { img: GALLERY_IMAGE, caption: 'Мемориальный комплекс с лавочкой' },
  { img: HERO_IMAGE, caption: 'Гравировка портрета' },
  { img: WORKSHOP_IMAGE, caption: 'Благоустройство захоронения' },
];

const BENCH_TYPES = [
  { name: 'Лавочка-стол комплект', material: 'Гранит + металл', desc: 'Классический набор для уединения и воспоминаний' },
  { name: 'Лавочка одиночная', material: 'Гранит', desc: 'Строгий минималистичный стиль' },
  { name: 'Скамья с подлокотниками', material: 'Гранит + ковка', desc: 'Элегантная ковка ручной работы' },
  { name: 'Комплект с оградой', material: 'Гранит + металл', desc: 'Единый ансамбль ограждения и мебели' },
];

function SectionHeading({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center gap-4 justify-center mb-3">
        <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
        <span className="text-xs font-body tracking-[0.25em] uppercase" style={{ color: 'var(--gold)' }}>{label}</span>
        <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
      </div>
      <h2 className="font-display text-4xl md:text-5xl font-light mb-4 leading-tight" style={{ color: 'var(--charcoal)' }}>{title}</h2>
      {subtitle && <p className="font-body max-w-xl mx-auto text-base leading-relaxed" style={{ color: 'var(--stone)' }}>{subtitle}</p>}
    </div>
  );
}

function OptionCard({ label, desc, selected, onClick }: { label: string; desc?: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      className={`option-card w-full text-left rounded-sm${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      <div className="font-body text-sm font-medium" style={{ color: 'var(--charcoal)' }}>{label}</div>
      {desc && <div className="font-body text-xs mt-0.5" style={{ color: 'var(--stone)' }}>{desc}</div>}
    </button>
  );
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [config, setConfig] = useState({
    persons: '1',
    stele: '',
    pedestal: '',
    tomb: 'tomb-none',
    flowerbed: 'fl-none',
    plate: 'pl-none',
    cover: 'cov-none',
    vase: 'vas-none',
    decor: 'dec-none',
    epitaph: '',
  });
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });

  const setOption = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    NAV_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen font-body" style={{ background: 'var(--ivory)' }}>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/5" style={{ background: 'rgba(28,36,48,0.96)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border flex items-center justify-center" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
              <Icon name="Diamond" size={14} />
            </div>
            <div>
              <div className="font-display text-lg font-light text-white leading-none tracking-wider">МЕМОРИАЛ</div>
              <div className="font-body text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--stone)' }}>Памятники из гранита</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`nav-link transition-colors${activeSection === item.id ? ' active' : ''}`}
                style={{ color: activeSection === item.id ? 'white' : 'rgba(255,255,255,0.6)' }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href="tel:+79001234567" className="hidden md:flex items-center gap-2 font-body text-sm" style={{ color: 'var(--gold)' }}>
              <Icon name="Phone" size={14} />
              +7 (900) 123-45-67
            </a>
            <button className="lg:hidden text-white/70" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={22} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4 px-6" style={{ background: 'var(--charcoal)' }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left py-3 font-body text-sm text-white/70 hover:text-white tracking-widest uppercase border-b border-white/5"
              >
                {item.label}
              </button>
            ))}
            <a href="tel:+79001234567" className="mt-4 flex items-center gap-2 font-body text-sm" style={{ color: 'var(--gold)' }}>
              <Icon name="Phone" size={14} />
              +7 (900) 123-45-67
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(28,36,48,0.75) 0%, rgba(28,36,48,0.5) 50%, rgba(28,36,48,0.88) 100%)' }} />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 justify-center mb-6 animate-fade-in-up">
            <div className="h-px w-12 opacity-60" style={{ background: 'var(--gold)' }} />
            <span className="text-xs font-body tracking-[0.3em] uppercase text-white/60">Мастерская мемориальных изделий</span>
            <div className="h-px w-12 opacity-60" style={{ background: 'var(--gold)' }} />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white mb-6 leading-tight animate-fade-in-up animate-delay-200">
            Сохраняем память<br />
            <em className="not-italic" style={{ color: 'var(--gold-light)' }}>с уважением</em>
          </h1>
          <p className="font-body text-white/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-up animate-delay-400">
            Изготавливаем памятники из натурального гранита. Индивидуальный подход к каждому заказу, гарантия качества.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-600">
            <button
              onClick={() => scrollTo('configurator')}
              className="font-body px-8 py-3.5 text-sm tracking-widest uppercase transition-all hover:opacity-90"
              style={{ background: 'var(--gold)', color: 'var(--charcoal)' }}
            >
              Создать памятник
            </button>
            <button
              onClick={() => scrollTo('contacts')}
              className="font-body px-8 py-3.5 text-sm tracking-widest uppercase border border-white/30 text-white hover:border-white/70 transition-all"
            >
              Связаться с нами
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="font-body text-xs tracking-widest uppercase">Листайте вниз</span>
          <Icon name="ChevronDown" size={16} className="animate-bounce" />
        </div>
      </section>

      {/* STATS */}
      <div className="py-10" style={{ background: 'var(--charcoal)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '20+', label: 'Лет опыта' },
            { num: '5000+', label: 'Выполненных заказов' },
            { num: '15', label: 'Видов гранита' },
            { num: '100%', label: 'Гарантия качества' },
          ].map(stat => (
            <div key={stat.num}>
              <div className="font-display text-3xl font-light" style={{ color: 'var(--gold)' }}>{stat.num}</div>
              <div className="font-body text-xs tracking-widest uppercase text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-body tracking-[0.25em] uppercase" style={{ color: 'var(--gold)' }}>О компании</span>
              <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-6 leading-tight" style={{ color: 'var(--charcoal)' }}>
              Более 20 лет мы создаём достойные памятники
            </h2>
            <p className="font-body text-sm leading-relaxed mb-5" style={{ color: 'var(--stone)' }}>
              Наша мастерская специализируется на изготовлении мемориальных изделий из натурального гранита. Мы понимаем, насколько важен этот момент для каждой семьи, и подходим к каждому заказу с особой внимательностью.
            </p>
            <p className="font-body text-sm leading-relaxed mb-8" style={{ color: 'var(--stone)' }}>
              Используем только проверенные породы гранита, современное оборудование и опытных мастеров гравировки. Каждый памятник — это наша честь и ваша вечная память о близком человеке.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'Shield', label: 'Гарантия 10 лет' },
                { icon: 'Award', label: 'Собственное производство' },
                { icon: 'Clock', label: 'Срок от 7 дней' },
                { icon: 'MapPin', label: 'Установка по региону' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 border flex items-center justify-center flex-shrink-0" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
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

      {/* CONFIGURATOR */}
      <section id="configurator" className="py-28 px-6" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Конструктор"
            title="Создайте ваш памятник"
            subtitle="Подберите все элементы будущего памятника и получите предварительную стоимость"
          />

          <div className="mb-10">
            <h3 className="font-display text-xl font-light mb-4 pb-2 border-b" style={{ color: 'var(--charcoal)', borderColor: 'var(--gold)' }}>
              Количество лиц
            </h3>
            <div className="flex gap-4 flex-wrap">
              {CONFIGURATOR_OPTIONS.persons.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setOption('persons', opt.id)}
                  className="flex items-center gap-3 px-6 py-4 border transition-all duration-200 font-body text-sm"
                  style={{
                    borderColor: config.persons === opt.id ? 'var(--gold)' : '#E5E7EB',
                    background: config.persons === opt.id ? 'rgba(201,168,76,0.06)' : 'white',
                    color: 'var(--charcoal)',
                  }}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              {[
                { key: 'stele', title: 'Стела', options: CONFIGURATOR_OPTIONS.stele },
                { key: 'pedestal', title: 'Цоколь', options: CONFIGURATOR_OPTIONS.pedestal },
                { key: 'tomb', title: 'Тумба', options: CONFIGURATOR_OPTIONS.tomb },
                { key: 'flowerbed', title: 'Цветник', options: CONFIGURATOR_OPTIONS.flowerbed },
              ].map(group => (
                <div key={group.key}>
                  <h3 className="font-display text-xl font-light mb-3 pb-2 border-b" style={{ color: 'var(--charcoal)', borderColor: 'var(--gold)' }}>
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {group.options.map(opt => (
                      <OptionCard
                        key={opt.id}
                        label={opt.label}
                        desc={opt.desc}
                        selected={config[group.key as keyof typeof config] === opt.id}
                        onClick={() => setOption(group.key, opt.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              {[
                { key: 'plate', title: 'Плита', options: CONFIGURATOR_OPTIONS.plate },
                { key: 'cover', title: 'Покрытие', options: CONFIGURATOR_OPTIONS.cover },
                { key: 'vase', title: 'Ваза', options: CONFIGURATOR_OPTIONS.vase },
                { key: 'decor', title: 'Дополнительное оформление', options: CONFIGURATOR_OPTIONS.decor },
              ].map(group => (
                <div key={group.key}>
                  <h3 className="font-display text-xl font-light mb-3 pb-2 border-b" style={{ color: 'var(--charcoal)', borderColor: 'var(--gold)' }}>
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {group.options.map(opt => (
                      <OptionCard
                        key={opt.id}
                        label={opt.label}
                        desc={opt.desc}
                        selected={config[group.key as keyof typeof config] === opt.id}
                        onClick={() => setOption(group.key, opt.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <h3 className="font-display text-xl font-light mb-3 pb-2 border-b" style={{ color: 'var(--charcoal)', borderColor: 'var(--gold)' }}>
                  Эпитафия
                </h3>
                <textarea
                  value={config.epitaph}
                  onChange={e => setOption('epitaph', e.target.value)}
                  placeholder="Введите текст эпитафии..."
                  rows={3}
                  className="w-full border p-3 font-display text-base font-light focus:outline-none resize-none transition-colors bg-white"
                  style={{
                    borderColor: config.epitaph ? 'var(--gold)' : '#E5E7EB',
                    color: 'var(--charcoal)',
                  }}
                />
                <div className="text-xs mt-1 font-body" style={{ color: 'var(--stone)' }}>Рекомендуется до 200 символов</div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8" style={{ background: 'var(--charcoal)' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="font-display text-2xl font-light text-white mb-2">Ваша конфигурация готова</div>
                <div className="font-body text-sm text-white/60 flex flex-wrap gap-x-3">
                  <span>· {config.persons === '1' ? '1 лицо' : '2 лица'}</span>
                  {config.stele && <span>· Стела: {CONFIGURATOR_OPTIONS.stele.find(s => s.id === config.stele)?.label}</span>}
                  {config.decor !== 'dec-none' && <span>· {CONFIGURATOR_OPTIONS.decor.find(d => d.id === config.decor)?.label}</span>}
                  {config.epitaph && <span>· Эпитафия добавлена</span>}
                </div>
              </div>
              <button
                onClick={() => scrollTo('contacts')}
                className="flex-shrink-0 font-body px-8 py-3.5 text-sm tracking-widest uppercase transition-all hover:opacity-90"
                style={{ background: 'var(--gold)', color: 'var(--charcoal)' }}
              >
                Запросить расчёт стоимости
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BENCHES */}
      <section id="benches" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Лавочки"
            title="Мемориальная мебель"
            subtitle="Гранитные лавочки и столики для создания уютного места памяти"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENCH_TYPES.map(bench => (
              <div
                key={bench.name}
                className="p-6 border border-gray-100 hover:border-amber-200 transition-all duration-300"
                style={{ background: 'var(--ivory)' }}
              >
                <div className="w-12 h-12 mb-4 flex items-center justify-center border" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
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

      {/* GRANITE */}
      <section id="granite" className="py-28 px-6" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Материалы"
            title="Виды гранита"
            subtitle="Работаем с проверенными породами гранита из лучших карьеров"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GRANITE_TYPES.map(granite => (
              <div key={granite.name} className="flex gap-4 p-6 bg-white border border-gray-100 hover:border-amber-200 transition-all duration-300">
                <div
                  className="w-14 h-20 flex-shrink-0 rounded-sm"
                  style={{ background: granite.color, border: '1px solid rgba(0,0,0,0.1)' }}
                />
                <div>
                  <h3 className="font-display text-xl font-light" style={{ color: 'var(--charcoal)' }}>{granite.name}</h3>
                  <div className="font-body text-xs tracking-wider uppercase mb-2" style={{ color: 'var(--gold)' }}>{granite.origin}</div>
                  <p className="font-body text-sm" style={{ color: 'var(--stone)' }}>{granite.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-8 border-l-2 bg-white" style={{ borderColor: 'var(--gold)' }}>
            <p className="font-display text-lg font-light italic" style={{ color: 'var(--charcoal)' }}>
              "Гранит — один из самых прочных природных материалов. Памятник из гранита сохранит свой вид на протяжении сотен лет, не теряя цвета и чёткости гравировки."
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-28 px-6" style={{ background: 'var(--charcoal)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-4 justify-center mb-3">
              <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
              <span className="text-xs font-body tracking-[0.25em] uppercase" style={{ color: 'var(--gold)' }}>Услуги</span>
              <div className="h-px w-12" style={{ background: 'var(--gold)' }} />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-4">Полный спектр услуг</h2>
            <p className="font-body text-white/50 max-w-xl mx-auto text-base">От создания до установки — берём на себя всё</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(service => (
              <div key={service.title} className="p-8 border border-white/10 hover:border-amber-400/30 transition-all duration-300">
                <div className="w-10 h-10 mb-5 flex items-center justify-center border" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                  <Icon name={service.icon} size={18} />
                </div>
                <h3 className="font-display text-xl font-light text-white mb-3">{service.title}</h3>
                <p className="font-body text-sm text-white/50 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Галерея"
            title="Наши работы"
            subtitle="Примеры выполненных заказов из нашего портфолио"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <div key={i} className="group relative overflow-hidden aspect-square">
                <img
                  src={item.img}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 transition-all duration-300 flex items-end p-4" style={{ background: 'rgba(28,36,48,0)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(28,36,48,0.6)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(28,36,48,0)')}
                >
                  <span className="font-body text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-28 px-6" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Контакты"
            title="Свяжитесь с нами"
            subtitle="Оставьте заявку и мы перезвоним вам в течение 30 минут"
          />
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-5">
              {[
                { label: 'Ваше имя', key: 'name', type: 'text', placeholder: 'Иван Иванов' },
                { label: 'Телефон', key: 'phone', type: 'tel', placeholder: '+7 (___) ___-__-__' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block font-body text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--stone)' }}>{field.label}</label>
                  <input
                    type={field.type}
                    value={contactForm[field.key as keyof typeof contactForm]}
                    onChange={e => setContactForm(p => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:outline-none transition-colors bg-white"
                    style={{ color: 'var(--charcoal)' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                    onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                  />
                </div>
              ))}
              <div>
                <label className="block font-body text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--stone)' }}>Сообщение</label>
                <textarea
                  value={contactForm.message}
                  onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Расскажите о вашем запросе..."
                  rows={4}
                  className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:outline-none resize-none transition-colors bg-white"
                  style={{ color: 'var(--charcoal)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                />
              </div>
              <button
                className="w-full py-4 font-body text-sm tracking-widest uppercase transition-all hover:opacity-90"
                style={{ background: 'var(--charcoal)', color: 'var(--gold)' }}
              >
                Отправить заявку
              </button>
            </div>

            <div className="space-y-8">
              {[
                { label: 'Адрес', value: 'г. Москва, ул. Мемориальная, д. 12', href: undefined },
                { label: 'Телефон', value: '+7 (900) 123-45-67', href: 'tel:+79001234567' },
                { label: 'Email', value: 'info@memorial.ru', href: 'mailto:info@memorial.ru' },
              ].map(item => (
                <div key={item.label}>
                  <div className="font-body text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--stone)' }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} className="font-display text-xl font-light" style={{ color: 'var(--charcoal)' }}>{item.value}</a>
                  ) : (
                    <p className="font-display text-xl font-light" style={{ color: 'var(--charcoal)' }}>{item.value}</p>
                  )}
                </div>
              ))}
              <div>
                <div className="font-body text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--stone)' }}>Режим работы</div>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>
                  Пн–Пт: 9:00 – 18:00<br />
                  Сб: 10:00 – 16:00<br />
                  Вс: по договорённости
                </p>
              </div>
              <div className="p-6" style={{ background: 'var(--charcoal)' }}>
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" size={18} style={{ color: 'var(--gold)', marginTop: 2 }} />
                  <div>
                    <div className="font-body text-sm text-white/60 mb-1">Также выезжаем на кладбище</div>
                    <div className="font-body text-sm text-white">Замеры и консультация — бесплатно</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6" style={{ background: 'var(--charcoal)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border flex items-center justify-center" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                <Icon name="Diamond" size={14} />
              </div>
              <div className="font-display text-lg font-light text-white tracking-wider">МЕМОРИАЛ</div>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {NAV_ITEMS.slice(0, 5).map(item => (
                <button key={item.id} onClick={() => scrollTo(item.id)} className="nav-link text-white/40 hover:text-white/70 text-xs">
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-white/30">© 2025 Мемориал. Все права защищены.</p>
            <p className="font-body text-xs text-white/30">Изготовление памятников из гранита</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Index;
