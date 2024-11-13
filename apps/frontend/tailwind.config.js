module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        intro: "url('./assets/intro/intro.png')"
      },
      keyframes: {
        slideDown: {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        }
      },
      animation: {
        slideDown: 'slideDown 1s ease-out forwards',
      },
      boxShadow: {
        'text': '-3px 0px 2px #FF7B7B, 0px 3px 2px #FF7B7B, 3px 0px 2px #FF7B7B, 0px -3px 2px #FF7B7B',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow': {
          textShadow: '-3px 0px 2px #FF7B7B, 0px 3px 2px #FF7B7B, 3px 0px 2px #FF7B7B, 0px -3px 2px #FF7B7B',
        },
      });
    },
  ]
};
