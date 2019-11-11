import React from 'react';
import {playSound, muteSound, showInfo} from './../actions';
import {useSelector, useDispatch} from 'react-redux';


import soundImage from './../img/sound.svg';
import muteImage from './../img/no_sound.svg';
import infoImage from './../img/info.svg';

import clickFile from './../sound/click.mp3';
let clickSound = new Audio(clickFile);


const Toolbar = () => {
    let soundState = useSelector(state => state.ui.playSound);

    let dispatch = useDispatch();

    let toggleSound = () => {
        if(soundState === true) {
            dispatch(muteSound());
        }
        else {
            dispatch(playSound());
            clickSound.play();
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
            <img alt="Clickable icon to mute sound" src={soundStateImage} className='sound-image toolbar-image' onClick={() => toggleSound()}></img>
            <img alt="Clickable icon to show information about this application" src={infoImage} className='info-image toolbar-image' onClick={() => {
                    if(soundState === true) {
                        clickSound.play();
                    }
                    dispatch(showInfo())
                }}></img>
        </div>
    );
}

export default Toolbar;