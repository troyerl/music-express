import { ABOUT_US_TEMPLATE, CLIENTS_TEMPLATE, EQUIPMENT_TEMPLATE, STUDIO_TEMPLATE } from './pageTemplates.js';

export const DEFAULT_CONTENT = {
  phone: '574-536-7147',
  copyright: 'Copyright © Music Express. All rights reserved',
  uploadedMedia: [],
  social: {
    facebook: 'https://facebook.com/',
    twitter: 'https://twitter.com/',
  },
  images: {
    logo: 'https://nebula.wsimg.com/74cd9ac03fa7464e6fe33712212fdd9d?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    tagline: 'https://nebula.wsimg.com/484bf043feb612768a48767f28f74476?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    socialFacebook: 'https://nebula.wsimg.com/0f761c1ab4b11212ec5645f230ae31d9?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    socialTwitter: 'https://nebula.wsimg.com/8d210bc51a105dd404595e7925a5d66a?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    heroBackground: 'https://nebula.wsimg.com/5b53b03de359245f9a8dc5acf9845455?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    footerLogo: 'https://nebula.wsimg.com/8354b5e54d0fe355b29b753337358125?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
  },
  hero: {
    ctaLine1: 'WE CAN help',
    ctaLine2: 'contact us today',
    headlines: ['sound', 'lighting', 'video', 'production'],
  },
  galleryImages: [
    'https://nebula.wsimg.com/66ee98dd12f0f06f4fd2b3b6208dd9a5?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    'https://nebula.wsimg.com/7f5ab9bdd164a4b08fb06f28cd956cb5?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    'https://nebula.wsimg.com/4d1976a30fe3ca903d7dbc5a36e94b93?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    'https://nebula.wsimg.com/ddfa1bbc8e588ab2e750bee7b60cb217?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    'https://nebula.wsimg.com/13841a6b68748cc54dc21b21916bbd8f?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    'https://nebula.wsimg.com/22af1e583edc9b486847f3d5186fc914?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    'https://nebula.wsimg.com/04406270cfa3c87ea0d9fd740e037a62?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    'https://nebula.wsimg.com/0718926b80b5d4c4fdc2a7e34172f426?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
    'https://nebula.wsimg.com/c662cff33581272f4b62e5b3a397f485?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
  ],
  featureCards: [
    {
      title: 'Seismic audio',
      description:
        "It's now easier than ever for your church or school to move up to a line array system for way less. Contact us to see how.",
      mediaType: 'youtube',
      youtubeId: '6388dAsgc5w',
      imageUrl: '',
      imageAlt: '',
      buttonLabel: 'Learn More',
      buttonHref: 'https://youtu.be/6388dAsgc5w',
      buttonExternal: true,
      extraButtonLabel: '',
      extraButtonHref: '',
    },
    {
      title: 'We can get what you need',
      description: 'We can supply you with the equipment you need for your next event.',
      mediaType: 'image',
      youtubeId: '',
      imageUrl:
        'https://nebula.wsimg.com/2fa620451fa2b278d5d9df928277252f?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
      imageAlt: 'Seismic Audio',
      buttonLabel: 'Learn More',
      buttonHref: '/contact-us',
      buttonExternal: false,
      extraButtonLabel: '',
      extraButtonHref: '',
    },
    {
      title: 'my dmx 3.0',
      description:
        "ADJ's myDMX 3.0 has a new, robust hardware dongle and exciting new features to take greater command of your lightshow.",
      mediaType: 'youtube',
      youtubeId: 'UPEwaKn4wAo',
      imageUrl: '',
      imageAlt: '',
      buttonLabel: 'Learn More',
      buttonHref: '/about-us',
      buttonExternal: false,
      extraButtonLabel: '',
      extraButtonHref: '',
    },
    {
      title: 'The music kitchen',
      description:
        'Your source of expert advice and how-to resources for musicians, composers, and songwriters.',
      mediaType: 'image',
      youtubeId: '',
      imageUrl:
        'https://nebula.wsimg.com/cf29acacf729c64ee66fc8f959fab6e6?AccessKeyId=042735BF8B97AAF39122&disposition=0&alloworigin=1',
      imageAlt: 'The Music Kitchen',
      buttonLabel: 'Learn More',
      buttonHref: 'https://www.themusickitchen.com/',
      buttonExternal: true,
      extraButtonLabel: '[ click here ]',
      extraButtonHref: '/contact-us',
    },
  ],
  serviceAreas:
    'South Bend, Goshen, Elkhart, Mishawaka, Ft Wayne, Kokomo, Indianapolis, Detroit, Sturgis, Kalamazoo, Three Rivers, Warsaw',
  regionBanner: {
    title: "WE'LL BE THERE.",
    subtitle: 'INDIANA. MICHIGAN.',
    ctaLabel: 'Contact Us Today',
  },
  pages: {
    '/about-us': {
      ...ABOUT_US_TEMPLATE,
      blocks: structuredClone(ABOUT_US_TEMPLATE.blocks),
    },
    '/clients': {
      ...CLIENTS_TEMPLATE,
      blocks: structuredClone(CLIENTS_TEMPLATE.blocks),
    },
    '/equipment': {
      ...EQUIPMENT_TEMPLATE,
      blocks: structuredClone(EQUIPMENT_TEMPLATE.blocks),
    },
    '/studio': {
      ...STUDIO_TEMPLATE,
      blocks: [],
    },
    '/contact-us': {
      title: 'Contact Us',
      body: 'Ready to elevate your next event? Call us or reach out today. We serve Indiana and Michigan.',
      blocks: [],
    },
  },
  homeBlocks: [],
};
