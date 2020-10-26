import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import style from '../styles/CallWindow.module.css';

const CallWindow = (status, localSrc, peerSrc, config, mediaDevice, endCall) => {
    const peerVideo = useRef(null);
    const localVideo = useRef(null);    

    const [video, setvideo] = useState(config.video);
    const [audio, setaudio] = useState(config.audio);
    return(
        <div className = {style.CallWindow}>
            <video className = {style.PeerVideo}></video>
            <video className = {style.LocalVideo}></video>
            <div>
                <button></button>
                <button></button>
                <button></button>
            </div>
        </div>
    )
}

CallWindow.propTypes = {
    status: PropTypes.string.isRequired,
    localSrc: PropTypes.object,
    peerSrc: PropTypes.object,
    config: PropTypes.shape({
        audio: PropTypes.bool.isRequired,
        video: PropTypes.bool.isRequired
    }).isRequired,
    mediaDevice: PropTypes.object,
    endCall: PropTypes.func.isRequired
}

export default CallWindow;