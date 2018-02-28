const net = require('net');
process.stdin.setEncoding('utf8');
let method = 'GET';
let uri = '/';
let HTTPVersion = 'HTTP/1.1';
let host = 'www.devleague.com';
let date = new Date();

const server = net.createConnection(8080, socket => {
  console.log('Connected to Server on port 8080');
  server.write(
    `${method} ${uri} ${HTTPVersion}\r\nHost: ${host}\r\nConnection: close\r\nAccept: text/html, application/json\r\nDate: ${date}\r\n\r\n`
  );

  server.on('data', data => {
    console.log(data.toString());
  });

  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      server.write(chunk.toString());
    }
  });
});
