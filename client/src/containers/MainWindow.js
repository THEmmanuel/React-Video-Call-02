import React, { useState } from 'react';
import PropTypes from 'prop-types';
import style from '../styles/MainWindow.module.css'


const MainWindow = ({ clientToken, startCall }) => {
    
    const [FriendToken, setFriendToken] = useState(null);

    const callWithVideo = video => {
        const config = {audio:true, video};
        return () => FriendToken && startCall(true, FriendToken, config);
    };

    return (
        <div className={style.MainWindow}>
            <section className={style.SectionControls}>
                <div className={style.MainControls}>
                    <div className={style.MainControls01}>
                        <span>
                            Good Morning!
                        </span>

                        <span>
                            Your caller ID is <span className={style.CallerID}>{clientToken}</span>.
                        </span>
                        {/* Add copy button here later */}
                        <span className={style.GenerateInstruction}>You can reload this page to generate a new Caller ID.</span>
                    </div>

                    <div className={style.MainControls02}>
                        <span className={style.InstructionText}>
                            Paste your friend's caller ID <br /> below to begin a call
                        </span>

                        <input 
                        type="text" 
                        className={style.IDInput}
                        onChange = {(e) => setFriendToken(e.target.value)} />
                    </div>

                    <div>
                        {/* Calls with video and audio enabled */}
                        <button onClick = {callWithVideo(true)}></button>
                        {/* Calls with only audio enabled */}
                        <button onClick = {callWithVideo(false)}></button>
                    </div>
                </div>
            </section>

            <section className={style.MainBackground}>
            </section>
        </div>
    )
}

MainWindow.propTypes = {
    clientToken: PropTypes.string.isRequired,
    startCall: PropTypes.func.isRequired
}

export default MainWindow;