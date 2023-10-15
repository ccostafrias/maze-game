import React, { useState, useEffect } from "react"

export default function Table(props) {
    const { 
        maze,
        setMaze,
        tableSize, 
        gameState,
        setGameState,
        restartMaze,
    } = props

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
        setMaze(prevMaze => {
            return prevMaze.map(m => {
                if (m.x === (p.x + f.x)/2 && m.y === (p.y + f.y)/2) return {...m, type: 'in'}
                else if (m.x === f.x && m.y === f.y) return {...m, type: 'in', actual: true}
                return {...m, actual: false}
            })
        })
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

        setMaze(prevMaze => {
            return prevMaze.map((m, i) => {
                const isOrt = ortFront.find(o => o.x === m.x && o.y === m.y)
                 
                if (isOrt) return {...m, type: 'frontier'}
                return m
            })
        })
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
        removeWall(path, frontier)
        addFrontiers(frontier)

        setCount(prevCount => prevCount + 1)
    }

    function restartGame() {
        setCount(0)
        setMaze(restartMaze())
    }

    const random = size => Math.floor(Math.random() * size)

    useEffect(() => {
        const constructMaze = setTimeout(() => {
            buildMaze()
        }, 100);

        return () => clearTimeout(constructMaze)
    }, [count])

    const tableCells = maze.map((cell, i) => {
        const style = cell.actual ? {backgroundColor: "red"} : null
        return (
            <div className={cell.type} style={style}>
            </div>
        ) 
    })
    

    return (
        <>
            <div className="table" style={{
                gridTemplateColumns: `repeat(${tableSize}, 1fr)`
            }}>
                {tableCells}
            </div>
            <button className="bttn" onClick={() => restartGame()}>Recomeçar</button>
        </>
    )
}