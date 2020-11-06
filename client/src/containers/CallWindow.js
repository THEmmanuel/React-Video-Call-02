import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import style from '../styles/CallWindow.module.css';

const CallWindow = (callWindowStatus, localSrc, peerSrc, config, mediaDevice, endCall) => {
    console.log(config);
    console.log(callWindowStatus.config);

    const peerVideo = useRef(null);
    const localVideo = useRef(null);

    const [video, setVideo] = useState(callWindowStatus.config.video);
    const [audio, setAudio] = useState(callWindowStatus.config.audio);

    useEffect(() => {
        if (peerVideo.current && peerSrc) peerVideo.current.srcObject = callWindowStatus.peerSrc;
        if (localVideo.current && localSrc) localVideo.current.srcObject = callWindowStatus.localSrc;
        console.log('useEffect01 ran')
    });

    useEffect(() => {
        if (mediaDevice) {
            mediaDevice.toggle('Video', video);
            mediaDevice.toggle('Audio', audio);
        }
        console.log('useEffect02 ran')
    });

    const toggleMediaDevice = deviceType => {
        if (deviceType === 'video') {
            setVideo(!video);
            mediaDevice.toggle('Video');
        }

        if (deviceType === 'audio') {
            setAudio(!audio);
            mediaDevice.toggle('Audio');
        }
    }

    return (
        <div className={callWindowStatus.callWindowStatus === 'active'
            ? style.CallWindow
            : style.CallWindowInactive}>

            <div className={style.VideoContainer}>
                <video className={style.PeerVideo} ref={peerVideo}></video>
                <video className={style.LocalVideo} ref={localVideo} autoPlay muted></video>
            </div>

            <div>
                <button
                    key='videoButton'
                    type='button'
                    className={style.VideoButton}
                    onClick={() => toggleMediaDevice('video')}
                >
                </button>


                <button
                    key='audioButton'
                    type='button'
                    className={style.AudioButton}
                    onClick={() => toggleMediaDevice('audio')}
                >
                </button>


                <button
                    key='hangupButton'
                    type='button'
                    className={style.HangupButton}
                    onClick={() => callWindowStatus.endCall(true)}
                ></button>

            </div>
        </div>
    )
}

CallWindow.propTypes = {
    callWindowStatus: PropTypes.string.isRequired,
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