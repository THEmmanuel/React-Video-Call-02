import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import MainWindow from './containers/MainWindow';
import CallModal from './components/CallModal';
import CallWindow from './containers/CallWindow';

import './styles/App.css'
import socket from '../../utils/socket';
import PeerConnection from '../../utils/PeerConnection';
import _ from 'lodash';

let peerConnection = {};    
let callConfig = null;

function App () {
    const [ClientToken, setClientToken] = useState('');
    const [callWindow, setCallWindow] = useState('')
    const [callModal, setcallModal] = useState('')
    const [CallFrom, setCallFrom] = useState('')
    const [localSrc, setLocalSrc] = useState(null)
    const [peerSrc, setPeerSrc] = useState(null)

    useEffect(() => {
        socket
            .on('init', ({ id: ClientToken }) => {
                document.title = `${ClientToken} - Video Call`;
                setClientToken(ClientToken)
            })
            .on('request', ({ from: CallFrom }) => {
                setcallModal('active')
                setCallFrom(CallFrom)
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

            .on('end', endCallHandler(this, false))
            .emit('init')
    },[])


    const startCallHandler = (isCaller, friendToken, config) => {
        callConfig = config;
        // setConfig(config)
        console.log(config);
        console.log(callConfig);
        // testNum = 10;
        peerConnection = new PeerConnection(friendToken)
            .on('localStream', src => {
                setCallWindow('active')
                console.log('I ran 1');
                setLocalSrc(src)
                if (!isCaller) {
                    setcallModal('')
                }
            })
            .on('peerStream', src => setPeerSrc(src))
            .start(isCaller, config);
            console.log('I ran 2')
    }

    const rejectCallHandler = () => {
        socket.emit('end', { to: CallFrom });
        setcallModal('')
        setCallFrom('')
    }

    const endCallHandler = isStarter => {
        if (_.isFunction(peerConnection.stop)) {
            peerConnection.stop(isStarter);
        }
        peerConnection = {};
        callConfig = null;
        // setConfig(null)
        setCallWindow('');
        setcallModal('');
        setLocalSrc(null);
        setPeerSrc(null);
    }

    console.log(callConfig);
    console.log(!_.isEmpty(callConfig))

    return (
        <div>
            <MainWindow
                clientToken={ClientToken}
                startCall={startCallHandler} />

            {!_.isEmpty(callConfig) && (
                <CallWindow
                    callWindowStatus={callWindow}
                    localSrc={localSrc}
                    peerSrc={peerSrc}
                    config={callConfig}
                    mediaDevice={peerConnection.mediaDevice}
                    endCall={() => endCallHandler()}
                />
            )}

            <CallModal
                status={callModal}
                callFrom={CallFrom}
                startCall={startCallHandler}
                rejectCall={() => rejectCallHandler()}
            />

        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;