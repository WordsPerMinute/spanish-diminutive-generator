import React from 'react';
import PropTypes from 'prop-types';

const WordGenerator = ({ props }) => {
  const [showConvertedWord, setShowConvertedWord] = useState(false);
  const [userInput, setUserInput] = useState('');

  const onChange = (e) => {
    console.log('onChanges');

    const { options } = props;
    const userInput = e.currentTarget.value;

    // capture current word here
    const convertedWord = (function() {
      //run the convert helping function
      userInput;
    })();

    const convertWord = (word) => {
      setConvertedWord(word + 'EXTRA')
    }

    setShowConvertedWord(true);
    setUserInput(e.currentTarget.value)
  };

  onClick = (e) => {
    setShowConvertedWord(false);
    setUserInput(e.currentTarget.innerText)
  };

  onKeyDown = (e) => {

    if (e.keyCode === 13) {
      // return key
    } else if (e.keyCode === 38) {
      // up arrow
      if (activeOption === 0) {
        return;
      }
    } else if (e.keyCode === 40) {
      // down arrow
        return;
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,

      state: { activeOption, filteredOptions, showOptions, userInput }
    } = this;
    let optionList;
    if (showOptions && userInput) {
      if (filteredOptions.length) {
        optionList = (
          <ul className="options">
            {filteredOptions.map((optionName, index) => {
              let className;
              if (index === activeOption) {
                className = 'option-active';
              }
              return (
                <li className={className} key={optionName} onClick={onClick}>
                  {optionName}
                </li>
              );
            })}
          </ul>
        );
      } else {
        optionList = (
          <div className="no-options">
            <em>No Option!</em>
          </div>
        );
      }
    }
    return (
      <React.Fragment>
        <div className="search">
          <input
            type="text"
            className="search-box"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />
          <input type="submit" value="" className="search-btn" />
        </div>
        {optionList}
      </React.Fragment>
    );
  }
}

export default WordGenerator;