import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const totalGridSize = 20;

  const initialSnakePosition = [
    { x: totalGridSize / 2, y: totalGridSize / 2 },
    { x: totalGridSize / 2 + 1, y: totalGridSize / 2 },
  ];

  const [food, setFood] = useState({ x: 5, y: 5 });
  const [snake, setSnake] = useState(initialSnakePosition);
  const [direction, setDirection] = useState("UP");
  const [score, setScore] = useState(0);
  const [milliseconds, setMilliseconds] = useState(450);

  const renderBoard = () => {
    const cellArray = [];

    for (let row = 0; row < totalGridSize; row++) {
      for (let column = 0; column < totalGridSize; column++) {
        let className = 'cell';

        let isFood = food.x === row && food.y === column;

        let isSnake = snake.some(ele => ele.x === row && ele.y === column);

        let isSnakeHead = snake[0].x === row && snake[0].y === column

        if (isFood) {
          className = className + ' food';
        }

        if (isSnake) {
          className = className + ' snake';
        }

        if (isSnakeHead) {
          className = className + ' snakeHead';
        }

        const cell = <div className={className} key={`${row}-${column}`}></div>;
        cellArray.push(cell);
      }
    }
    return cellArray;
  };

  const gameOver = () => {
    
    const modal = document.getElementById('modal')
    modal!.style.display = 'block';
    return;
  }

  const restartGame = () => {
    const modal = document.getElementById('modal')
    modal!.style.display = 'none';
    setSnake(initialSnakePosition);
    setScore(0);
    setMilliseconds(450);
  }

  const updateGame = () => {
    if (snake[0].x < 0 || snake[0].x > 20 || snake[0].y < 0 || snake[0].y > 20) {
      gameOver();
      return;
    }

    const newSnake = [...snake];

    switch (direction) {
      case "LEFT":
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y - 1 });
        break;
      case "RIGHT":
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y + 1 });
        break;
      case "UP":
        newSnake.unshift({ x: newSnake[0].x - 1, y: newSnake[0].y});
      break;
      case "DOWN":
        newSnake.unshift({ x: newSnake[0].x + 1, y: newSnake[0].y});
        break;
    }
    

    const ateFood = newSnake[0].x === food.x && newSnake[0].y === food.y
    if (ateFood) {
      setScore(prev => prev + 1);
      setMilliseconds(prev => prev - 10);
      renderFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  const ateSelf = snake.slice(1).some(ele => ele.x === snake[0].x && ele.y === snake[0].y);
  
  if (ateSelf) {
    gameOver();
  }

  const updateDirection = (e) => {
    const code = e.code;

    switch (code) {
      case "ArrowUp":
        if(direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
        if(direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
        if(direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
        if(direction !== "LEFT") setDirection("RIGHT");
        break;
    }
  }

  const renderFood = () => {
    const xPosition:number = Math.floor(Math.random() * totalGridSize);
    const yPosition:number = Math.floor(Math.random() * totalGridSize);
    setFood({x: xPosition, y: yPosition})
  }

  

  useEffect(() => {
    const interval = setInterval(updateGame, milliseconds);
    return () => clearInterval(interval, updateGame);
  })

  useEffect(() => {
    document.addEventListener('keydown', updateDirection);
    return () => clearInterval("keydown", updateDirection);
  })

  return (
    <main className="container">
      <div className="score">
        SCORE: <span>{score}</span>
      </div>
      <div className="board">{renderBoard()}</div>
      <div id='modal'>
        <h1 className='gameOver'>GAME OVER</h1>
        <button onClick={restartGame} id='button'>TRY AGAIN?</button>
      </div>
    </main>
  );
}

export default App;
