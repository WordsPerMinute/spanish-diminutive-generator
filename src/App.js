import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import './styles/global.scss'
import Header from './components/Header.js'
import WordGenerator from './components/WordGenerator.js'


function App() {
  const [userWord, setUserWord] = useState(null);
  const [convertedWord, setConvertedWord] = useState([
    "Cafecito",
    "Amorcito",
    "Comentarito",
    "Casita",
    "Cervecita"
  ]);

  return (
    <div className="App">
      <Header />
      <WordGenerator />
    </div>
  );
}

export default App;