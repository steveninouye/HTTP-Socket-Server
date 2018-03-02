const net = require('net');
const fs = require('fs');
process.stdin.setEncoding('utf8');
let uri = './assets/helium.html';

let pages = {};
fs.readFile('./assets/helium.html', 'utf8', function(err, data) {
  pages.helium = data;
});
fs.readFile('./assets/hydrogen.html', 'utf8', function(err, data) {
  pages.hydrogen = data;
});
fs.readFile('./assets/index.html', 'utf8', function(err, data) {
  pages.index = data;
});
fs.readFile('./assets/404.html', 'utf8', function(err, data) {
  pages.error = data;
});
fs.readFile('./assets/styles.css', 'utf8', function(err, data) {
  pages.css = data;
});
fs.readFile('./assets/super.png', 'utf8', function(err, data) {
  pages.icon = data;
});

var server = net.createServer(socket => {
  socket.setEncoding('utf8');
  let HTTPVersion = 'HTTP/1.1';
  let HTTPStatusCode = '200';
  let ReasonPhrase = 'OK';
  let date = new Date().toUTCString();

  socket.on('data', data => {
    console.log(data.toString());
    const request = data.toString();
    let headerRequestLine = request.split(' ');
    let requestMethod = headerRequestLine[0];
    let uri = headerRequestLine[1];

    let string = '';
    if (uri === '/') {
      string = pages.index;
    } else if (uri === '/css/styles.css') {
      string = pages.css;
    } else if (uri === '/favicon.ico') {
      string = pages.icon;
    } else {
      let page = uri.replace('.html', '');
      page = page.substring(1);
      console.log('page', page);
      string = pages[page] ? pages[page] : pages.error;
    }
    if (string === pages.error) {
      HTTPStatusCode = '404';
      ReasonPhrase = 'Not Found';
    }
    socket.write(`${HTTPVersion} ${HTTPStatusCode} ${ReasonPhrase}\nServer: Superman Steve Server\nDate: ${date}\n
    \n
    ${string}`);
    socket.end('goodbye');
  });
  socket.on('end', () => {
    console.log('request made');
  });
});

server.listen(8080, () => {
  console.log(`Server up on Port 8080`);
});
