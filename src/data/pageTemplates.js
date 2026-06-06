const LLOYD_PHOTO =
  'https://nebula.wsimg.com/0b017a48ba4cfe46b8d503b4d121925e?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1';

const IMG = (id) =>
  `https://nebula.wsimg.com/${id}?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1`;

const EQUIPMENT_LOGOS = [
  { src: IMG('889af49ab9ce47fa765796db76f2f34c'), alt: 'Equipment brand' },
  { src: IMG('8050f23f7c3b4df91ec1b5e1e471e561'), alt: 'Equipment brand' },
  { src: IMG('481feefa34cc59751f754112f661e396'), alt: 'Equipment brand' },
  { src: IMG('3afe397fc4678073b545b3edff8c0e66'), alt: 'Equipment brand' },
  { src: IMG('5b1d8293d64caa2b3cbf89e56f90fa33'), alt: 'Equipment brand' },
  { src: IMG('08314c4cf283894035c07e08c710e634'), alt: 'Equipment brand' },
  { src: IMG('b2874c763564a1c51bd35046296ff8ee'), alt: 'Equipment brand' },
  { src: IMG('4689d8f6e7d4c7afaaf8de15717518ba'), alt: 'Equipment brand' },
  { src: IMG('74f55ecce7cb21ca29e9fc353486cc11'), alt: 'Equipment brand' },
  { src: IMG('252a09d8dddd0b3accea509919b475c9'), alt: 'Equipment brand' },
  { src: IMG('422f7b8a86419ef909dee50d305566d0'), alt: 'Equipment brand' },
  { src: IMG('6f0d6749bf57bbebb0a9a637808971f4'), alt: 'Equipment brand' },
  { src: IMG('84eb123ac219f84125233087e18aef8b'), alt: 'Equipment brand' },
  { src: IMG('f574955d5cfecbb32eec94ba0a2f4771'), alt: 'Equipment brand' },
  { src: IMG('6f190e8413c7f63fc351dc10ef7ef752'), alt: 'Equipment brand' },
  { src: IMG('547498bc0106921f40c8a8cbe737f63c'), alt: 'Equipment brand' },
  { src: IMG('da1d3ee1d9a25612ee60bf7e88325b06'), alt: 'Equipment brand' },
  { src: IMG('3305030aefbcf72820932082ed0e47a5'), alt: 'Equipment brand' },
  { src: IMG('ad2f7c1ef084415265dc9d371a6c8731'), alt: 'Equipment brand' },
];

function equipmentLogosHtml() {
  const logos = EQUIPMENT_LOGOS.map(
    ({ src, alt }) => `<img src="${src}" alt="${alt}" class="equipment-logo" />`,
  ).join('\n    ');

  return `<div class="equipment-logos">${logos}</div>`;
}

