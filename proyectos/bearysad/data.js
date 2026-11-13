// Datos del catálogo Bearysad (fuente: bearysad.com). Precios en CLP.
const CDN = 'https://cdn.shopify.com/s/files/1/0729/1017/6303/files/';
const img = (f, w = 900) => `${CDN}${f}?width=${w}`;

const PRODUCTS = [
  { id: '3porciontee', name: '3PorcionTee', cat: 'poleras', price: 25990, tag: 'Nuevo',
    desc: 'Polera de corte amplio con gráfica frontal de la nueva colección. Algodón pesado y caída boxy, pensada para layering.',
    sizes: ['S', 'M', 'L', 'XL'], images: ['IMG_6915.jpg', 'IMG_2656.jpg', 'IMG_6909_ade1f126-10ee-4311-b7bf-ab700b4181f1.jpg'] },
  { id: 'multicamo-longsleeve', name: 'Multicamo Longsleeve', cat: 'manga-larga', price: 25000, tag: 'Nuevo',
    desc: 'Manga larga con patrón camuflado mixto, el sello de la temporada. Combina con el Multicamo Truckerhat.',
    sizes: ['S', 'M', 'L', 'XL'], images: ['IMG_6737.jpg', 'IMG_6741.jpg', 'IMG_6744.jpg'] },
  { id: 'icemix-longsleeve', name: 'IceMix LongSleeve', cat: 'manga-larga', price: 25000,
    desc: 'Manga larga con estampado “ice mix” en tonos fríos. Fit relajado para usar sola o bajo un jersey.',
    sizes: ['S', 'M', 'L', 'XL'], images: ['IMG_6641.jpg', 'IMG_6635.jpg', 'IMG_6638.jpg'] },
  { id: 'longsleeve-raven', name: 'LongSleeve Raven', cat: 'manga-larga', price: 25000,
    desc: 'Manga larga de la línea Raven, con gráfica oscura y detalles en manga.',
    sizes: ['S', 'M', 'L', 'XL'], images: ['IMG_6625.jpg', 'IMG_2655.jpg', 'IMG_6628.jpg'] },
  { id: 'sunfade-blacktee', name: 'Sunfade Blacktee', cat: 'poleras', price: 22990,
    desc: 'Polera negra con efecto deslavado “sunfade” que le da un look vintage desde el primer uso.',
    sizes: ['S', 'M', 'L', 'XL'], images: ['IMG_6785.jpg', 'IMG_2649.jpg', 'IMG_2640.jpg'] },
  { id: 'unibearsitee', name: 'UniBEARSITEE', cat: 'poleras', price: 22990,
    desc: 'Polera con gráfica estilo universitario reinterpretada con el oso Bearysad.',
    sizes: ['S', 'M', 'L', 'XL'], images: ['IMG_6777.jpg', 'IMG_2645.jpg', 'IMG_2640.jpg'] },
  { id: 'tee', name: 'NewBasket Tee', cat: 'poleras', price: 25000,
    desc: 'Polera loose fit de 280 grs inspirada en la estética basketball. Tela gruesa que mantiene la forma.',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Negro'],
    images: ['B7DA670D-8CE5-49EB-81E9-72EB1C2EF21B.jpg', 'C8C83EFE-A292-4342-B4CC-3EA3790C93A9.jpg', 'A03DAC4F-0390-4C93-9036-EEB182CA0B6C.jpg'] },
  { id: 'long-sleeve', name: 'Long Sleeve Boxyfit', cat: 'manga-larga', price: 25000,
    desc: 'Manga larga boxy fit de 280 grs. Básico pesado para todo el año.',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Blanco', 'Negro'], soldOut: { Negro: ['S', 'M', 'L', 'XL'] },
    images: ['E398EFBA-38F7-4965-BE57-3105C138D8DC.jpg', '386A3F89-D5BC-4801-A8F9-1E9A549674F9.jpg', '8F9C64A9-AFA8-4151-AC1E-AA8055024D2F.jpg'] },
  { id: 'rainbow-babytee', name: 'Rainbow Babytee', cat: 'baby-tees', price: 12000,
    desc: 'Baby tee ajustada con gráfica arcoíris. Corte corto y entallado.',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Blanco', 'Negro'],
    images: ['528BE773-0454-4C2E-AA87-5FBD3276883E.jpg', 'D5808728-A45F-4006-9571-DBEF1A7D3F7E.jpg'] },
  { id: '4-stripes-babyblacktee', name: '4 Stripes Babyblacktee', cat: 'baby-tees', price: 13000,
    desc: 'Baby tee negra con cuatro franjas, inspiración deportiva y corte entallado.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], images: ['D6FA6F12-41A2-43A4-9F5E-E331B8128D1A.jpg', '12828479-71D6-4F15-AFC6-013A62911EE2.jpg', '11614B8C-2451-42F5-BB25-6A0AB45630B6.jpg'] },
  { id: 'redline-tee', name: 'Redline Baby Tee', cat: 'baby-tees', price: 12000, oldPrice: 15000,
    desc: 'Baby tee con línea roja de contraste. Precio rebajado.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], images: ['IMG-2277.jpg', 'IMG-2274.jpg', 'IMG-2272.jpg'] },
  { id: 'runnigtee-black', name: 'RunnigTee Black', cat: 'baby-tees', price: 10000,
    desc: 'Polera estilo running en negro, liviana y con gráfica deportiva.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], images: ['FC362C9F-7E20-4496-BD71-982E3CD5DBC8.jpg', '9B00AD89-BD00-40C2-979A-7C3A8D3AD738.jpg'] },
  { id: 'multicamo-truckerhat', name: 'Multicamo Truckerhat', cat: 'gorros', price: 14990, tag: 'Nuevo',
    desc: 'Jockey trucker con frente camuflado y malla trasera. Talla única ajustable.',
    sizes: ['Única'], images: ['IMG_6732.jpg', 'IMG_6727.jpg', 'IMG_2652.jpg'] },
  { id: 'white-ravenhat', name: 'White RavenHat', cat: 'gorros', price: 14990, tag: 'Nuevo',
    desc: 'Jockey blanco de la línea Raven con bordado frontal. Talla única ajustable.',
    sizes: ['Única'], images: ['IMG_6774.jpg', 'IMG_6768.jpg', 'IMG_6772_f78d577c-bef6-418e-82d8-7564bb957dd1.jpg'] },
  { id: 'raven-blackhat', name: 'Raven Blackhat', cat: 'gorros', price: 13990,
    desc: 'Versión negra del jockey Raven. Talla única ajustable.',
    sizes: ['Única'], images: ['IMG_6830.jpg', 'IMG_6805_e294abbf-c005-4d17-8c4f-e0d50f11742b.jpg', 'IMG_6876_f9b83928-89e0-44ad-ae3a-242cde55ceff.jpg'] },
  { id: 'truckerhat-icyyyy', name: 'Truckerhat Icyyyy', cat: 'gorros', price: 12990,
    desc: 'Trucker amarillo con gráfica “icyyyy”. Talla única ajustable.',
    sizes: ['Única'], images: ['IMG_6671.jpg', 'IMG_6638_a457c78d-a8bf-4393-9a00-d11ce52c7d5c.jpg', 'IMG_2651.jpg'] },
  { id: 'truckerhat-raven', name: 'Truckerhat Raven', cat: 'gorros', price: 12990,
    desc: 'Trucker púrpura de la línea Raven. Talla única ajustable.',
    sizes: ['Única'], images: ['IMG_6708.jpg', 'IMG_6712.jpg', 'IMG_2679.jpg'] },
  { id: 'truckerblack', name: 'Truckerblack', cat: 'gorros', price: 9990,
    desc: 'Trucker negro básico con logo. Talla única ajustable.',
    sizes: ['Única'], images: ['IMG_6697.jpg', 'IMG_6726.jpg', 'IMG_2680.jpg'] },
];

const CATEGORIES = [
  { id: 'todo', label: 'Todo' },
  { id: 'poleras', label: 'Poleras' },
  { id: 'manga-larga', label: 'Manga larga' },
  { id: 'baby-tees', label: 'Baby tees' },
  { id: 'gorros', label: 'Gorros' },
];

// Beary Icons (fuente: bearysad.com/blogs/icons). Cada uno tiene su propia página con tema personalizado.
// song.preview: preview oficial de 30 s (iTunes Search API). radio: true = el artista no tiene catálogo
// disponible, así que suena un tema de la escena como "Bearysad Radio".
const art = (u) => u.replace('100x100bb', '600x600bb');
const BEAR_GIF = 'assets/bear.webp'; // GIF 3D de la marca, recortado y ampliado
const ICONS = [
  { id: 'duki', name: 'Duki', handle: 'duki',
    image: 'https://bearysad.com/cdn/shop/articles/duko.jpg?v=1770434055&width=1600',
    theme: { accent: '#e63946', bg: '#120607' }, tagline: 'Archivo · Movistar Arena Chile · 06/09/25',
    origin: 'Buenos Aires, Argentina', genre: 'Trap · Hip hop',
    bio: [
      'Mauro Ezequiel Lombardo, Duki, salió de las batallas de freestyle de El Quinto Escalón y en 2017 rompió todo con “She Don\'t Give a FO” junto a KHEA, la canción que abrió la puerta al trap argentino.',
      'Hoy es uno de los nombres más grandes de la música urbana en español: discos como “Desde el Fin del Mundo” y “Ameri”, y estadios llenos a ambos lados del Atlántico. En su paso por el Movistar Arena de Santiago subió al escenario vistiendo Bearysad.',
    ],
    facts: [['Origen', 'Argentina'], ['Escena', 'Trap'], ['Hit', 'She Don\'t Give a FO'], ['Con Bearysad', 'Movistar Arena 2025']],
    song: { title: 'She Don\'t Give a FO', artist: 'Duki & KHEA', year: 2017,
      preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/38/e4/00/38e400c8-18c9-e1e0-aa0b-aa21e4d8863c/mzaf_3891642908802927897.plus.aac.p.m4a',
      cover: art('https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/70/92/96/70929633-cec2-561d-afa8-a19428055626/193483792392.jpg/100x100bb.jpg') },
    fit: ['multicamo-longsleeve', 'sunfade-blacktee', 'raven-blackhat'] },
  { id: 'pailita', name: 'Pailita', handle: 'pailita',
    image: 'https://bearysad.com/cdn/shop/articles/52fb9a5a-18fd-420b-be60-bd5d6f0fe793.jpg?v=1770433949&width=1600',
    theme: { accent: '#f5c518', bg: '#0f0d04' }, tagline: 'Música urbana chilena',
    origin: 'Santiago, Chile', genre: 'Urbano · Trap melódico',
    bio: [
      'Pailita es una de las voces que empujó la nueva ola urbana chilena. Su estilo melódico, entre el trap, el reggaetón y el R&B, lo llevó a lo más alto de las listas.',
      'Con “Ultra Solo” junto a Polimá Westcoast (2022) se convirtió en un fenómeno: el tema sumó un remix con Feid, Paloma Mami y De La Ghetto. Su forma de vestir cruza lo deportivo con lo callejero, la misma línea que define a Bearysad.',
    ],
    facts: [['Origen', 'Chile'], ['Escena', 'Urbano'], ['Hit', 'Ultra Solo'], ['Año clave', '2022']],
    song: { title: 'ULTRA SOLO', artist: 'Polimá Westcoast & Pailita', year: 2022,
      preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/05/61/4b/05614b95-d7f3-640c-624d-f58d200e38aa/mzaf_13684523389254606798.plus.aac.p.m4a',
      cover: art('https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/86/bd/89/86bd890a-d31b-4a3b-7217-94090fa1ddcf/886449919413.jpg/100x100bb.jpg') },
    fit: ['3porciontee', 'truckerhat-icyyyy', 'icemix-longsleeve'] },
  { id: 'zellwow', name: 'Zellwow', handle: 'zellwow',
    image: 'https://bearysad.com/cdn/shop/articles/ICON1.jpg?v=1770434072&width=1600',
    theme: { accent: '#7bdff2', bg: '#05101a' }, tagline: 'Beary Icon · Portada de la marca',
    origin: 'Nueva escena', genre: 'Trap melódico · Alternativo',
    bio: [
      'Zellwow es parte de la nueva generación de la escena urbana, con un sonido que juega entre el trap melódico y lo alternativo. En 2026 lanzó “i wonder” y colaboró con ccrepost en “violenta”.',
      'Es la cara que abre la sección de íconos en el sitio oficial de Bearysad: oversize, capas y actitud, un referente de cómo se lleva la marca.',
    ],
    facts: [['Escena', 'Nueva ola'], ['Último tema', 'i wonder'], ['Año', '2026'], ['En Bearysad', 'Portada Icons']],
    song: { title: 'i wonder', artist: 'zellwow', year: 2026,
      preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/36/20/03/362003ce-d014-2cf5-3e1c-ca1b9acd494f/mzaf_17328616906869407332.plus.aac.p.m4a',
      cover: art('https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/94/b8/2d/94b82d08-0f6b-546d-a6ea-25cddb1f8e22/artwork.jpg/100x100bb.jpg') },
    fit: ['icemix-longsleeve', 'unibearsitee', 'white-ravenhat'] },
  { id: 'richboywest', name: 'Richboywest', handle: 'richboywest',
    image: 'https://bearysad.com/cdn/shop/articles/ICON8.png?v=1770434034&width=1600',
    theme: { accent: '#9b5de5', bg: '#0d0614' }, tagline: 'Junto a @mont.pantoja',
    origin: 'Escena urbana', genre: 'Trap · Street',
    bio: [
      'Una dupla que la marca destacó entre sus íconos: Richboywest junto a @mont.pantoja. Dos estilos distintos con una pieza en común, Bearysad.',
      'Su look mezcla prendas oscuras de la línea Raven con básicos pesados: la prueba de que la marca funciona igual en solitario que en crew.',
    ],
    facts: [['Formato', 'Dupla'], ['Junto a', '@mont.pantoja'], ['Línea', 'Raven'], ['Vibra', 'Crew']],
    song: { radio: true, title: 'ULTRA SOLO', artist: 'Polimá Westcoast & Pailita', year: 2022,
      preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/05/61/4b/05614b95-d7f3-640c-624d-f58d200e38aa/mzaf_13684523389254606798.plus.aac.p.m4a',
      cover: art('https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/86/bd/89/86bd890a-d31b-4a3b-7217-94090fa1ddcf/886449919413.jpg/100x100bb.jpg') },
    fit: ['longsleeve-raven', 'truckerhat-raven', 'tee'] },
  { id: 'randynotagram', name: 'Randynotagram', handle: 'randynotagram',
    image: 'https://bearysad.com/cdn/shop/articles/ICON11.jpg?v=1770433989&width=1600',
    theme: { accent: '#80b918', bg: '#081005' }, tagline: 'Beary Icon',
    origin: 'Escena urbana', genre: 'Trap · Street',
    bio: [
      'Parte de la familia de íconos de Bearysad. Camuflado, piezas holgadas y accesorios: la fórmula exacta de la temporada.',
      'Su fit es el que más se repite en la calle: Multicamo de pies a cabeza con un toque de color en el baby tee.',
    ],
    facts: [['Estilo', 'Camo total'], ['Pieza clave', 'Multicamo'], ['Temporada', '2026'], ['Vibra', 'Calle']],
    song: { radio: true, title: 'She Don\'t Give a FO', artist: 'Duki & KHEA', year: 2017,
      preview: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/38/e4/00/38e400c8-18c9-e1e0-aa0b-aa21e4d8863c/mzaf_3891642908802927897.plus.aac.p.m4a',
      cover: art('https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/70/92/96/70929633-cec2-561d-afa8-a19428055626/193483792392.jpg/100x100bb.jpg') },
    fit: ['multicamo-truckerhat', 'multicamo-longsleeve', '4-stripes-babyblacktee'] },
];

// Campaña "Summertime & Icecream" (fotos del Drive de la marca, optimizadas en assets/campaign).
const COLLECTION = 'Summertime & Icecream';
const CAMPAIGN = [
  ['6737', 'Kiosco'], ['6865', 'Raven'], ['6926', 'Almacén'], ['6658', 'Persiana'], ['6708', 'Esquina'],
  ['6777', 'Trenzas'], ['6747', 'Multicamo'], ['6669', 'Brown tee'], ['6785', 'Sunfade'], ['6916', 'Crew'],
  ['6724', 'Calle'], ['6805', 'Wall'], ['6767', 'Duo'], ['6871', 'Close-up'], ['6911', 'Squad'], ['6607', 'Bloque'],
  ['6687', 'Black 24'], ['6898', 'Escena'],
].map(([f, cap]) => ({ src: `assets/campaign/${f}.jpg`, cap }));

// Fotos de la comunidad (imágenes aportadas por el dueño del portafolio).
const LOOKBOOK = ['1.png', '2.png', '3.png', '4.png', '6.png', '7.png', '8.png'].map(f => `assets/lookbook/${f}`);

// Códigos de descuento de la demo y datos de despacho.
const PROMOS = { BEARY10: { pct: 10, label: '10% Beary' }, ICONS15: { pct: 15, label: '15% Icons' } };
const FREE_SHIPPING = 50000;
const SHIPPING = { domicilio: { label: 'Despacho a domicilio', price: 3990, eta: 4 }, express: { label: 'Express (RM)', price: 6990, eta: 1 }, retiro: { label: 'Retiro en showroom', price: 0, eta: 2 } };
const REGIONES = ['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso', 'Metropolitana', "O'Higgins", 'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'];
