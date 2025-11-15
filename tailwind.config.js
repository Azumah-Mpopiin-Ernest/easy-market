/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },

        // Slide-in animations
        slideInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideInDown: {
          "0%": { opacity: 0, transform: "translateY(-20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: 0, transform: "translateX(20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },

        // Slide-out animations
        slideOutDown: {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(20px)" },
        },
        slideOutUp: {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(-20px)" },
        },
        slideOutLeft: {
          "0%": { opacity: 1, transform: "translateX(0)" },
          "100%": { opacity: 0, transform: "translateX(-20px)" },
        },
        slideOutRight: {
          "0%": { opacity: 1, transform: "translateX(0)" },
          "100%": { opacity: 0, transform: "translateX(20px)" },
        },
      },

      animation: {
        // Fade
        fade: "fade 0.5s ease-in-out",
        fadeSlow: "fade 1s ease-in-out",
        fadeFast: "fade 0.2s ease-in-out",
        fadeOut: "fadeOut 0.5s ease-in-out",

        // Slide-in
        slideInUp: "slideInUp 0.4s ease-out",
        slideInDown: "slideInDown 0.4s ease-out",
        slideInLeft: "slideInLeft 0.4s ease-out",
        slideInRight: "slideInRight 0.4s ease-out",

        // Slide-out
        slideOutDown: "slideOutDown 0.4s ease-in",
        slideOutUp: "slideOutUp 0.4s ease-in",
        slideOutLeft: "slideOutLeft 0.4s ease-in",
        slideOutRight: "slideOutRight 0.4s ease-in",
      }
    },
  },
  plugins: [],
};
