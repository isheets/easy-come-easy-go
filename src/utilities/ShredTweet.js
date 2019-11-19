import html2canvas from 'html2canvas';
import shredFile from './../sound/shred.mp3';
import store from './../index';

let shredSound = new Audio(shredFile);

const shredTweet = async () => {

    var divToSnap = document.getElementsByClassName('tweet')[0];
    var pieces = [];
    var holder;
    html2canvas(divToSnap, {
        backgroundColor: null
    }).then(function async (canvas) {

        let pieceWidth = canvas.width / 10;
        var pieceHeight = canvas.height;

        
        for (let i = 0; i < 10; i++) {
            let piece = document.createElement("canvas");
            piece.classList.add('shred-piece');
            piece.width = pieceWidth;
            piece.height = pieceHeight;

            let pieceCtx = piece.getContext('2d');

            pieceCtx.drawImage(canvas, pieceWidth * (i), 0, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

            pieces.push(piece);
        }

        holder = document.createElement("div");
        holder.classList.add('holder');
        holder.appendChild(canvas);

        canvas.classList.add('full');

        document.getElementsByClassName('main-flex')[0].style.overflowY = 'visible';

        document.getElementsByClassName('tweet-content-wrapper')[0].style.display = "none";
        divToSnap.appendChild(holder);

        for (let piece of pieces) {
            divToSnap.appendChild(piece);
        }

        //play shred sound
        if (store.getState().ui.playSound === true) {
			shredSound.play();
		}

        var curTop = 0;
        var curWidth = 10;
        var opacity = 1;

        var animationInterval = setInterval(async () => {
            curTop = curTop + 10;
            curWidth = curWidth - 0.05;
            opacity = opacity - .03;
            
            for (let piece of pieces) {
                piece.style.transform = "translate(" + (Math.random() * (4) - 2) + "px," + curTop + "%)";
                piece.style.width = curWidth + "%";
                piece.style.opacity = opacity;
            }
            canvas.style.transform = "translateY(" + curTop + "%)";

            if (curTop >= 110) {
                clearInterval(animationInterval);
                
                for (let piece of pieces) {
                    piece.style.opacity = 0;
                }

            }
        }, 200);
    });

    //cleanup after animation
    setTimeout(() => {
        //remove the piece canvasses
        for(let piece of pieces) {
            divToSnap.removeChild(piece)
        }

        //stop and reset the sound
        shredSound.pause();
        shredSound.currentTime = 0;

        //reset overflowY for main flex
        document.getElementsByClassName('main-flex')[0].style.overflowY = 'hidden';
        document.getElementsByClassName('tweet-content-wrapper')[0].style.display = "block";
        //remove the "full" image canvas
        divToSnap.removeChild(holder)
    }, 2700)

    return new Promise(resolve => setTimeout(resolve, 2700));

}


export default shredTweet;