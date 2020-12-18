var request = require('request')
var json = {
    "friendly_name": "charlie",
    "hostname": "192.168.0.128"
}

request('http://192.168.0.128:6767', {
    method: 'POST',
    body: JSON.stringify(json)
}, (err, res, body) => {
    console.log(json)
    let data = JSON.parse(body)
    console.log(data)
});