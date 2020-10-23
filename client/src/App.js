import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import MainWindow from './containers/MainWindow';
import CallModal from './components/CallModal';
import './styles/App.css'
import socket from '../../utils/socket';
import PeerConnection from '../../utils/PeerConnection';
import _ from 'lodash';


const App = () => {
    const [ClientToken, setClientToken] = useState('');
    const [CallWindow, setCallWindow] = useState('')
    const [callModal, setcallModal] = useState('')
    const [CallFrom, setCallFrom] = useState('')
    const [localSrc, setLocalSrc] = useState(null)
    const [peerSrc, setPeerSrc] = useState(null)

    let peerConnection = {};
    let Config = null;

    useEffect(() => {
        socket
            .on('init', ({ id: ClientToken }) => {
                document.title = `${ClientToken} - Video Call`;
                setClientToken(ClientToken)
            })
            .on('request', ({ from: CallFrom }) => {
                setcallModal({ CallModal: 'active', CallFrom })
            })
            .on('call', data => {
                if (data.SDP) {
                    peerConnection.setRemoteDescription(data.SDP);
                    if (data.SDP.type === 'offer') {
                        peerConnection.createAnswer();
                    }
                }
                else {
                    peerConnection.addIceCandidate(data.candidate);
                }
            })

            .on('end', endCallHandler.bind(this, false))
            .emit('init')
    }, [])


    const startCallHandler = (isCaller, friendToken, config) => {
        config = Config;
        peerConnection = new PeerConnection(friendToken)
            .on('localStream', src => {
                if (!isCaller) {
                    setcallModal('')
                }
            })
            .on('peerStream', src => setPeerSrc(src))
            .start(isCaller, config);
    }

    const rejectCallHandler = () => {
        socket.emit('end', { to: CallFrom });
        setcallModal('')
    }

    const endCallHandler = isStarter => {
        if (_.isFunction(peerConnection.stop)) {
            peerConnection.stop(isStarter);
        }

        peerConnection = {};
        Config = null;
        setCallWindow('');
        setcallModal('');
        setLocalSrc(null);
        setPeerSrc(null);
    }


    return (
        <div>
            <MainWindow
                clientToken={ClientToken}
                startCall={startCallHandler} />

            <CallModal
                status = {callModal}
                callFrom = {CallFrom}
                startCall = {startCallHandler}
                rejectCall = {rejectCallHandler}
            />

        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;