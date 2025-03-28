// tailwind.config.js
export default {
    theme: {
        extend: {
            fontFamily: {
              primary: ['var(--font-primary)', 'sans-serif'], // Main Font
              black: ['var(--font-black)', 'sans-serif'], // Special Black Font
            },
            fontWeight: {
              slight: '300',
              snormal: '400',
              smedium: '500',
              sbold: '700',
              sblack: '900',
            },
            colors: {
                pprimary: "#00D8FF", // Neon Blue
                psecondary: "#FF69B4", // Hot Pink
                cardBg: "#1E1E1E", // Dark Gray for Cards
            textPrimary: "#FFFFFF", // White Text
        },
        scrollbar: {
          hide: '::-webkit-scrollbar { display: none; }',
        },
      },
    },
    plugins: [],
  };
  