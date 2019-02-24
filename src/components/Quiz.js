import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Question from '../components/Question';
import QuestionCount from '../components/QuestionCount';
import AnswerOption from '../components/AnswerOption';
import NextButton from '../components/NextButton';
import Countdown from 'react-countdown-now';

function Quiz(props) {


  const renderer = ({ hours, minutes, seconds, completed }) => {

const greenStyle = {
  color: 'green'
};

const orangeStyle = {
  color: 'orange'
};


    if (parseInt(hours) < 1 && parseInt(minutes) < 15) {
      if (parseInt(hours) < 1 && parseInt(minutes) < 5) {
          return <span className="redCountdown">{hours}:{minutes}:{seconds}</span>;
        }
        else{
        return <span className="orangeCountdown">{hours}:{minutes}:{seconds}</span>;
}    }
    else {
      // Render a countdown
      return <span className="greenCountdown">{hours}:{minutes}:{seconds}</span>;
    }
  };

  const end = () => {
    //alert("Time is up!");
    props.resulting();
    //this.forceUpdate();
    //window.location = 'http://localhost/server/result.php?questionCount=' + (props.questionIndex-1) + '&questionTotal=' + props.questionTotal;
  };

  function renderAnswerOptions(key) {
    return (
      <AnswerOption
      key={key.answer_text}
      answerContent={key.answer_text}
      answerType={key.answer_id}
      answer={props.answer}
      questionIndex={props.questionIndex}
      onAnswerSelected={props.onAnswerSelected}
      />
    );
  }

  return (
    <ReactCSSTransitionGroup
    className="container"
    component="div"
    transitionName="fade"
    transitionEnterTimeout={800}
    transitionLeaveTimeout={500}
    transitionAppear
    transitionAppearTimeout={500}
    >
    <div key={props.questionIndex}>
    <QuestionCount
    counter={props.questionIndex}
    total={props.questionTotal}
    /><div className="countdown">
    <Countdown onComplete={end} date={props.time + props.duration} zeroPadLength={2} renderer={renderer}>
    </Countdown>
    </div>
    <div>
    <Question content={props.question} />
    </div>
    <ul className="answerOptions">
    {props.answerOptions.map(renderAnswerOptions)}
    </ul>
    </div>
    <div className="buttonWrapper">
    <NextButton
    transitionName="fade"
    transitionEnterTimeout={800}
    transitionLeaveTimeout={500}
    transitionAppear
    transitionAppearTimeout={500}
    content={props.onButtonPressed} />
    </div>
    </ReactCSSTransitionGroup>
  );
}

export default Quiz;
