import React from 'react';
import PropTypes from 'prop-types';
import style from '../styles/CallModal.module.css'

const CallModal = ({ status, callFrom, startCall, rejectCall }) => {

    const acceptWithVideo = video => {
        const config = { audio: true, video };
        return () => startCall(false, callFrom, config);
    }

    return (
        <div className={style.CallModal}>
            <div className={style.CallModalButtons}>
                <span className={style.CallText}>
                    Incoming call from {callFrom}
                </span>

                <button className={style.ModalButton} type='button' onClick={acceptWithVideo(true)}></button>
                <button className={style.ModalButton} type='button' onClick={acceptWithVideo(false)}></button>
                <button className={style.RejectCallButton} type='button' onClick={rejectCall}></button>
            </div>
        </div>
    )
}

CallModal.propTypes = {
    status: PropTypes.string.isRequired,
    callFrom: PropTypes.string.isRequired,
    startCall: PropTypes.func.isRequired,
    rejectCall: PropTypes.func.isRequired,
};

export default CallModal;