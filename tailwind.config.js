/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      "colors": {
              "surface-bright": "#f9f9ff",
              "primary-container": "#6063ee",
              "primary": "#4648d4",
              "on-tertiary-fixed-variant": "#703700",
              "outline": "#767586",
              "on-error-container": "#93000a",
              "background": "#f9f9ff",
              "tertiary": "#904900",
              "primary-fixed-dim": "#c0c1ff",
              "tertiary-fixed-dim": "#ffb783",
              "on-tertiary-fixed": "#301400",
              "on-primary": "#ffffff",
              "inverse-surface": "#2a313d",
              "secondary-container": "#645efb",
              "secondary-fixed-dim": "#c3c0ff",
              "on-primary-fixed-variant": "#2f2ebe",
              "on-primary-fixed": "#07006c",
              "secondary-fixed": "#e2dfff",
              "on-tertiary": "#ffffff",
              "on-surface": "#151c27",
              "surface-dim": "#d3daea",
              "on-primary-container": "#fffbff",
              "on-background": "#151c27",
              "on-secondary": "#ffffff",
              "surface-container": "#e7eefe",
              "inverse-on-surface": "#ebf1ff",
              "tertiary-fixed": "#ffdcc5",
              "on-secondary-fixed-variant": "#3323cc",
              "on-surface-variant": "#464554",
              "tertiary-container": "#b55d00",
              "on-tertiary-container": "#fffbff",
              "outline-variant": "#c7c4d7",
              "surface-container-high": "#e2e8f8",
              "on-error": "#ffffff",
              "surface": "#f9f9ff",
              "surface-tint": "#494bd6",
              "error": "#ba1a1a",
              "surface-container-lowest": "#ffffff",
              "primary-fixed": "#e1e0ff",
              "on-secondary-container": "#fffbff",
              "secondary": "#4b41e1",
              "error-container": "#ffdad6",
              "inverse-primary": "#c0c1ff",
              "surface-container-highest": "#dce2f3",
              "on-secondary-fixed": "#0f0069",
              "surface-container-low": "#f0f3ff",
              "surface-variant": "#dce2f3"
      },
      "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
      },
      "spacing": {
              "md": "16px",
              "3xl": "64px",
              "sm": "8px",
              "gutter": "24px",
              "xl": "32px",
              "2xl": "48px",
              "container-max": "1280px",
              "base": "4px",
              "lg": "24px",
              "xs": "4px"
      },
      "fontFamily": {
              "headline-sm": [
                      "Sora"
              ],
              "headline-lg": [
                      "Sora"
              ],
              "label-md": [
                      "Inter"
              ],
              "headline-lg-mobile": [
                      "Sora"
              ],
              "headline-md": [
                      "Sora"
              ],
              "display-lg": [
                      "Sora"
              ],
              "body-md": [
                      "Inter"
              ],
              "body-sm": [
                      "Inter"
              ],
              "body-lg": [
                      "Inter"
              ]
      },
      "fontSize": {
              "headline-sm": [
                      "20px",
                      {
                              "lineHeight": "28px",
                              "fontWeight": "600"
                      }
              ],
              "headline-lg": [
                      "32px",
                      {
                              "lineHeight": "40px",
                              "letterSpacing": "-0.01em",
                              "fontWeight": "600"
                      }
              ],
              "label-md": [
                      "12px",
                      {
                              "lineHeight": "16px",
                              "letterSpacing": "0.05em",
                              "fontWeight": "600"
                      }
              ],
              "headline-lg-mobile": [
                      "28px",
                      {
                              "lineHeight": "36px",
                              "fontWeight": "600"
                      }
              ],
              "headline-md": [
                      "24px",
                      {
                              "lineHeight": "32px",
                              "fontWeight": "600"
                      }
              ],
              "display-lg": [
                      "48px",
                      {
                              "lineHeight": "56px",
                              "letterSpacing": "-0.02em",
                              "fontWeight": "700"
                      }
              ],
              "body-md": [
                      "16px",
                      {
                              "lineHeight": "24px",
                              "fontWeight": "400"
                      }
              ],
              "body-sm": [
                      "14px",
                      {
                              "lineHeight": "20px",
                              "fontWeight": "400"
                      }
              ],
              "body-lg": [
                      "18px",
                      {
                              "lineHeight": "28px",
                              "fontWeight": "400"
                      }
              ]
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
