// tailwind.config.js
export default {
    theme: {
        extend: {
            fontFamily: {
              primary: ['MyCustomFont', 'sans-serif'],
              blacky: ['AnotherFont', 'sans-serif'],
              secondary: ['MyBoldFont', 'sans-serif'],
            },
            fontWeight: {
              light: 300,
              normal: 400,
              bold: 700,
              black: 900
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
  