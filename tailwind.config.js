/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // RadioTable arma sus clases de grilla dinámicamente (`grid-cols-${n}`, `col-span-${n}`
  // según labelColumns + nº de opciones + columna de revertir). Sin safelist, JIT solo
  // genera las que aparecen literales en el código y combinaciones como grid-cols-9 se pierden.
  safelist: [
    { pattern: /^grid-cols-([1-9]|1[0-2])$/ },
    { pattern: /^col-span-([1-9]|1[0-2])$/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primario: "#233245",
        primarioClaro: "#e9ebec",
      },
    },
  },
  plugins: [],
}
