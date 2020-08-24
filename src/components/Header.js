import React from 'react';
import './Header.scss'

const Header = (props) => {

    return (  
        <header>
            <h1>
                <a href="./">
                    <span className="spanish">Spanish </span>
                    <span className="diminutive">Diminutive </span>
                    <span className="generator">Generator</span>
                </a>
            </h1>
            <h2>Generador de Diminutivos</h2>
        </header>
    );
}
 
export default Header;