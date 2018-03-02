const net = require('net');
process.stdin.setEncoding('utf8');
let method = 'GET';
let uri = '/';
let HTTPVersion = 'HTTP/1.1';
let host = 'www.devleague.com';
let date = new Date();
const arg = process.argv;

const server = net.createConnection({ path: arg[2] }, socket => {
  console.log('Connected to Server on port 8080');
  server.write(
    `${method} ${uri} ${HTTPVersion}\r\nHost: ${host}\r\nConnection: close\r\nAccept: text/html, application/json\r\nDate: ${date}\r\n\r\n`
  );

  server.on('data', data => {
    let dataArray = data.toString().split('\n\n');
    dataArray.splice(0, 2);
    let doc = dataArray.join('');
    console.log(doc);
    server.end();
  });

  server.on('end', () => {
    process.exit();
  });
});
