import React, {useState} from "react"

import {ReactComponent as Logo} from './images/logo.svg'
import {ReactComponent as GitHub} from './images/github.svg'

export default function Menu(props) {
    const {
        gameState,
        setGameState,
        setTableSize,
        tableSize,
    } = props

    const [formData, setFormData] = useState(
        {
            difficult: "medium",
        })

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prevFormData) => (
            { 
                ...prevFormData, 
                [name]: value 
            }
        ))

        if (name === 'difficult') {
            if (value === 'easy') setTableSize(15)
            else if (value === 'medium') setTableSize(21)
            else if (value === 'hard') setTableSize(29)

        }
    }
  
    const handleSubmit = (event) => {
        event.preventDefault()
    }


    function keyDown(e) {
        console.log(e, e.key, e.target.children['label'])
    }

    return (
        <main className="main-menu">
            <header className="header-menu">
                <Logo className="logo-svg"/>
                <h2>Can you run through all mazes?</h2>
            </header>
            <section className="section-menu">
                {/* <div className="option-wrapper">
                    <h3>Number of mazes</h3>
                    <input 
                        type="number" 
                        className="input-size"
                        value={17}
                    />
                </div> */}
                <div className="option-wrapper">
                    <h3>Difficult</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="bttns-wrapper">
                            <input 
                                type="radio" 
                                className="difficult-radio" 
                                name="difficult" 
                                id="easy" 
                                value="easy"
                                checked={formData.difficult === 'easy'}
                                onChange={handleChange}
                            />
                            <input 
                                type="radio" 
                                className="difficult-radio" 
                                name="difficult" 
                                id="medium" 
                                value="medium"
                                checked={formData.difficult === 'medium'}
                                onChange={handleChange}
                            />
                            <input 
                                type="radio" 
                                className="difficult-radio" 
                                name="difficult" 
                                id="hard" 
                                value="hard"
                                checked={formData.difficult === 'hard'}
                                onChange={handleChange}
                            />
                        
                            <button className={`bttn ${formData.difficult === 'easy' ? 'active' : null}`} onKeyDown={keyDown}>
                                <label htmlFor="easy">Easy</label>
                            </button>
                            <button className={`bttn ${formData.difficult === 'medium' ? 'active' : null}`} onKeyDown={keyDown}>
                                <label htmlFor="medium">Medium</label>
                            </button>
                            <button className={`bttn ${formData.difficult === 'hard' ? 'active' : null}`} onKeyDown={keyDown}>
                                <label htmlFor="hard">Hard</label>
                            </button>
                        </div>
                    </form>
                </div>
                <button 
                    className="bttn bttn-plus"
                    onClick={() => setGameState('game')}
                >
                    Start game
                </button>
            </section>
            <footer className="footer">
                <a href="https://github.com/ccostafrias" target="_blank">
                    <GitHub className="github-svg"/>
                </a>
            </footer>
        </main>
    )
}