function equipmentListHtml() {
  return `<div class="equipment-section">
  <div class="equipment-list">
    <div class="equipment-group">
      <h3 class="equipment-heading">Mixers</h3>
      <ul>
        <li>Midas M32 Digital Console</li>
        <li>Soundcraft MH2 48 ch. Console</li>
        <li>Crest HP 48 Console</li>
        <li>Allen &amp; Heath GL3300 Console</li>
        <li>Behringer EURO PMX2000</li>
      </ul>
    </div>

    <div class="equipment-group">
      <h3 class="equipment-heading">Amplifiers</h3>
      <ul>
        <li>5x Crown CE 4000 amps</li>
        <li>3x Crown CE 2000 amp</li>
        <li>4x Crown CE 1000 amps</li>
      </ul>
    </div>

    <div class="equipment-group">
      <h3 class="equipment-heading">Signal Processors / Effects</h3>
      <ul>
        <li>2x TC Electronics M-One</li>
        <li>2x TC Electronics D-Two</li>
        <li>Lexicon MP 110</li>
        <li>Digitech S100</li>
        <li>Ibanez Delay</li>
        <li>14x DBX 266XL Comp./Gates</li>
        <li>Behringer MIC2200 tube pre-amp</li>
        <li>Behringer Ultra-BassPro EX1200</li>
        <li>DBX EQ's</li>
        <li>DBX 2/3/4 way crossover</li>
        <li>Behringer DSP 8024 Eq/RTA</li>
      </ul>
    </div>

    <div class="equipment-group">
      <h3 class="equipment-heading">Speakers</h3>
      <ul>
        <li>16x EV QRX 115/75 tops</li>
        <li>10x 218 EV QRX subs</li>
        <li>12x SALA-210 line array speakers</li>
        <li>8x JBL M-Pro 415 monitors</li>
        <li>4x 15 quad sub boxes</li>
        <li>6x Comm. MVP 15 monitors</li>
        <li>18" JBL Drum Sub</li>
      </ul>
    </div>

    <div class="equipment-group">
      <h3 class="equipment-heading">Microphones</h3>
      <ul>
        <li>Shure SM &amp; Beta58</li>
        <li>Shure SM &amp; Beta57</li>
        <li>Shure Beta87</li>
        <li>Shure Beta 52</li>
        <li>Shure Beta91</li>
        <li>Shure SM81</li>
        <li>Shure ULX SM58 wireless</li>
        <li>Audix "D" &amp; "fusion" series</li>
        <li>AKG C1000</li>
        <li>AKG C3000</li>
        <li>AKG D112</li>
        <li>Sennheiser MD421</li>
      </ul>
    </div>

    <div class="equipment-group">
      <h3 class="equipment-heading">Playback Gear</h3>
      <ul>
        <li>iPAD / MAC / PC</li>
        <li>Tascam CD / Cass. player</li>
      </ul>
    </div>

    <div class="equipment-group">
      <h3 class="equipment-heading">Lighting</h3>
      <ul>
        <li>8x 19x15W RGBW wash movers</li>
        <li>4x SHEHDS moving head 230W 7R</li>
        <li>8x Stage Matrix RGB 6x6</li>
        <li>24x PAR64 LEDs</li>
        <li>16x Stagg Headbanger Mini LED Movers</li>
        <li>32x PAR 56 can lights</li>
        <li>16x PAR 38 can lights</li>
        <li>2x Coemar XL's Spot Intell.</li>
        <li>4x ProMovers P64 Intell.</li>
        <li>4x Chauvet Omega Intell.</li>
      </ul>
    </div>

    <div class="equipment-group">
      <h3 class="equipment-heading">Light Consoles / Dimmers</h3>
      <ul>
        <li>Chamsys QuickQ30</li>
        <li>Hogg 1000</li>
        <li>NSI MLC 16 Light Console</li>
        <li>NSI 32 memory Light Console...</li>
        <li>Lightronics 32x16 Light Console</li>
        <li>5x Lightronics Dimmer Packs</li>
        <li>Chauvet DMX-50 Light Controller</li>
      </ul>
    </div>

    <div class="equipment-group">
      <h3 class="equipment-heading">Light stands / trusses</h3>
      <ul>
        <li>28 ft. standing motorized front/rear truss system w/ crowd floods</li>
        <li>4x 15 ft. crank Light stands</li>
        <li>2x 14 ft. "T" Light stands</li>
        <li>4x 10 ft. Light Trusses</li>
        <li>2x 5 ft. Vertical Trusses</li>
      </ul>
    </div>

    <div class="equipment-group">
      <h3 class="equipment-heading">Lighting Misc.</h3>
      <ul>
        <li>8x Strobe Lighting System....</li>
        <li>4x 300watt crowd floods</li>
        <li>36 ft. black backdrop....</li>
        <li>2x Lumiator Followspots..</li>
      </ul>
    </div>
  </div>
</div>`;
}

export const ABOUT_US_TEMPLATE = {
  title: 'About Us',
  body: '',
  blocks: [
    {
      id: 'about-intro',
      type: 'text',
      content:
        'We are a "client-minded" company. This means that we work diligently to relate to our clients and understand their overall goals and objectives so that we can deliver professional events and installations that live up to their expectations. We partner with our clients throughout the entire process. We feel that working with a partner you know and trust makes all the difference.',
      color: '#636363',
      fontSize: '18px',
      textAlign: 'left',
    },
    {
      id: 'about-headlines',
      type: 'html',
      html: `<p style="text-align:center;color:#000080;font-size:28px;font-weight:bold;line-height:1.3;margin:28px 0;">
  Music Express can provide the right equipment to make your next event perfect.
</p>
<p style="text-align:center;color:#000080;font-size:28px;font-weight:bold;line-height:1.3;margin:28px 0;">
  We have production for large concerts &amp; conferences, to small events &amp; gatherings. Music Express has been in business since 1996.
</p>`,
    },
    {
      id: 'about-owner',
      type: 'html',
      html: `<div class="about-owner-section">
  <img src="${LLOYD_PHOTO}" alt="Lloyd Wileman" class="about-owner-photo" />
  <div class="about-owner-quote">
    <p class="about-owner-text">"We put alot of pride in our relationships. We work hard to understand the event or project before we start. We don't try to talk over anyones head. Our goal is to get it right the first time."</p>
    <h4 class="about-owner-name">Lloyd wileman</h4>
    <p class="about-owner-title">OWNER</p>
  </div>
</div>`,
    },
    {
      id: 'about-mission-label',
      type: 'heading',
      text: 'OUR MISSION',
      level: 3,
      color: '#27afcf',
      fontSize: '36px',
      textAlign: 'center',
    },
    {
      id: 'about-mission-text',
      type: 'heading',
      text: 'to exceed customer expectations by being the leading provider of affordable, responsive, value-added services in the audio visual industry.',
      level: 2,
      color: '#192438',
      fontSize: '36px',
      textAlign: 'center',
    },
  ],
};

