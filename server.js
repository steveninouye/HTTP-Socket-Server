const net = require('net');
process.stdin.setEncoding('utf8');
let HTTPVersion = 'HTTP/1.1';
let HTTPStatusCode = '200';
let ReasonPhrase = 'OK';

var server = net.createServer(socket => {
  socket.setEncoding('utf8');

  socket.write(`${HTTPVersion} ${HTTPStatusCode} ${ReasonPhrase}`);

  socket.on('data', data => {
    console.log(data.toString());
  });
});

server.listen(8080, () => {
  console.log(`Server up on Port 8080`);
});
