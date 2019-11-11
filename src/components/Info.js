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
            
            <p className='info-p'>My name is Isaac Sheets and I developed Easy Come, Easy Go as a commentary on the usage of infinite scroll on Twitter. Infinite scroll provides easy access to unlimited content and the user is never forced to take a step back and decide if they want to continue.</p>
            <p className='info-p'>To reverse this concept, Easy Come, Easy Go slows down the interaction for the user and prompts them to actually engage with the content they see. The result is that the user can make a more intentional decision about the content the consume and the time they invest.</p>
            <a className='info-link' href=''>&#x2197; Check out my other work</a>
            <a className='info-link' href=''>&#x2197; Find me on LinkedIn</a>
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