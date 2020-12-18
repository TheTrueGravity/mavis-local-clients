var keygen = require('keygenerator');
var keys = require('./keys.json');
var fs = require('fs');
var os = require('os');
var ifaces = os.networkInterfaces();

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

const pre_json = {
    "server_info": {
        "hostname": hostname,
        "port": port
    }
}

var create_json = function(friendlyname, hostname) {
    var json = {}
    var key = keygen._()
    json.server_info = pre_json.server_info
    json.client_info = {
        "friendly_name": friendlyname,
        "hostname": hostname,
        "key": key
    }
    keys[key] = {
        "friendly_name": friendlyname,
        "hostname": hostname
    }
    fs.writeFileSync('./src/keys.json', JSON.stringify(keys))
    return json
}

module.exports = create_json