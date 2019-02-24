import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function Result(props) {
  return (
    <ReactCSSTransitionGroup
    className="container result"
    component="div"
    transitionName="fade"
    transitionEnterTimeout={100}
    transitionLeaveTimeout={100}
    transitionAppear
    transitionAppearTimeout={100}
    >
    <div
    className="resultMessage"
    >
    <p>Your exam has been submitted.  </p>
    <p>You have answered <strong>{props.answersCount}</strong> out of <strong>{props.questionTotal}</strong>  questions!</p>
    <a href="https://ico-cert.org" className="nextButton">Back to ICO</a>
    </div>
    </ReactCSSTransitionGroup>
  );

}

export default Result;
