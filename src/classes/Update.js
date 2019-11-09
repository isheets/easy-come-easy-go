import React, { Fragment } from "react";
import { useDispatch } from "react-redux";

import { updateCurGame } from "./../actions";



const Update = (props) => {

    let game = props.game;

    let dispatch = useDispatch();
    dispatch(updateCurGame(game));



    //return <div className={`tweet-media-${numMedia}`}>{content}</div>;
    return <Fragment>{null}</Fragment>;
};

export default Update;
