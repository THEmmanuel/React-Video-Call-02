import MediaDevice from './MediaDevice';
import Emitter from './Emitter';
import socket from './socket';

const PC_CONFIG = {
    ICEServers: [{
        urls: ['stun:stun.l.google.com:19302']
    }]
}

class PeerConnection extends Emitter {
    constructor(friendToken) {
        super();
        this.peerConnection = new RTCPeerConnection(PC_CONFIG);
        this.peerConnection.onicecandidate = event => socket.emit('call', {
            to: this.friendToken,
            candidate: event.candidate
        });
        this.peerConnection.ontrack = event => this.emit('peerStream', event.streams[0]);
        this.mediaDevice = new MediaDevice();
        this.friendToken = friendToken;
    }

    start(isCaller, config) {
        this.mediaDevice
            .on('stream', stream => {
                stream.getTracks().forEach(track => {
                    this.peerConnection.addTrack(track, stream);
                });
                this.emit('localStream', stream);
                if (isCaller) {
                    socket.emit('request', {
                        to: this.friendToken
                    });
                } else {
                    this.createOffer();
                }
            })
            .start(config);
        return this;
    }

    stop(isStarter) {
        if (isStarter) {
            socket.emit('end', {
                to: this.friendToken
            });
        }

        this.mediaDevice.stop();
        this.peerConnection.close();
        this.peerConnection = null;
        this.off();
        return this;
    }

    createOffer() {
        this.peerConnection.createOffer()
            .then(this.getDescription.bind(this))
            .catch(err => console.log(err));
        return this;
    }

    createAnswer() {
        this.peerConnection.createAnswer()
            .then(this.getDescription.bind(this))
            .catch(err => console.log(err));
        return this;
    }

    getDescription(description) {
        this.peerConnection.setLocalDescription(description);
        socket.emit('call', {to: this.friendToken, SDP: description});
        return this;
    }


    setRemoteDescription(SDP) {
        const rtcSDP = new RTCSessionDescription(SDP);
        this.peerConnection.setRemoteDescription(rtcSDP);
        return this;
    }

    addICECandidate(candidate) {
        if (candidate) {
            const iceCandidate = new RTCIceCandidate(candidate);
            this.peerConnection.addIceCandidate(iceCandidate);
        }

        return this;
    }
}

export default PeerConnection;