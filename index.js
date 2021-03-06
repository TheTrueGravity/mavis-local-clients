const collections = require('./src/collections');
var make_key = require('./src/make-key')
const keys = require('./src/keys.json');
var users = []
for (var user in keys) {
    users[users.length] = user
}

module.exports = {
    communication_server: function (port=6767, data_callback = () => {}) {
        this.packets = new collections();
        this.packets.set('test_packet', {packet: 'Test packet recieved!'});
        this.packets.set('get_users', {packet: 'Get users packet recieved!', data: users});

        this.com_ser = require('./src/communication-server')((data) => {
            console.log(`Packet recieved! ${data.packet}`)
            if (data_callback) {
                return data_callback(packet)
            }
            for (var packet in this.packets.array_value_names) {
                if (data.packet == packet) {
                    return (this.packets.get(packet))
                }
            }
            return ({
                error: "Unknown packet!"
            })
        }, port)
    },
    make_key: make_key
}