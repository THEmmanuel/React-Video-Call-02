import MediaDevice from './MediaDevice';
import Emitter from './Emitter';
import socket from './socket';

const PC_CONFIG = {
    ICEServers: [{
        urls: [
            'stun:stun.l.google.com:19302'
        ]
    }]
};

class PeerConnection extends Emitter {
    constructor(friendToken) {
        super();
        this.rtcPeerConnection = new RTCPeerConnection(PC_CONFIG);
        this.rtcPeerConnection.onicecandidate = event => socket.emit(
            'call', {
                to: this.friendToken,
                candidate: event.candidate
            }
        );

        this.rtcPeerConnection.ontrack = event => this.emit('peerStream', event.streams[0]);
        this.mediaDevice = new MediaDevice();
        this.friendToken = friendToken;
    };

    start(isCaller, config) {
        this.mediaDevice
            .on('stream', stream => {
                stream.getTracks().forEach(track => {
                    this.rtcPeerConnection.addTrack(track, stream);
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
            .start(config)
    }

    stop(isStarter) {
        if (isStarter) {
            socket.emit('end', {
                to: this.friendToken
            });
        }
        this.mediaDevice.stop();
        this.rtcPeerConnection.close();
        this.rtcPeerConnection = null;
        this.off();
        return this;
    }


    createOffer() {
        this.rtcPeerConnection.createOffer()
            .then(this.getDescription.bind(this))
            .catch(err => console.log(err));
        return this;
    }

    createAnswer() {
        this.pc.createAnswer()
            .then(this.getDescription.bind(this))
            .catch(err => console.log(err));
        return this;
    }

    getDescription(desc) {
        this.rtcPeerConnection.setLocalDescription(desc);
        socket.emit('call', {
            to: this.friendToken,
            SDP: desc
        });
        return this;
    }

    setRemoteDescription(SDP) {
        const rtcSDP = new RTCSessionDescription(SDP);
        this.rtcPeerConnection.setRemoteDescription(rtcSDP);
        return this;
    }

    addIceCandidate(candidate) {
        if (candidate) {
            const ICECandidate = new RTCIceCandidate(candidate);
            this.rtcPeerConnection(ICECandidate);
        }
        return this;
    }
}


export default PeerConnection