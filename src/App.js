import React, { useState, useEffect } from "react"

import Table from "./Table"
import Menu from "./Menu"
import GameOver from "./GameOver"

export default function App() {
    const [tableSize, setTableSize] = useState(21)
    const [gameState, setGameState] = useState("menu")
    const [score, setScore] = useState(0)
    const [formData, setFormData] = useState(
        {
            difficult: "medium",
            zen: false,
        })

    const actualComponent = () => {
        if (gameState === 'menu') {
            return (
                <Menu 
                    gameState={gameState}
                    setGameState={setGameState}
                    tableSize={tableSize}
                    setTableSize={setTableSize}
                    formData={formData}
                    setFormData={setFormData}
                />
            )
        } else if (gameState === 'game') {
            return (
                <Table
                    tableSize={tableSize}
                    gameState={gameState}
                    setGameState={setGameState}
                    score={score}
                    setScore={setScore}
                    isZen={formData.zen}
                />
            )
        } else if (gameState === 'gameover') {
            return (
                <GameOver 
                    score={score}
                    setGameState={setGameState}
                />
            )
        } return <>Error!</>
    }
    return (
        <>
            {actualComponent()}
        </>
       
    )
}