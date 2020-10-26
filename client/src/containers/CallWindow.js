import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import style from '../styles/CallWindow.module.css';

const CallWindow = (status, localSrc, peerSrc, config, mediaDevice, endCall) => {
    const peerVideo = useRef(null);
    const localVideo = useRef(null);

    const [video, setVideo] = useState(config.video);
    const [audio, setAudio] = useState(config.audio);

    useEffect(() => {
        if (peerVideo.current && peerSrc) {
            peerVideo.current.srcObject = peerSrc;
        }

        if (localVideo.current && localSrc) {
            localSrc.current.srcObject = localSrc;
        }
    })


    useEffect(() => {
        if (mediaDevice) {
            mediaDevice.toggle('Video', video);
            mediaDevice.toggle('Audio', audio);    
        }
    })

    const toggleMediaDevice = deviceType => {
        if (deviceType === 'video') {
            setVideo(!video);
            mediaDevice.toggle('Video')
        }

        if (deviceType === 'audio') {
            setAudio(!audio);
            mediaDevice.toggle('Audio')
        }
    }

    return (
        <div className={style.CallWindow}>
            <video className={style.PeerVideo}></video>
            <video className={style.LocalVideo}></video>
            <div>
                <button
                    key='videoButton'
                    type='button'
                    className={style.VideoButton}
                    onclick={() => toggleMediaDevice('video')}
                >
                </button>


                <button
                    key='audioButton'
                    type='button'
                    className={style.AudioButton}
                    onclick={() => toggleMediaDevice('audio')}
                >
                </button>


                <button
                    key='hangupButton'
                    type='button'
                    className={style.HangupButton}
                    onclick={() => endCall(true)}
                ></button>

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