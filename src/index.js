const express = require("express");

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
       /* let sav = ``;
        for (i in result) {
          // console.log("NAME :" + result[i].author.login + "---> COMMITS :" + result[i].total );
          sav =
            sav +
            `<svg  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 250 250" width="250" height="250" >
                    <circle cx="125" cy="125" r="100" fill="#aeaeae" />
                          <defs>
                            <clipPath id="circleView">
                                <circle cx="125" cy="125" r="100" fill="#FFFFFF" />            
                            </clipPath>
                          </defs>
                        <image width="250" height="250" xlink:href="${result[i].author.avatar_url}" clip-path="url(#circleView)" />
                        <text x="50%" y="50%" text-anchor="middle" fill="red" font-size="16px" font-family="Arial" dy=".3em">${result[i].author.login}</text>
             </svg>
      `;
       
      
        }*/
        //
        let svgres = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="100%" width="100%">`;
        for( i in result){
          svgres =
            svgres +
            `<svg  width="250" height="250" >
                    <circle cx="125" cy="125" r="100" fill="#aeaeae" />
                          <defs>
                            <clipPath id="circleView">
                                <circle cx="125" cy="125" r="100" fill="#FFFFFF" />            
                            </clipPath>
                          </defs>
                        <image width="250" height="250" xlink:href="${result[i].author.avatar_url}" clip-path="url(#circleView)" />
                        <text x="50%" y="50%" text-anchor="middle" fill="red" font-size="16px" font-family="Arial" dy=".3em">${result[i].author.login}</text>
             </svg>`;
        }
        
        svgres=svgres+`</svg>`

        res.setHeader("Content-Type", "image/svg+xml");

        res.send(svgres);
      })
      .catch((error) => console.log("error", error));
});

app.listen(8080);
