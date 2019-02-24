import React from 'react';

function AnswerOption(props) {
  return (
    <li className="answerOption">
    <input
    type="checkbox"
    className="radioCustomButton"
    name="radioGroup"
    id={props.answerType}
    value={props.answerType}
    onChange={props.onAnswerSelected}
    />
    <label className="radioCustomLabel" htmlFor={props.answerType} dangerouslySetInnerHTML={{__html: props.answerContent}}>

    </label>
    </li>
  );
}

export default AnswerOption;
