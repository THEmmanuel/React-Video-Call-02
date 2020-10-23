import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import style from '../styles/CallWindow.module.css';

const CallWindow = () => {
    
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