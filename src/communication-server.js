const make_key = require('./make-key');
const http = require('http');
var os = require('os');
var ifaces = os.networkInterfaces();
const encrypt = require('./encryption/encrypt')
const decrypt = require('./encryption/decrypt')

var hostname = null
var port = 6767

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
  if ('IPv4' !== iface.family || iface.internal !== false) {
    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
    return;
  }

  if (alias >= 1) {
    // this single interface has multiple ipv4 addresses
    hostname = iface.address
  } else {
    // this interface has only one ipv4 adress
    hostname = iface.address
  }
  ++alias;
  });
});

var server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = String(); // create body
    req.on('data', data => body += data); // update body with POST content

    req.on('end', () => {
      let file = JSON.parse(body);
      let key = require('./keys.json')[file.client_name]
      console.log(decrypt(key, file.data))
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end();
    });
  } else {
    res.write(" This site is used as a POST server for M.A.V.I.S. \n Please check at https://github.com/TheTrueGravity/mavis-local-clients for more information!")
    res.end()
  }
})

server.listen(port, hostname, null, (err) => {
  console.log(`Server started at http://${hostname}:${port}`)
})