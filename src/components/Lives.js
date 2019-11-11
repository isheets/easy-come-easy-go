import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { strikeOut } from './../actions';


const Lives = () => {
    const curGame = useSelector(state => state.game.curGame);
    const anim = useSelector(state => state.ui.strikeBounce);

    let dispatch = useDispatch();

    let content = [];


    if (curGame !== null) {
        content.push(<h2 className="lives" key={100}>Strikes:</h2>);

        let strikes = 3 - curGame.lives;
        let numIcons = 0;
        for (let i = 0; i < strikes; i++) {
            content.push(
                <CSSTransition
                in={anim}
                classNames='strike'
                timeout={400}
                onEntered={() => dispatch(strikeOut())}
                appear={true}
            >
                <h2 className='strike' key={numIcons}>&#x2715;</h2>
                </CSSTransition>
            );
            numIcons++;
        }

        for (let i = numIcons; i < 3; i++) {
            content.push(<h2 className='strike-left' key={i}>&#x2715;</h2>);
        }
    }
    else {
        content = null;
    }

    return (

            <div className="lives-wrapper">
                {content}
            </div>

    );
}
export default Lives