import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import style from '../styles/CallWindow.module.css';

const CallWindow = (
    callWindowStatus,
    localSrc,
    peerSrc,
    config,
    mediaDevice,
    endCall,
    clientToken,
    friendToken) => {
    const peerVideo = useRef(null);
    const localVideo = useRef(null);

    const [video, setVideo] = useState(callWindowStatus.config.video);
    const [audio, setAudio] = useState(callWindowStatus.config.audio);


    useEffect(() => {
        if (peerVideo.current && callWindowStatus.peerSrc) peerVideo.current.srcObject = callWindowStatus.peerSrc;
        if (localVideo.current && callWindowStatus.localSrc) localVideo.current.srcObject = callWindowStatus.localSrc;
    });

    useEffect(() => {
        if (callWindowStatus.mediaDevice) {
            callWindowStatus.mediaDevice.toggle('Video', video);
            callWindowStatus.mediaDevice.toggle('Audio', audio);
        }
    });

    const toggleMediaDevice = deviceType => {
        if (deviceType === 'video') {
            setVideo(!video);
            callWindowStatus.mediaDevice.toggle('Video');
        }

        if (deviceType === 'audio') {
            setAudio(!audio);
            callWindowStatus.mediaDevice.toggle('Audio');
        }
    }

    return (
        <div className={callWindowStatus.callWindowStatus === 'active'
            ? style.CallWindow
            : style.CallWindowInactive}>

            <div className={style.VideoContainers}>

                <div className={style.VideoContainer}>
                    <span
                        className={style.UserTokenDisplay}>
                        {`${callWindowStatus.clientToken} - You`}
                    </span>

                    <video
                        className={style.LocalVideo}
                        ref={localVideo}
                        autoPlay
                        muted>
                    </video>
                </div>

                <div className={style.VideoContainer}>
                    <span className={style.UserTokenDisplay}>
                        {callWindowStatus.friendToken}
                    </span>

                    <video
                        className={style.PeerVideo}
                        ref={peerVideo}
                        autoPlay>
                    </video>
                </div>

            </div>

            <div className={style.CallButtons}>
                <div className={style.ButtonContainer}>
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
    endCall: PropTypes.func.isRequired,
    clientToken: PropTypes.string.isRequired,
    friendToken: PropTypes.string.isRequired
}

export default CallWindow;