import React from 'react';

function Question(props) {
  return (
    <p className="question" dangerouslySetInnerHTML={{__html: props.content}}/>
  );
}

export default Question;
