import React, {useState, useEffect} from "react"

export default function Countdown(props) {
    const {
        isRunning,
        setGameState,
        seconds,
        setSeconds
    } = props

    const [miliseconds, setMiliseconds] = useState(0)

    useEffect(() => {
        let interval
        if (isRunning === 'game') {
            interval = setInterval(() => {
                if (miliseconds > 0) {
                    setMiliseconds(prevMiliseconds => prevMiliseconds - 1)
                } else if (seconds > 0) {
                    setSeconds(prevSeconds => prevSeconds - 1)
                    setMiliseconds(99)
                } else {
                    // setGameState('gameover')
                }
            }, 10)
        }
    
        return () => clearInterval(interval)

    }, [miliseconds, seconds, isRunning])

    const style = seconds < 5 ? { color: 'red'} : null

    return (
        <div className="timer" style={style}>
            <span>{seconds}</span>
            <span>,{miliseconds}</span>
        </div>
    )
}