export const EQUIPMENT_TEMPLATE = {
  title: 'Equipment',
  body: '',
  blocks: [
    {
      id: 'equipment-logos',
      type: 'html',
      html: equipmentLogosHtml(),
    },
    {
      id: 'equipment-list',
      type: 'html',
      html: equipmentListHtml(),
    },
  ],
};

function clientsGridHtml(items) {
  return `<div class="clients-grid">${items.map((item) => `<span class="clients-item">${item}</span>`).join('\n    ')}</div>`;
}

const EVENT_CLIENTS = [
  'Elkhart Co. 4-H Fair',
  'Goshen Community Schools',
  'American Cancer Society',
  'Spring Riot (Western Michigan U.)',
  'Pro-Life Music Festival',
  'NorthWood High School',
  'LaGrange Co. Fair',
  'Bristol Homecoming',
  'LaGrange REMC',
  'Goshen College',
  'Trinity United Methodist Church',
  'Wawasee High School',
  'Calvary UMC',
  'Downtown @ 8:08',
  'Student Ventures (NC)',
  'Cow Jam / Cowboy Up (Mendon, MI)',
  'Fourth Tribe Productions',
  'Between the Buns',
  'Upward Basketball Warsaw / Elkhart',
  'MDA I Muscular Dystrophy Association',
  'Harvest Community Church (Goshen)',
  'Harmony Festival (Three Rivers, MI)',
  'Grace Community (Goshen)',
  'Rhapsody in Green (city of Elkhart)',
  'Oakwood Inn (Syracuse)',
  'River of Life (Elkhart)',
  'Operation Foundation (Ligonier)',
  'Grace UMC (Kokomo, IN)',
  'Traveling Mission Groups',
  'LeSea Broadcasting',
  'Evangelical Methodist Church (General / Yearly Conference - Indianapolis)',
];

const ARTIST_CLIENTS = [
  'Jeremy Camp',
  'Skillet',
  'Starfield',
  'Leeland',
  'Rebecca St. James',
  "Brandon Cash (Johnny's son)",
  'Desperation Band',
  'Mark Schultz',
  'Hawk Nelson',
  'Fireflight',
  'Mute Math',
  'Kathy Troccoli',
  'Superchic[k]',
  'Kutless',
  'Brandon Heath',
  'Avalon',
  'Andrew Peterson',
  'Forever (Beatles Tribute)',
  'FEE',
  'Pillar',
  'Sanctus Real',
  'Chris Rice',
  'Barlow Girl',
  'Todd Agnew',
  'Decyfer Down',
  'Over the Rhine',
  'Family Force 5',
  'Tree 63',
  'KJ-52',
  'Everyday Sunday',
  'Glenn Kaiser',
  'Rita Springer',
  'Carrie Newcomer',
  'Bill Mallonee (V.O.L.)',
  'Kenya Safari Acrobats',
  'Bebo Norman',
  'Seventh Day Slumber',
  'Jonah 33',
  'Dick Stoner (Magic Show)',
  'Disciple',
  'Spoken',
  'D.J. Sticky Boots',
  'Selah',
  '4-Him',
  'Stellar Kart',
  'The Elms',
  'Ruth Cook & Belle',
  'David Phelps',
  'Project 86',
  "Taylor Ware (America's Got Talent)",
];

export const CLIENTS_TEMPLATE = {
  title: 'Clients',
  body: '',
  blocks: [
    {
      id: 'clients-events',
      type: 'html',
      html: `<div class="clients-page">
  <p class="clients-title">EVENTS, INSTALLATIONS &amp; MORE</p>
  ${clientsGridHtml(EVENT_CLIENTS)}
</div>`,
    },
    {
      id: 'clients-artists',
      type: 'html',
      html: `<div class="clients-page">
  <h3 class="clients-heading">artists</h3>
  ${clientsGridHtml(ARTIST_CLIENTS)}
  <p class="clients-more">......plus, many more!</p>
</div>`,
    },
  ],
};

export const STUDIO_TEMPLATE = {
  title: 'Studio',
  body: '',
  blocks: [],
};

export const PAGE_TEMPLATES = {
  '/about-us': ABOUT_US_TEMPLATE,
  '/clients': CLIENTS_TEMPLATE,
  '/equipment': EQUIPMENT_TEMPLATE,
  '/studio': STUDIO_TEMPLATE,
};
