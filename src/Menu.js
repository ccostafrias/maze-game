import React, {useState} from "react"

import { AiFillInfoCircle } from "react-icons/ai"

import {ReactComponent as Logo} from './images/logo.svg'
import {ReactComponent as GitHub} from './images/github.svg'

export default function Menu(props) {
    const {
        setGameState,
        setTableSize,
        tableSize,
        formData,
        setFormData,
    } = props

    const [infoVisible, setInfoVisible] = useState(false)

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target ? event.target : event

        setFormData((prevFormData) => (
            { 
                ...prevFormData, 
                [name]: type === 'checkbox' ? checked : value 
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
        if (e.key !== 'Enter') return
        const label = [...e.target.children][0]
        const [name] = label.className.split('-')
        const value = label.htmlFor
        console.log(value)
        const newDifficult = {
            name,
            value: value === 'zen' ? !formData.zen : value
        }

        handleChange(newDifficult)
        
    }

    function showInfo() {
        setInfoVisible(prevInfoVisible => !prevInfoVisible)
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
                <form onSubmit={handleSubmit}>
                    <div className="option-wrapper">
                        <h3>Difficult</h3>
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
                            
                                <button className={`bttn ${formData.difficult === 'easy' ? 'active' : ''}`} onKeyUp={keyDown}>
                                    <label className="difficult-label" htmlFor="easy">Easy</label>
                                </button>
                                <button className={`bttn ${formData.difficult === 'medium' ? 'active' : ''}`} onKeyUp={keyDown}>
                                    <label className="difficult-label" htmlFor="medium">Medium</label>
                                </button>
                                <button className={`bttn ${formData.difficult === 'hard' ? 'active' : ''}`} onKeyUp={keyDown}>
                                    <label className="difficult-label" htmlFor="hard">Hard</label>
                                </button>
                            </div>
                    </div>
                    <div className="option-wrapper">
                        <h3>Zen Mode</h3>
                        <input 
                            type="checkbox" 
                            className="zen-checkbox"
                            name="zen"
                            id="zen"
                            checked={formData.zen}
                            onChange={handleChange}
                        />
                        <button className="switch" onKeyDown={keyDown}>
                            <label className="zen-label" htmlFor="zen">
                                <div className={`zen-ball ${formData.zen ? 'active' : ''}`} />
                            </label>
                                <AiFillInfoCircle
                                    className="info"
                                    onClick={showInfo}
                                />
                                <div className="info-container" style={{
                                    opacity: infoVisible ? '1' : '0'
                                }}>
                                    <span>Toogle timer <strong>on</strong> or <strong>off.</strong></span>
                                </div>
                        </button>
                    </div>
                </form>
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