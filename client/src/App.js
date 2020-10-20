import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom'
import MainWindow from './containers/MainWindow';
import './styles/App.css'
import socket from '../../utils/socket';
import PeerConnection from '../../utils/PeerConnection';
import _ from 'lodash';


const App = () => {
    const [ClientToken, setClientToken] = useState('');
    const [CallWindow, setCallWindow] = useState('')
    const [CallModal, setCallModal] = useState('')
    const [CallFrom, setCallFrom] = useState('')
    const [localSrc, setLocalSrc] = useState(null)
    const [peerSrc, setPeerSrc] = useState(null)

    let peerConnection = {};
    let Config = null;

    useEffect(() => {
        socket
            .on('init', ({ token: ClientToken }) => {
                document.title = `${ClientToken} - Video Call`;
                setClientToken({ ClientToken })
            })
            .on('request', ({ from: CallFrom }) => {
                setCallModal({ CallModal: 'active', CallFrom })
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
                    setCallModal('')
                }
            })
            .on('peerStream', src => setPeerSrc(src))
            .start(isCaller, config);
    }

    const rejectCallHandler = () => {
        socket.emit('end', { to: CallFrom });
        setCallModal('')
    }

    const endCallHandler = isStarter => {
        if (_.isFunction(peerConnection.stop)) {
            peerConnection.stop(isStarter);
        }

        peerConnection = {};
        Config = null;
        setCallWindow('');
        setCallModal('');
        setLocalSrc(null);
        setPeerSrc(null);
    }


    return (
        <MainWindow clientToken startCallHandler/>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;