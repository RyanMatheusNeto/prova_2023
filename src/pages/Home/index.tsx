import React, { useState } from 'react';
import { Board, BoardState } from '../../components/Board'

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null) as BoardState]);
  const [currentMove, setCurrentMove] = useState(0);
  const isXTurn = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [player1, setPlayer1] = useState('Jogador 1');
  const [player2, setPlayer2] = useState('Jogador 2');

  const handleClick = (nextSquares: BoardState) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  };

  const jumpTo = (nextMove: number) => {
    setCurrentMove(nextMove);
  };

  const moves = history.map((squares: BoardState, moveIndex: number) => {
    let description: string;

    if(moveIndex === 0){
      description = `Voltar para o início do jogo`
    } else if (moveIndex === currentMove) {
      description = `Você está na jogada ${moveIndex}`
    } else {
      description = `Voltar para a jogada ${moveIndex}`;
    }

    return (
      <button
        key={moveIndex}
        onClick={() => jumpTo(moveIndex)}
        disabled={moveIndex === currentMove}
      >
        {description}
      </button>
    );
  }).reverse();

  return (
    <div className="game">
      <div className="game-board">
        <h1>Jogo da Velha</h1>
        <Board isXTurn={isXTurn} squares={currentSquares} onPlay={handleClick}/>
      </div>
      <div className="game-info">
        <h1>Histórico de Jogadas</h1>
        {moves}
      </div>
      <div className="dados">
        <div className="input">
          <input className="nome" type="text" id="jogador1" name="pessoaA" value={player1}
            onChange={(e) => setPlayer1(e.target.value)} required spellCheck="false" autoComplete="off" />
          <label htmlFor="jogador1">Jogador 1</label>
        </div>
        <div className="estatisticas" id="vitoriasA">
          Vitórias: {isXTurn ? 1 : 0}
        </div>
      </div>
      <div className="dados">
        <div className="input">
          <input className="nome" type="text" id="jogador2" name="pessoaB" value={player2}
            onChange={(e) => setPlayer2(e.target.value)} required spellCheck="false" autoComplete="off" />
          <label htmlFor="jogador2">Jogador 2</label>
        </div>
        <div className="estatisticas" id="vitoriasB">
          Vitórias: {!isXTurn ? 1 : 0}
        </div>
      </div>
    </div>
  )
}

export default Game;
