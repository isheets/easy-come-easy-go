import React, { Fragment } from "react";
import {useSelector} from 'react-redux';


const Lives = () => {
    const curGame = useSelector(state => state.game.curGame);

    let content = [];


    if(curGame !== null) {
        content.push(<h2 className="lives" key={100}>Strikes:</h2>);
        
        let strikes = 3 - curGame.lives;
        let numIcons = 0;
        for(let i = 0; i < strikes; i++) {
            content.push(<h2 className='strike' key={numIcons}>&#x2715;</h2>);
            numIcons++;
        }

        for(let i = numIcons; i < 3; i++) {
            content.push(<h2 className='strike-left' key={i}>&#x2715;</h2>);
        }
    }
    else {
        content = null;
    }

    return <div className="lives-wrapper">{content}</div>;
}
export default Lives