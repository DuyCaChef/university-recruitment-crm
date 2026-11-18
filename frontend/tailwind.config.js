/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Override screens hoàn toàn — chỉ dùng md: và desktop:
    screens: {
      md: "768px",
      desktop: "1025px",
    },
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        // Brand (Teal)
        brand: {
          50:   "var(--c-brand-50)",
          100:  "var(--c-brand-100)",
          200:  "var(--c-brand-200)",
          300:  "var(--c-brand-300)",
          400:  "var(--c-brand-400)",
          500:  "var(--c-brand-500)",
          600:  "var(--c-brand-600)",
          700:  "var(--c-brand-700)",
          800:  "var(--c-brand-800)",
          900:  "var(--c-brand-900)",
          text: "var(--c-brand-text)",
        },
        // Clay
        clay: {
          600: "var(--c-clay-600)",
          100: "var(--c-clay-100)",
          ink: "var(--c-clay-ink)",
        },
        // Sand
        sand: {
          DEFAULT: "var(--c-sand)",
          100: "var(--c-sand-100)",
          ink: "var(--c-sand-ink)",
        },
        // Sage
        sage: {
          DEFAULT: "var(--c-sage)",
          100: "var(--c-sage-100)",
          ink: "var(--c-sage-ink)",
        },
        // Mist
        mist: {
          100: "var(--c-mist-100)",
          ink: "var(--c-mist-ink)",
        },
        // Mauve
        mauve: {
          100: "var(--c-mauve-100)",
          ink: "var(--c-mauve-ink)",
        },
        // Neutrals
        canvas:      "var(--c-canvas)",
        surface:     "var(--c-surface)",
        subtle:      "var(--c-subtle)",
        line: {
          DEFAULT: "var(--c-line)",
          strong:  "var(--c-line-strong)",
        },
        ink: {
          DEFAULT: "var(--c-ink)",
          2: "var(--c-ink-2)",
          3: "var(--c-ink-3)",
        },
        focus: "var(--c-focus)",
        // Semantic
        success: {
          bg:     "var(--c-success-bg)",
          ink:    "var(--c-success-ink)",
          border: "var(--c-success-border)",
        },
        warning: {
          bg:     "var(--c-warning-bg)",
          ink:    "var(--c-warning-ink)",
          border: "var(--c-warning-border)",
        },
        danger: {
          bg:     "var(--c-danger-bg)",
          ink:    "var(--c-danger-ink)",
          border: "var(--c-danger-border)",
        },
        info: {
          bg:     "var(--c-info-bg)",
          ink:    "var(--c-info-ink)",
          border: "var(--c-info-border)",
        },
        neutral: {
          bg:     "var(--c-neutral-bg)",
          ink:    "var(--c-neutral-ink)",
          border: "var(--c-neutral-border)",
        },
      },
      borderRadius: {
        xs:     "var(--radius-xs)",
        input:  "var(--radius-input)",
        button: "var(--radius-button)",
        card:   "var(--radius-card)",
        panel:  "var(--radius-panel)",
        pill:   "var(--radius-pill)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [],
};
