import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useDrag } from "react-dnd";

const DragWord = props => {
  let fibGame = useSelector(state => state.game.curGame);


  const word = props.word;
  const order = props.order;
  let strike = false;
  let opacity = 1;

  let content = null;



  const [{ isDragging }, drag] = useDrag({
    item: { value: word, order: order, type: "word" },
    //called after word is dropped
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      //check if the item and dropResult exist
      if (item && dropResult) {
        strike = true;
        //call function to check order and word correctness
        fibGame.handleDrop(item.value, dropResult.order, item.order);
      }
    },
    options: {
      dropEffect: 'copy'
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  opacity = isDragging ? 0.4 : 1;


  if (fibGame !== null) {
    //check if word is one of the already dropped ones, and if so then strike it out
    for (let wordObj of fibGame.droppedWords) {
      if (wordObj.word === word) {
        strike = true;
        opacity = 0.5;
      }
    }
  }

  //switch strike based on whether word has been dropped
  const textDecoration = strike ? 'line-through' : 'none';



  if (word !== null) {
    content = (
      <div className="word-wrapper">
        <div ref={drag} style={{ opacity, textDecoration }} className="word-drag">
          {word}
        </div>
      </div>
    );
  }

  return <Fragment>{content}</Fragment>;
};

export default DragWord;
