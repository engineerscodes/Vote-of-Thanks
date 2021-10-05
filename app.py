from flask import Flask
import requests as req
import base64
from utils import docache
from PIL import Image
from io import BytesIO
from flask import request
import io
import gzip


app= Flask(__name__)


@app.route("/")
@docache(hours=12,content_type="image/svg+xml;charset=utf-8")
def home():
    username = request.args.get("username",default="engineerscodes")
    repo= request.args.get("repo",default="PyVisionHUB")
    r = req.get(f'https://api.github.com/repos/{username}/{repo}/stats/contributors')
    rjson=r.json()
    maxclo=len(rjson)/6 +1
    image=f'''<svg xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" 
    version="1.1" width="{6*70}" height="{maxclo*70}">'''
    Colcount=0
    Rowcount=0
    for i in rjson:
        ImageContent=req.get(i['author']['avatar_url']).content
        pilImage = Image.open(BytesIO(ImageContent))
        pilImage.resize((32, 32), Image.ANTIALIAS)
        img_in_bytes = io.BytesIO()
        pilImage.save(img_in_bytes,'png', optimize=True,quality=30)
        dataurl=base64.b64encode(img_in_bytes.getvalue()).decode('UTF-8')
        ImageURL=f"data:image/png;base64,{dataurl}"
        image=image+f'''
        <svg  width="70" height="70"  x="{70*Colcount}" y="{70*Rowcount}" >
                    <rect xmlns="http://www.w3.org/2000/svg"  rx="4.5" width="70"
                     height="70" stroke="#e1e4e8" fill="#FFF" stroke-opacity="1" fill-opacity="1"/>
                     <circle cx="32" cy="32" r="32" fill="#aeaeae" />
                              <defs>
                                <clipPath id="circleView" >
                                    <circle cx="32" cy="32" r="32" stroke="#c0c0c0" fill="#FFFFFF" />            
                                </clipPath>
                              </defs>
                            <image stroke="black" stroke-width="5" width="70" height="70" xlink:href="{ImageURL}" 
                            clip-path="url(#circleView)" />
                            <text x="50%" y="50%"  width="70" height="70" text-anchor="middle" fill="red" font-size="8px" font-family="Arial" dy=".3em">
                             {str(i['author']['login'])[:11]}
                            </text>
                 </svg>
        '''
        Colcount=(Colcount+1)%6
        if Colcount % 10 == 0:
            Rowcount = Rowcount + 1
    image=image+f'</svg>'
    gzipcontent=gzip.compress(image.encode('utf8'),6)
    return gzipcontent

@app.route("/<user>")
def user(user):
    return f"User {user}"
if __name__ == '__main__':
    app.run()

