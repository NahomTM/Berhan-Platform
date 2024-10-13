/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: "Poppins",
        kaushan: "Kaushan Script",
      },
      backgroundImage: {
        hero1: "url(src/assets/images/hero1.jpg)",
        hero2: "url(src/assets/images/hero2.jpg)",
        hero3: "url(src/assets/images/hero3.jpg)",
      },
      height: {
        '18' : '4.5rem',
        'screen-minus-18': 'calc(100vh - 4.5rem)',
        '500' : '500px',
        '400' : '400px',
        '300' : '300px',
        '200' : '200px',
        '380': '380px',
        '370': '370px',
        '320': '330px',
      },
      width: {
        '18' : '4.5rem',
        '20' : '5rem',
        '1030': '1030px',
        '1000': '1000px',
        '700': '700px',
        '800': '800px',
        '750': '730px',
        '600': '600px',
        '500': '500px',
        '400': '400px',
        '160': '160px',
        '623': '623.5px',
        '300': '300px',
        '380': '380px',
        '370': '370px',
        '320': '330px',
        
      },
      boxShadow: {
        'custom': '0 0 10px rgba(0, 0, 0, 0.2)',
      },
      padding: {
        '0.75' : '0.75px',
        '1.5' : '1.5px',
        'custom' : '3px',
      },
      margin: {
        '200' : '200px',
        '100' : '100px',
        '150' : '150px',
        '500' : '500px',
        '300' : '300px',
        '250' : '250px',
      },
    },
  },
  plugins: [],
};
