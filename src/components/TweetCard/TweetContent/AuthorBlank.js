import React, { Fragment } from "react";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";

const AuthorBlank = () => {
    console.log('rendering blank');
    const [{ canDrop, isOver, authorBeingDragged }, drop] = useDrop({
        accept: "author",
        hover: (item, monitor) => {
            console.log(monitor);
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            authorBeingDragged: monitor.getItem()
        })
    });

    const isActive = canDrop && isOver;
    let backgroundColor = "transparent";
    let color = 'black';
    let width = '150px';

    let blankName = null;
    let blankHandle = null;

    if (isActive) {
      backgroundColor = "transparent";
      color = 'black';
      blankName = authorBeingDragged.author.name;
      blankHandle = "@" + authorBeingDragged.author.handle;
      width = 'min-content';
    } else if (canDrop) {
      backgroundColor = "#BF0404";
      color = backgroundColor;
      blankName = authorBeingDragged.author.name;
      blankHandle = "@" + authorBeingDragged.author.handle;
      width = 'min-content';
    }

    return  (
        <div ref={drop} className="author-blank" >
            <h3>&#8213;</h3><h3 className={"author-blank-empty"} style={{backgroundColor, color, width}}> {blankName} <span className={"tweet-info-details"}> {blankHandle}</span></h3>
        </div>
    )
}

export default AuthorBlank;