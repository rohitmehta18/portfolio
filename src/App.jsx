import React, { useState } from 'react';
import './App.css'; // Import the styles


function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };
    
    return (
        <div className={`container ${isDarkMode ? 'dark' : ''}`}>
            <div className="nav">
                <div className="nav-item">Home</div>
                <div className="nav-item">About</div>
                <div className="nav-item">Contact</div>
                <div className="nav-item">Projects</div>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            
            <div className="grey-section">
                <div className="bulb-container" onClick={toggleTheme}>
                    <div className="cord"></div>
                    <div className={`bulb ${isDarkMode ? 'on' : ''}`}>
                        <div className="bulb-base"></div>
                    </div>
                </div>
            </div>
            
            <div className="purple-section">
                <div className="intro-text">
                    <h1>Hi, I am Rohit</h1>
                    <p>An aspiring full stack developer passionate about creating interactive and responsive web applications.</p>
                </div>
            </div>
        </div>
    );
}

export default App;

