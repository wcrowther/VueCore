/** @type {import('tailwindcss').Config} */
/*eslint-env node*/

export const content = [
  "./index.html",
  "./src/**/*.{vue,js,ts,jsx,tsx}",
];

export const theme = {
  screens: {
    xxs: '390px',
    xs: '480px',
    sm: '640px',
    md: '800px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  extend: {
    dropShadow: {
      'theme-layout': 'var(--theme-shadow)',
    },
    boxShadow: {
      main: '-8px 8px 18px -4px rgba(97,97,97,0.75)',
      'theme-layout': 'var(--theme-shadow)',
    },
    backgroundImage: {
      'brand-logo': 'var(--logo-url)',
      'gradient-brand': 'var(--gradient-brand)',
      'gradient-navbar': 'var(--gradient-navbar)',
      'gradient-back': 'var(--gradient-back)',
      'gradient-footer': 'var(--gradient-footer)',

      'gradient-source': 'linear-gradient( 0, transparent 40%, white 60%)', 
      'gradient-modal-bar': 'linear-gradient( 58deg, #e8e8e8 20%, rgb(125 125 125) 100%)',
      'gradient-table-head': 'linear-gradient( 58deg, #dddddd 50%, #bdbdbd 100%)',
      'gradient-tab-bar': 'linear-gradient( 58deg, #1c2157 50%, black 100%)',
      'gradient-subnav': 'linear-gradient( 170deg, #bdbdbd 0%, white 10%)',
      'gradient-background': 'linear-gradient( to right, #7cb9da 20%, #1b2157 80%)',
      'gradient-main': 'linear-gradient( 205deg, #b8d7ed 0%, white 50%)',
      'gradient-modal': 'linear-gradient( 205deg, #b8d7ed 30%, white 65%)',
      'gradient-side': 'linear-gradient( 205deg, #bdbdbd 0%, white 65%)',
      'gradient-side-alt': 'linear-gradient( 187deg, #868686 0%, white 75%)',
      'gradient-side2': 'linear-gradient( to right, white 75%, #e9e9e9 100%)',
      'gradient-main3': 'linear-gradient( 205deg, #e5e5e5 45%, white 100%)',
      'gradient-stripes': 'linear-gradient( 45deg, rgb(55, 48, 163, 0.5) 22%, #1c2157 83% ),' +
        'repeating-linear-gradient(-45deg, red, red 5px, blue 5px, blue 10px)',
      'gradient-stripes2': 'repeating-linear-gradient(135deg, #1e293b, #1e293b 10px, black 10px, black 20px)',
      'gradient-stripes3': 'repeating-linear-gradient(220deg, #1e293b, #1e293b 10px, black 10px, black 20px)',
      'gradient-white': 'linear-gradient( 0deg, white 0%, white 100%)',
      'gradient-tab': 'linear-gradient( 131deg, #91a5bd 0%, #91a5bd 30%)',
      'gradient-tab-active': 'linear-gradient( 220deg, #dadada 0%, white 20%)',
      // linear-gradient(0deg, rgb(147 147 147 / 30%) 0%, transparent 30%), 
      // linear-gradient( 33deg, transparent 50%, #c4c4c4 80%), 
      // angled version below
      // 'gradient-tab':       'linear-gradient( 105deg, transparent 10%, #dddddd 10%)',
      // 'gradient-tab-active':'linear-gradient( 45deg, transparent 70%, #dadada 90%),linear-gradient( 105deg, transparent 10%, #ffffff 10%)',
    },
    colors: ({ colors }) => ({
      'warm': {
        DEFAULT: '#A9A791',
        '50': '#E8E7E1',
        '100': '#DFDED6',
        '200': '#CDCCBF',
        '300': '#BBB9A8',
        '400': '#A9A791',
        '500': '#908E72',
        '600': '#716F59',
        '700': '#525040',
        '800': '#323127',
        '900': '#13120F'
      },
      'slate': { DEFAULT: colors.slate['500'], ...colors.slate },
      'gray': { DEFAULT: colors.gray['500'], ...colors.gray },
      'zinc': { DEFAULT: colors.zinc['500'], ...colors.zinc },
      'neutral': { DEFAULT: colors.neutral['500'], ...colors.neutral },
      'stone': { DEFAULT: colors.stone['500'], ...colors.stone },
      'red': { DEFAULT: colors.red['500'], ...colors.red },
      'orange': { DEFAULT: colors.orange['500'], ...colors.orange },
      'amber': { DEFAULT: colors.amber['500'], ...colors.amber },
      'yellow': { DEFAULT: colors.yellow['500'], ...colors.yellow },
      'lime': { DEFAULT: colors.lime['500'], ...colors.lime },
      'green': { DEFAULT: colors.green['500'], ...colors.green },
      'emerald': { DEFAULT: colors.emerald['500'], ...colors.emerald },
      'teal': { DEFAULT: colors.teal['500'], ...colors.teal },
      'cyan': { DEFAULT: colors.cyan['500'], ...colors.cyan },
      'sky': { DEFAULT: colors.sky['500'], ...colors.sky },
      'blue': { DEFAULT: colors.blue['500'], ...colors.blue },
      'indigo': { DEFAULT: colors.indigo['500'], ...colors.indigo },
      'violet': { DEFAULT: colors.violet['500'], ...colors.violet },
      'purple': { DEFAULT: colors.purple['500'], ...colors.purple },
      'fuchsia': { DEFAULT: colors.fuchsia['500'], ...colors.fuchsia },
      'pink': { DEFAULT: colors.pink['500'], ...colors.pink },
      'rose': { DEFAULT: colors.rose['500'], ...colors.rose },
      'color-gray': '#cccccc',
      'color-lighter-gray': '#e8e8e8',
      'color-light-gray': '#dddddd',
      'color-mid-gray': '#b7b7b7',
      'color-dark-gray': '#595A50',
      'color-red': '#e53119',
      'color-dark-red': '#b0321f',
      'color-primary': '#99b3cf',
      'color-secondary': '#9b6f24',
      'color-tertiary': '#d6901a',
      'color-blue-gray': '#99b3cf',
      'color-light-blue': '#b8d7ed ',
      'color-mid-blue': '#6fa2ca',
      'color-blue': '#1c2157',
      'color-dark-blue': '#3e5091',
      'color-theme-footer-text': 'var(--theme-footer-text)',
      'color-theme-nav-tab-text': 'var(--theme-footer-text)',
      'color-theme-nav-tab-back': 'var(--theme-footer-text)'
    }),
    fontFamily: {
      sans: 'Roboto, "Trebuchet MS", Verdana, Helvetica, Sans-Serif',
      serif: '"Roboto Serif", Merriweather, serif',
      display: '"Roboto Condensed", Merriweather, "Trebuchet MS", Verdana, Helvetica, Sans-Serif',
    },
    fontSize: {
      xxs: ['0.5rem', { lineHeight: '.75rem' }],
    }
  }
};
export const plugins = 
[
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography')
];


/** new: #443b1f #a57524 #d6901a*/