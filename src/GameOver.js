import React, { useEffect } from "react"

export default function GameOver(props) {
    const {
        setGameState,
        score,
    } = props

    return (
        <main className="main-game-over">
            <h1>Game Over</h1>
            <span className="score-wrapper">Mazes passed: <span>{score}</span></span>

            <div className="bttns-wrapper">
                <button className="bttn bttn-plus" onClick={() => setGameState('game')}>Restart</button>
                <button className="bttn bttn-plus" onClick={() => setGameState('menu')}>Menu</button>
            </div>
        </main>
    )
}