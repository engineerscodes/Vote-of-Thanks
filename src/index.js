const express = require("express");
const { createCanvas, loadImage } = require("canvas");
const app = express();

app.get("/", function (req, res) {
  const username = req.query.username;

  const repo = req.query.repo;

  const fetch = require("node-fetch");

  let requestOptions = {
    method: "GET",
    headers: { Cookie: "_octo=GH1.1.2112506239.1613242999; logged_in=no" },
    redirect: "follow",
  };
  if (username != null && repo != null)
    fetch(
      `https://api.github.com/repos/${username}/${repo}/stats/contributors`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.length);
        let rows = Math.ceil(result.length / 6);
        console.log(rows);

        let svgres = ` 
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        xmlns:svgjs="http://svgjs.com/svgjs" version="1.1"  
        fill="none" id="rootele"  width="${6 * 70}" height="${70 * rows}">
        <style>
          .bg{
            position: relative;
            display:block;
          }

          #rootele{
               position: relative;
               display:block;

          }
           </style>
      
        `;
        let j = 0;
        let c = 0;
        for (i in result) {
          if (c % 6 == 0 && i != 0) {
            j++;
            c = 0;
          }
          const canvas = createCanvas(200, 200);
          const context = canvas.getContext("2d");

          loadImage(`${result[i].author.avatar_url}.png`).then((image) => {
            context.drawImage(image, 0, 0, 200, 200);
            //console.log(
            //canvas.toDataURL() +
            //   "\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
            // );
            return canvas.toDataURL();
          });
          console.log(Urlc);

          svgres =
            svgres +
            `<g><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
               xmlns:svgjs="http://svgjs.com/svgjs" version="1.1"   width="64" height="64"  class="bg" x="${
                 c * 70
               }" y="${j * 70}">
                    <circle cx="32" cy="32" r="32" fill="#aeaeae" />
                          <defs>
                            <clipPath id="circleView" >
                                <circle cx="32" cy="32" r="32" stroke="#c0c0c0" fill="#FFFFFF" />            
                            </clipPath>
                          </defs>
                        <image stroke="black" stroke-width="5" width="70" height="70" src="${i}" clip-path="url(#circleView)" />
                        <text x="50%" y="50%" text-anchor="middle" fill="red" font-size="16px" font-family="Arial" dy=".3em">${
                          result[i].author.login
                        }</text>
             </svg></g>`;
          c++;
        }

        svgres = svgres + `</svg>`;

        res.setHeader("Content-Type", "image/svg+xml");

        res.send(svgres);
      })
      .catch((error) => console.log("error", error));
});

app.listen(8080, () => {
  console.log(`app listening at http://localhost:8080`);
});
