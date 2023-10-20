import React, { useState, useEffect } from "react"

export default function Table(props) {
    const { 
        tableSize, 
        gameState,
        setGameState,
    } = props


    const [count, setCount] = useState(0)
    const [player, setPlayer] = useState({x: 1, y: 0})
    const [maze, setMaze] = useState(restartMaze())
    const [mouseDown, setMouseDown] = useState(false)
    
    function restartMaze(np = {x: 1, y: 0}) {
        return (
                Array.from(Array(tableSize**2)).map((_, i) => {
                    let type
                    const x = i % tableSize
                    const y = Math.floor(i / tableSize)
                    if (x === np.x && y === np.y) type = 'player'
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
                const choosen = maze[f.x + r + ((f.y + c) * tableSize)]

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
                
                const choosen = maze[f.x + r + ((f.y + c) * tableSize)]

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

    function mousehandle(e) {
        if (e.type === 'mousedown' && e.target.className === 'player') setMouseDown(true)
        else if (e.type === 'mouseup') setMouseDown(false)
    }

    // ADICIONAR TECLA R PRA RESET
    function keyhandle(e) {

    }

    function movePlayer(e) {
        if (!mouseDown) return
        
        const [x, y] = Object.values(e.target.dataset).map(v => Number(v))

        const isPlayerAligned = getPlayerAligned(x, y)
        
        if (isPlayerAligned) {
            if (isPlayerAligned.length > 0 && isPlayerAligned !== 'end') {
                setMaze(prevMaze => {
                    return prevMaze.map(m => {
                        const inAligned = isPlayerAligned.find(a => a.x === m.x && a.y === m.y)
                        if (m.x === x && m.y === y) return {...m, type: 'player'}
                        else if (m.type === 'player') return {...m, type: 'trail'}
                        else if (inAligned) return {...m, type: 'trail'}
                        return m
                    })
                })
    
                setPlayer({x, y})

                return
            }

            if (isPlayerAligned === 'end') {
                restartGame()
            }
        }        
        
    }

    function getPlayerAligned(x, y) {
        const [xp, yp] = Object.values(player)

        const between = []

        if (xp === x) {
            const hy = yp > y ? yp : y
            const ly = yp < y ? yp : y
            const addLow = ly === yp ? 1 : 0
            const addHigh = hy === yp ? 0 : 1
            for (let r = ly+addLow; r < hy+addHigh; r++) {
                const cell = maze[x + r * tableSize]
                if (cell.type === 'end') return 'end'
                if (cell.type !== 'in') return false
                between.push(maze[x + r * tableSize])
            }
            return between
        }
        if (yp === y) {
            const hx = xp > x ? xp : x
            const lx = xp < x ? xp : x
            const addLow = lx === xp ? 1 : 0
            const addHigh = hx === xp ? 0 : 1
            for (let c = lx+addLow; c < hx+addHigh; c++) {
                const cell = maze[c + y * tableSize]
                if (cell.type === 'end') return 'end'
                if (cell.type !== 'in') return false
                between.push(maze[c + y * tableSize])
            }
            return between
        }

        return false
    }
    
    function restartGame() {
        setPlayer({x: 1, y: 0})
        setMaze(restartMaze())
        setCount(Math.random(1))
    }

    function restartTable() {
        setPlayer({x: 1, y: 0})
        setMaze(prevMaze => prevMaze.map(m => {
            if (m.x === 1 && m.y === 0) return {...m, type: 'player'}
            if (m.type === 'trail' || m.type === 'player') return {...m, type: 'in'}
            return m
        }))
    }

    const random = size => Math.floor(Math.random() * size)

    useEffect(() => {
        buildMaze()
    }, [count])

    useEffect(() => {
        window.addEventListener('mouseup', mousehandle)

        return () => window.removeEventListener('mouseup', mousehandle)
    }, [mouseDown, player])

    useEffect(() => {
        window.addEventListener('keyup', keyhandle)

        return () => window.removeEventListener('keyup', keyhandle)
    }, [])

    const tableCells = maze.map((cell, i) => {
        const style = cell.actual ? {backgroundColor: "red"} : null
        return (
            <div 
                className={cell.type} 
                data-column={i % tableSize}
                data-row={Math.floor(i/tableSize)}
                style={style} 
                key={i}
                onMouseMove={movePlayer}
                onMouseDown={mousehandle}
                onMouseUp={mousehandle}
                onDrag={(e) => e.preventDefault()}
            >
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
            <button className="bttn bttn-plus" onClick={() => restartTable()}>Restart</button>
        </main>
    )
}