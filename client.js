const net = require('net');
const arg = process.argv;

const HTTPMethods = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'PATCH'
];
const indexOfMethod =
  arg.indexOf('--method') !== -1 ? arg.indexOf('--method') + 1 : undefined;
const inputMethod = arg[indexOfMethod]
  ? arg[indexOfMethod].toUpperCase()
  : undefined;
if (HTTPMethods.indexOf(inputMethod) === -1 && indexOfMethod) {
  throw new Error('Method input is not valid\n');
}
const indexOfPort =
  arg.indexOf('--port') !== -1 ? arg.indexOf('--port') + 1 : undefined;
const inputPort = arg[indexOfPort] ? Number(arg[indexOfPort]) : undefined;
if (indexOfPort && !inputPort) {
  throw new Error('Port input is not valid');
}

if (arg.length === 2) {
  console.log(
    `Welcome to client.js\nYou may use this file to perform requests to urls and view the body of the response\nTo do this execute the command:\n\nnode client.js {url} --method {method}\n\nexample: node client.js www.devleague.com --method GET\n`
  );
} else {
  const method = indexOfMethod ? inputMethod : 'GET';
  const uri = arg[2].split('/')[1] ? '/' + arg[2].split('/')[1] : '/';
  const HTTPVersion = 'HTTP/1.1';
  const host = arg[2].split('/')[0];
  const date = new Date().toUTCString();
  const port = indexOfPort ? inputPort : 8080;
  let headers = {};
  const serverConnection = setTimeout(function() {
    process.stdout.write(`Could not connect to ${host} on port ${port}\n`);
    process.exit();
  }, 5000);
  const server = net
    .createConnection(port, host, socket => {
      clearTimeout(serverConnection);
      console.log(`Connected to ${host} on port ${port}`);
      server.write(
        `${method} ${uri} ${HTTPVersion}\r\nHost: ${host}\r\nUser-Agent: Steven\r\nConnection: close\r\nAccept: text/html, application/json\r\nDate: ${date}\r\n\r\n`
      );

      server.on('data', data => {
        let dataArray = data.toString().split('\n\n');
        const responseHeader = dataArray[0].split('\n');
        const statusLine = responseHeader[0].split(' ');
        headers.HTTP_Version = statusLine[0];
        headers.Status_Code = statusLine[1];
        headers.Reason = statusLine[2];
        responseHeader.forEach((e, i) => {
          if (i !== 0) {
            const headerKey = e.split(': ')[0];
            const headerValue = e.split(': ')[1];
            headers[headerKey] = headerValue;
          }
        });
        dataArray.splice(0, 2);
        let doc = dataArray.join('');
        process.stdout.write(data.toString());
        server.end();
      });

      server.on('end', () => {
        process.exit();
      });
    })
    .on('error', e => {
      process.stdout.write(`Could not connect to ${host} on port ${port}\n`);
    });
}
