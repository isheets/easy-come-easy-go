import React from 'react';
import {playSound, muteSound, showInfo, hideInfo} from './../actions';
import {useSelector, useDispatch} from 'react-redux';


import soundImage from './../img/sound.svg';
import muteImage from './../img/no_sound.svg';
import infoImage from './../img/info.svg';



const Toolbar = () => {
    let soundState = useSelector(state => state.ui.playSound);

    let dispatch = useDispatch();

    let toggleSound = () => {
        if(soundState === true) {
            dispatch(muteSound());
        }
        else {
            dispatch(playSound());
        }
    }

    let soundStateImage;
    if(soundState === true) {
        soundStateImage = soundImage;
    }
    else {
        soundStateImage = muteImage;
    }

    return (
        <div className='bottom-toolbar'>
            <img src={soundStateImage} className='sound-image toolbar-image' onClick={() => toggleSound()}></img>
            <img src={infoImage} className='info-image toolbar-image' onClick={() => dispatch(showInfo())}></img>
        </div>
    );
}

export default Toolbar;