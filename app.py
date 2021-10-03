from flask import Flask
import requests as req
import base64
from utils import docache


from flask import request



app= Flask(__name__)


@app.route("/")
#@docache(hours=12,content_type="image/svg+xml")
def home():
    username = request.args.get("username",default="engineerscodes")
    repo= request.args.get("repo",default="PyVisionHUB")
    r = req.get(f'https://api.github.com/repos/{username}/{repo}/stats/contributors')
    rjson=r.json()
    maxclo=len(rjson)/6 +1
    print(maxclo," ",len(rjson))
    image=f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        xmlns:svgjs="http://svgjs.com/svgjs" version="1.1"  
        fill="none" id="rootele" width={6 * 70} height={70 * maxclo} >
        <style>
          .bg{{
            position: relative;
            display:block;
          }}

          #rootele{{
               position: relative;
               display:block;

          }}
           </style>'''
    Colcount=0
    Rowcount=0
    for i in rjson:
        dataurl=base64.b64encode(req.get(i['author']['avatar_url']).content).decode('UTF-8')
        ImageURL=f"data:image/png;base64,{dataurl}"
        image=image+f'''
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                   xmlns:svgjs="http://svgjs.com/svgjs" version="1.1"  width="70" height="70"  x={70*Colcount} y={70*Rowcount}  class="bg">
                    
                     <circle cx="32" cy="32" r="32" fill="#aeaeae" />
                              <defs>
                                <clipPath id="circleView" >
                                    <circle cx="32" cy="32" r="32" stroke="#c0c0c0" fill="#FFFFFF" />            
                                </clipPath>
                              </defs>
                            <image stroke="black" stroke-width="5" width="70" height="70" xlink:href={ImageURL} 
                            clip-path="url(#circleView)" />
                            <text x="50%" y="50%"  width="70" height="70" text-anchor="middle" fill="red" font-size="16px" font-family="Arial" dy=".3em">
                             {i['author']['login'] }
                            </text>
                 </svg>
        '''
        Colcount=(Colcount+1)%6
        if Colcount % 10 == 0:
            Rowcount = Rowcount + 1
    image=image+f'</svg>'
    return image

@app.route("/<user>")
def user(user):
    return f"User {user}"
if __name__ == '__main__':
    app.run()

