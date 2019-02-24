import React from 'react';

function Button(props) {
  return (
    <button
    className="nextButton"
    onClick={props.content}>Next</button>
  );
}

export default Button;
