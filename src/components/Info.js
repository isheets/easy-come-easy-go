import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideInfo } from './../actions';

import clickFile from './../sound/click.mp3';
let clickSound = new Audio(clickFile);

const Info = () => {
    let soundState = useSelector(state => state.ui.playSound);
    let dispatch = useDispatch();
    return (
        <Fragment>
            <h2 className='info-title'>About this Site</h2>
            
            <p className='info-p'>My name is Isaac Sheets and I developed Easy Come, Easy Go as a commentary on the usage of infinite scroll on Twitter.</p>
            <p className='info-p'>I wanted to slow down the interaction for the user and prompt them to actually engage with the content they see.</p>

            <button className='small-text info-close-button' onClick={() => {
                if(soundState === true) {
                    clickSound.play();
                }
                dispatch(hideInfo())
                }}>CLOSE</button>
        </Fragment>
    )
}

export default Info;