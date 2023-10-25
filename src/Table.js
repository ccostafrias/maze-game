import React, { useState, useEffect } from "react"
import { LuTimer } from 'react-icons/lu'

import Countdown from "./Countdown"

export default function Table(props) {
    const { 
        tableSize, 
        gameState,
        setGameState,
        score,
        setScore,
        isZen
    } = props


    const [count, setCount] = useState(0)
    const [player, setPlayer] = useState({x: 1, y: 0})
    const [maze, setMaze] = useState(restartMaze())
    const [mouseDown, setMouseDown] = useState(false)
    const [seconds, setSeconds] = useState(15)
    
    const toRad = deg => deg * (Math.PI / 180)
    const random = size => Math.floor(Math.random() * size)
    
    // Maze functions
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
        for (let i = 0; i < 4; i++) {
                const x = Number(Math.cos(toRad(90*i)).toFixed(15))*2
                const y = Number(Math.sin(toRad(90*i)).toFixed(15))*2

                if ((f.x + x <= 0 || f.y + y <= 0) || (f.x + x >= tableSize-1 || f.y + y >= tableSize-1 )) continue

                const choosen = maze[f.x + x + ((f.y + y) * tableSize)]

                if (choosen.type !== 'in') continue
                paths.push(choosen)
        }
        const choosenRandom = paths[random(paths.length)]
        return choosenRandom
    }

    function removeWall(p, f) {
        const removeWall = {...maze[(p.x + f.x)/2 + ((p.y + f.y)/2) * tableSize], type: 'in'}
        const actual = {...maze[f.x + (f.y * tableSize)], type: 'in', actual: true}

        return [removeWall, actual]
    }

    function addFrontiers(f) {
        const ortFront = []

        for (let i = 0; i < 4; i++) {
            const x = Number(Math.cos(toRad(90*i)).toFixed(15))*2
            const y = Number(Math.sin(toRad(90*i)).toFixed(15))*2

            if ((f.x + x <= 0 || f.y + y <= 0) || (f.x + x >= tableSize-1 || f.y + y >= tableSize-1 )) continue

            const choosen = maze[f.x + x + ((f.y + y) * tableSize)]

            if (choosen.type === 'in') continue
            ortFront.push({...choosen, type: 'frontier'})
        }   

        return ortFront
    }
    
    function buildMaze() {
        const countFrountier = maze.filter(m => m.type === 'frontier').length
        if (countFrountier <= 0) {
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

    // Mouse / keyboard handle functions
    function mousehandle(e) {
        if ((e.type === 'mousedown' || e.type === 'touchstart') && e.target.className === 'player') setMouseDown(true)
        else if (e.type === 'mouseup' || e.type === 'touchend') setMouseDown(false)
    }

    function keyhandle(e) {
        if (e.key === 'r') restartTable()
    }

    // Player functions
    function movePlayer(e) {
        if (!mouseDown) return

        const trueTarget = e.type.includes('mouse') ? e.target : document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY)
        
        const [x, y] = Object.values(trueTarget.dataset).map(v => Number(v))

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
                nextMaze()
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
                if (cell.type !== 'in' && cell.type !== 'trail') return false
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
                if (cell.type !== 'in' && cell.type !== 'trail') return false
                between.push(maze[c + y * tableSize])
            }
            return between
        }

        return false
    }
    
    function nextMaze(dev = false) {
        if (!dev) {
            setScore(prevScore => prevScore + 1)
            setSeconds(prevSeconds => prevSeconds + 3)
        }
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

    useEffect(() => {
        buildMaze()
    }, [count])

    useEffect(() => {
        window.addEventListener('mouseup', mousehandle)
        window.addEventListener('touchend', mousehandle)

        return () => {
            window.removeEventListener('mouseup', mousehandle)
            window.removeEventListener('touchend', mousehandle)
        }
    }, [mouseDown, player])

    useEffect(() => {
        setScore(0)
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
                onTouchMove={movePlayer}
                onMouseDown={mousehandle}
                onMouseUp={mousehandle}
                onTouchStart={mousehandle}
                onTouchEnd={mousehandle}
            >
            </div>
        ) 
    })

    return (
        <main className="main-game">
            <div className="header-game">
                {!isZen && (
                    <>
                        <LuTimer className="timer-svg"/>
                        <Countdown 
                            isRunning={gameState}
                            seconds={seconds}
                            setSeconds={setSeconds}
                            setGameState={setGameState}
                        />
                    </>
                )}
                {/* <h3>Mazes through: {score}</h3> */}
            </div>
            <div className="table" style={{
                gridTemplateColumns: `repeat(${tableSize}, 1fr)`
            }}>
                {tableCells}
            </div>
            <div className="bttns-wrapper">
                <button className="bttn bttn-plus" onClick={() => restartTable()}>Restart</button>
                <button className="bttn bttn-plus" onClick={() => setGameState('menu')}>Menu</button>
            </div>
        </main>
    )
}