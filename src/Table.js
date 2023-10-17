import React, { useState, useEffect } from "react"

export default function Table(props) {
    const { 
        tableSize, 
        gameState,
        setGameState,
    } = props

    const [maze, setMaze] = useState(restartMaze())
    function restartMaze() {
        return (
                Array.from(Array(tableSize**2)).map((_, i) => {
                    let type
                    const x = i % tableSize
                    const y = Math.floor(i / tableSize)
                    if (x === 1 && y === 0) type = 'start'
                    else if (x === tableSize-2 && y === tableSize-1) type = 'end'
                    else if (x === 0 || y === 0 || x === tableSize-1 || y === tableSize-1) type = 'border'
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
    const [count, setCount] = useState(0)

    function randomFrontier() {
        const frontiers = maze.filter(m => m.type === 'frontier')
        return frontiers[random(frontiers.length)]
    }

    function randomPath(f) {
        let paths = []
        for (let r = -2; r <= 2; r = r + 2) {
            for (let c = -2; c <= 2; c = c + 2) {
                if ((f.y + c <= 0 || f.x + r <= 0) || (f.y + c >= tableSize-1 || f.x + r >= tableSize-1 )) continue
                if (Math.abs(c+r) !== 2) continue
                const choosen = maze.find(m => (m.x === f.x + r) && (m.y === f.y + c))

                if (choosen.type !== 'in') continue
                paths.push(choosen)
            }
        }
        

        return paths[random(paths.length)]
    }

    function removeWall(p, f) {
        const toRemove = maze.map(m => {
            if (m.x === (p.x + f.x)/2 && m.y === (p.y + f.y)/2) return {...m, type: 'in'}
            else if (m.x === f.x && m.y === f.y) return {...m, type: 'in', actual: true}
        }).filter(m => m)

        return toRemove
    }

    function addFrontiers(f) {
        const ortFront = []
        for (let r = -2; r <= 2; r = r + 2) {
            for (let c = -2; c <= 2; c = c + 2) {
                if ((f.y + c <= 0 || f.x + r <= 0) || (f.y + c >= tableSize-1 || f.x + r >= tableSize-1 )) continue
                if (Math.abs(c+r) !== 2) continue
                
                const choosen = maze.find(m => (m.x === f.x + r) && (m.y === f.y + c))

                if (choosen.type === 'in') continue
                ortFront.push(choosen)
            }
        }

        return ortFront.map(o => ({...o, type: 'frontier'}))
    }

    function buildMaze() {
        const countFrountier = maze.filter(m => m.type === 'frontier').length
        if (countFrountier <= 0) {
            setGameState('finish')
            setMaze(prevMaze => prevMaze.map(m => ({...m, actual: false})))
            return
        }

        const frontier = randomFrontier()
        const path = randomPath(frontier)
        const [wall, actual] = removeWall(path, frontier)
        const newFrontiers = addFrontiers(frontier)

        const toChange = [...newFrontiers, wall, actual]


        setMaze(prevMaze => {
            return prevMaze.map(m => {
                const isChange = toChange.find(c => c.x === m.x && c.y === m.y)
                if (!isChange) return {...m, actual: false}
                
                const {type, actual} = isChange
                return {...m, type, actual}
            })
        })

        setCount(prevCount => prevCount + 1)
    }

    function restartGame() {
        setCount(Math.random(1))
        setMaze(restartMaze())
    }

    const random = size => Math.floor(Math.random() * size)

    useEffect(() => {
        buildMaze()
    }, [count])

    const tableCells = maze.map((cell, i) => {
        const style = cell.actual ? {backgroundColor: "red"} : null
        return (
            <div className={cell.type} style={style}>
            </div>
        ) 
    })
    

    return (
        <main className="main-game">
            <div className="table" style={{
                gridTemplateColumns: `repeat(${tableSize}, 1fr)`
            }}>
                {tableCells}
            </div>
            <button className="bttn bttn-plus" onClick={() => restartGame()}>Restart</button>
        </main>
    )
}