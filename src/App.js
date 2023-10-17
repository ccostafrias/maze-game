import React, { useState, useEffect } from "react"

import Table from "./Table"
import Menu from "./Menu"

export default function App() {
    const [tableSize, setTableSize] = useState(21)
    const [gameState, setGameState] = useState("menu")

    return (
        <>
            {gameState === 'menu' ? (
                <Menu 
                    gameState={gameState}
                    setGameState={setGameState}
                    tableSize={tableSize}
                    setTableSize={setTableSize}
                />
            ) : (
                <Table
                    tableSize={tableSize}
                    gameState={gameState}
                    setGameState={setGameState}
                />
            )}
        </>
       
    )
}