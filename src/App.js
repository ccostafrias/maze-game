import React, { useState, useEffect } from "react"

import Table from "./Table"

export default function App() {
    const tableSize = 17
    
    const [maze, setMaze] = useState(restartMaze())
    function restartMaze() {
        return (
                Array.from(Array(tableSize**2)).map((c, i) => {
                    let type
                    const x = i % tableSize
                    const y = Math.floor(i / tableSize)
                    if (x === 0 || y === 0 || x === tableSize-1 || y === tableSize-1) type = 'border'
                    else if (x === 1 && y === 1) type = 'in'
                    else if ((x === 3 && y === 1) || (x === 1 && y === 3)) type = 'frontier'
                    else if (x % 2 !== 0 && y % 2 !== 0) type = 'path'
                    else type = 'wall'
                    return {
                        type,
                        x,
                        y
                    }
                })
                )
    }
    const [gameState, setGameState] = useState("start")

    return (
        <>
            <main>
                <Table
                    tableSize={tableSize}
                    maze={maze}
                    setMaze={setMaze}
                    gameState={gameState}
                    setGameState={setGameState}
                    restartMaze={restartMaze}
                />
            </main>
        </>
       
    )
}