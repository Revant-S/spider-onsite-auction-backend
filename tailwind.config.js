/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.ejs",
    "./public/**/*.{html,js, css}"
  ],
  theme: {
    extend: {
      keyframes : {
        bar : {
          "0%":{
            width : "100%"
          },
          "50%" : {
            width : "50%"
          },
          "100%":{
            width : "0%"
          }
        },
        moveLeftWaitRight : {
         "0%": { transform: "translateX(100%)" },
          "20%": { transform: "translateX(0)" },
          "80%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(110%)" },
        }
      },
      animation : {
        "bar" : "bar 3s linear 1 forwards",
        moveInOut: "moveLeftWaitRight 5s linear 1 forwards",
      },
      
    },
  },
  plugins: [],
};



// npx tailwindcss -i ./src/client/styles/src/styles.css -o ./public/styles/styles.css  --watch