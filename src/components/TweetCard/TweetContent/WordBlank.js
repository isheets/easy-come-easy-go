import React, { Fragment } from "react";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";

const Blank = props => {

  console.log('rendering blank');

  let extractedWord = props.extractedWord;
  let blankOrder = props.blankOrder;
  let game = useSelector(state => state.game.curGame);

  const [{ canDrop, isOver, wordBeingDragged }, drop] = useDrop({
    accept: "word",
    order: blankOrder,
    drop: () => ({ name: extractedWord, order: blankOrder }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      wordBeingDragged: monitor.getItem()
    })
  });

  let content = null;
  let blankFiller = null;
  let width = "40px";

  const isActive = canDrop && isOver;
  let backgroundColor = 'transparent';
  let color = backgroundColor;
  if (isActive) {
    backgroundColor = "transparent";
    color = "black";
    //size all the blanks according to the word being dragged
    blankFiller = wordBeingDragged.value;
    width = 'min-content';
  } else if (canDrop) {
    backgroundColor = "#BF0404";
    color = backgroundColor;
    blankFiller = wordBeingDragged.value;
    width = 'min-content';
  }

  let wordInBlank = null;

  if (game !== null) {
    let droppedWords = game.droppedWords;
    for (let droppedWord of droppedWords) {
      if (droppedWord.droppedIn === blankOrder) {
        wordInBlank = droppedWord;
      }
    }
  }

  //render blank or filled in blank
  if (wordInBlank !== null) {
    content = (
      <span
        ref={drop}
        className="tweet-blank-filled"
        style={{ backgroundColor: "transparent", color: "black" }}
      >
        {wordInBlank.word}
      </span>
    );
  } else {
    content = (
      <span
        ref={drop}
        className="tweet-blank"
        style={{ backgroundColor, color, width }}
      >
        {blankFiller}
      </span>
    );
  }

  return <Fragment>{content}</Fragment>;
};

export default Blank;
