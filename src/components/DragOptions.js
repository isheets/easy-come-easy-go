import React from 'react'
import { useSelector } from "react-redux";
import DragWord from './DragWord';
import DragAuthor from './DragAuthor';

const DragOptions = () => {
    let game = useSelector(state => state.game.curGame);

    

    let className = 'drag-options-container double';

    let content = null;
    if (game !== null) {
        if (game.type === 'FillBlank') {
            if (game.wordOptions.length > 0) {
            
                content =
                    game.wordOptions.map((word, key) =>
                        <DragWord word={word.word} order={word.order} key={key} />
                    );
            }
        }

        else if (game.type === "GuessAuthor") {
            if (game.friendOptions.length > 0) {
                className = 'drag-options-container'
                content = game.friendOptions.map((user, key) => 
                    <DragAuthor key={key} name={user.name} url={user.pic} handle={user.handle} correct={user.correct} />
                );
                
            }
        }
        else {
            console.error("Game type not recognized in DragOptions")
        }
    }

    return (
        <div className={className}>
            {content}
        </div>
    )
}
export default DragOptions