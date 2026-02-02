import React from "react";
import './App.css';
import './styles/global.scss'
import Header from './components/Header.js'
import WordGenerator from './components/WordGenerator.js'
import BuyMeACoffee from './components/BuyMeACoffee.js'


function App() {

  return (
    <div className="App">
      <Header />
      <WordGenerator />
      <BuyMeACoffee />
    </div>
  );
}

export default App;