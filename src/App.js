import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import Header from './components/Layout.js'
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
      <WordGenerator
        convertedWord={convertedWord}
        setConvertedWord={setConvertedWord}
      />
    </div>
  );
}

export default App;