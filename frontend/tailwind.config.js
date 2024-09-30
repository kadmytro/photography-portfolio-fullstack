/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern: /bg-opacity-(0|10|20|30|40|50|60|70|80|90|100)/,
    },
    {
      pattern: /(mx|my|px|py|lx|rx)-(1|2|3|4|5|6|7|8|9|10)/,
    },
    {
      pattern: /backdrop-blur-(none|sm|md|lg|xl)/,
    },
    {
      pattern:
        /(text|bg)-(black|white|blue-500|green-500|red-500|yellow|primaryText|primary|secondary|secondaryText|tabSelected|tabSelectedText|tabRegularText|card|cardText|input|inputText)/,
    },
  ],
  theme: {
    extend: {
      dropShadow: {
        primary: "0 1px 1px rgba(var(--color-primary), 0.25)",
        primaryText: "0 1px 1px rgba(var(--color-primary-text), 0.25)",
      },
      colors: {
        primary: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-primary), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-primary), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-primary))`;
        },
        primaryText: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-primary-text), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-primary-text), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-primary-text))`;
        },
        secondary: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-secondary), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-secondary), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-secondary))`;
        },
        secondaryText: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-secondary-text), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-secondary-text), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-secondary-text))`;
        },
        header: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-header), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-header), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-header))`;
        },
        headerText: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-header-text), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-header-text), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-header-text))`;
        },
        footer: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-footer), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-footer), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-footer))`;
        },
        footerText: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-footer-text), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-footer-text), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-footer-text))`;
        },
        tabSelected: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-tab-selected), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-tab-selected), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-tab-selected))`;
        },
        tabSelectedText: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-tab-selected-text), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-tab-selected-text), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-tab-selected-text))`;
        },
        tabRegularText: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-tab-regular-text), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-tab-regular-text), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-tab-regular-text))`;
        },
        card: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-card), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-card), var(${opacityVariable}, 1))`;
          }
        },
        cardText: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-card-text), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-card-text), var(${opacityVariable}, 1))`;
          }
        },
        input: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-input), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-input), var(${opacityVariable}, 1))`;
          }
        },
        inputText: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-input-text), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-input-text), var(${opacityVariable}, 1))`;
          }
        },
      },
      borderWidth: {
        1: "1px",
      },
      height: {
        fit: "fit-content",
        "100px": "100px",
        "200px": "200px",
        "300px": "300px",
        "400px": "400px",
        "500px": "500px",
        "600px": "600px",
        "700px": "700px",
        "800px": "800px",
        "5%": "5%",
        "90%": "90%",
        "95%": "95%",
        "80%": "80%",
      },
      width: {
        fit: "fit-content",
        "5%": "5%",
        "90%": "90%",
      },
      minHeight: {
        "100px": "100px",
        "200px": "200px",
        "300px": "300px",
        "400px": "400px",
        "500px": "500px",
        "600px": "600px",
        "700px": "700px",
        "800px": "800px",
      },
      maxHeight: {
        "100px": "100px",
        "200px": "200px",
        "300px": "300px",
        "400px": "400px",
        "500px": "500px",
        "600px": "600px",
        "700px": "700px",
        "800px": "800px",
      },
      minWidth: {
        "100px": "100px",
        "150px": "150px",
        "200px": "200px",
        "300px": "300px",
        "400px": "400px",
        "500px": "500px",
        "600px": "600px",
        "700px": "700px",
        "800px": "800px",
        "900px": "900px",
        "1000px": "1000px",
      },
      maxWidth: {
        "100px": "100px",
        "200px": "200px",
        "300px": "300px",
        "400px": "400px",
        "500px": "500px",
        "600px": "600px",
        "700px": "700px",
        "800px": "800px",
        "900px": "900px",
        "1000px": "1000px",
      },
    },
  },
  plugins: [],
};
