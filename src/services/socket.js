import socketio from 'socket.io-client';

const socket = socketio('https://nearestdevs-api.herokuapp.com/', {
  autoConnect: false
});

export default class SocketService {

  connect(latitude, longitude, techs) {
    socket.io.opts.query = {
      latitude,
      longitude,
      techs,
    };

    socket.connect();

    socket.on('message', text => {
      console.log(text);
    });
  }

  disconnect() {
    if (socket.connected) {
      socket.disconnect();
    }
  }

  subscribeToNewDevs(subscribeFunction) {
    socket.on('new-dev', subscribeFunction);
  }

}
