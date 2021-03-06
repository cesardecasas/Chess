import React, { useState, useEffect } from "react";
import "./App.css";
import Timer from "react-compound-timer";
// Lines 5-8: Bring in chessboard and chess.js stuff
import Chessboard from "chessboardjsx";
import { ChessInstance, ShortMove } from "chess.js";
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';


const Chess = require("chess.js");

const paddingStyle = {
  padding: 5
}

const marginStyle = {
  margin: 5, 
}

const whiteSquareGrey = '#a9a9a9'
const blackSquareGrey = '#696969'

const App: React.FC = () => {
  const [chess] = useState<ChessInstance>(
    // Set initial state to FEN layout
    new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [fen, setFen] = useState(chess.fen());
  const [squareS, setSquareS] = useState({})
  const [history, setHistory] = useState([])
  const [pieceSquare, setPieceS] = useState('')

  // Logic for the setting up the random computer move.
  const handleMove = (move: ShortMove) => {
    // next line validates the user move.
    if (chess.move(move)) {
      setTimeout(() => {
        const moves = chess.moves();
        // Lines 33-28: Computer random move.
        if (moves.length > 0) {
          const computerMove = moves[Math.floor(Math.random() * moves.length)];
          chess.move(computerMove);
          setFen(chess.fen());
        }
      }, 300);
      // Sets state of chess board
      setFen(chess.fen());
    }
  };

  const onMouseOver = (square : string) => {

    let moves = chess.moves({
      square: square,
      verbose: true
    })

    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (let i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    } 
  }




  

  useEffect(()=>{
    

  },[])

  return (
    <div className="flex-center" style={{display:'flex', justifyContent:"center", backgroundColor:'lightblue'}}>

      <main>
        <p style={{marginTop:'15%'}}></p>
      {chess.game_over() ? <h1>Game Over</h1> : <h1>Chess Game</h1>}

      <Chessboard
        width={400}
        position={fen}
        // onDrop prop tracks everytime a piece is moved.
        // The rest is handled in the the handleMove function.
        onDrop={(move) =>
          handleMove({
            from: move.sourceSquare,
            to: move.targetSquare,
            // This promotion attribute changes pawns to a queen if they reach the other side of the board.
            promotion: "q", 
          })
        }
      />
      {/* Timer code */}
      <Timer initialTime={0} startImmediately={false}>
        {/* I thought this was weird. Definitely a better way to do this, but I just wanted it to work. */}
        {({ start, resume, pause, stop, reset, timerState } : {start:any, resume:any, pause:any, stop:any, reset:any, timerState:any}) => (
            <>
                <div>
                    <span style={paddingStyle}><Timer.Minutes /> minutes</span>
                    <span style={paddingStyle}><Timer.Seconds /> seconds</span>
                </div>
                <br />
                <div>
                    <Button variant='dark' style={marginStyle} onClick={start}>Start</Button>
                    <Button variant='dark' style={marginStyle} onClick={pause}>Pause</Button>
                    <Button variant='dark' style={marginStyle} onClick={reset}>Reset Timer</Button>

                </div>
            </>
        )}
      </Timer>
      <Button variant='dark' style={marginStyle} onClick={()=>{
        chess.reset()
        chess.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
        setFen(chess.fen())
      }}>Reset Game</Button>
      <Button variant='dark' style={marginStyle} onClick={()=>{
        chess.undo()
        setFen(chess.fen())
      }} >Rewind</Button>
      </main>
      
    </div>
  );
};

export default App;
