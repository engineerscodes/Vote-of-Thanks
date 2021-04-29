const http = require('http');


let app = http.createServer((req, res) => {

    res.writeHead(200, {'Content-Type': 'text/HTML'});


    res.end( '<svg width="100" height="100"> <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /> </svg>'

    );
});


app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');