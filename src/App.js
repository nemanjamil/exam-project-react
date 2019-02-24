import React, { Component } from 'react';
import update from 'react-addons-update';
import logo from './svg/ico-cert.png';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Countdown from 'react-countdown-now';
import './App.css';
import Cookie from 'react-cookie'

class App extends Component {

  // The constuctor sets the initial state of the parameters
  constructor(props) {
    super(props);
    this.state = {
      examName: '',
      firstname: '',
      lastname: '',
      counter: 0,
      questionIndex: 0,
      questionId: '',
      question: '',
      answerOptions: [],
      answers: [],
      answersCount: 0,
      questionCount: [],
      time: 0,
      duration: 0,
      questionTotal: 0,
      userId: Cookie.load('userId'),
      examValidationPath: '../validation/exam.php'
    };

    // These functions are defined as params
    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
    this.handleButtonPressed = this.handleButtonPressed.bind(this);
    this.resulting = this.resulting.bind(this);
  }

  componentWillMount() {

    // The exam data ist fetched from the server
    //Authorization header field is needed for the JWT authentification
    fetch(this.state.examValidationPath, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.getQueryVariable("token")
      }
    })
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(data => {
      if(data.error){
        window.location = 'https://ico-cert.org/404';
      } else{
        const shuffledAnswerOptions = data.examQuestions.map((question) => this.shuffleArray(question.answers));
        Cookie.save('jwt', this.getQueryVariable("token"), { path: '/' });
        console.log(data.examQuestions[0].question_id);
        //The state parameters are updated with the fetched data
        this.setState({
          examName: data.examName,
          question: data.examQuestions[0].question_text,
          questionId: data.examQuestions[0].question_id,
          answerOptions: shuffledAnswerOptions[0],
          time: data.time,
          duration: data.duration,
          firstname: data.firstname,
          lastname: data.lastname,
          questionTotal: data.questionTotal,
          questionIndex: data.questionIndex,
          jwt: this.getQueryVariable("token")
        });
      }
    });


  }

  //Prevent back button
  componentDidMount() {
    window.onpopstate = this.onBackButtonEvent
  }


  onBackButtonEvent(e) {
    e.preventDefault()
    alert('WARNING: You are quiting and submitting the exam!');
  }


  resulting(){
    this.setState({
      result: '10'
    })
  }

  //Help function to shuffle an array of answers or questions
  shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle
    while (0 !== currentIndex) {

      // Select a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap it with the current element
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  //This peformed if a answer is selected
  handleAnswerSelected(event) {
    if (event.currentTarget.checked) {
      this.setAnswer(event.currentTarget.value);
    } else {
      this.removeAnswer(event.currentTarget.value);
    }
  }

  //If button is pressed load next question or if it is the last question show result
  handleButtonPressed(event) {
    if(this.state.answers.length > 0){
      if (this.state.questionIndex < this.state.questionTotal) {
        setTimeout(() => this.setNextQuestion(), 100);
      } else {
        setTimeout(() => this.getResults(), 100);
        this.setState({
          result: '!'
        })
      }

      this.updateQuestionCount(this.state.questionId);

    } else {
      //A least one answer must be selected
      alert("Choose at least one answer option!")
    }

  }

  //The array of the answered questions is updated
  updateQuestionCount(questionId) {
    this.setState({
      questionCount:[...this.state.questionCount, questionId]
    });
  }

  //Helper function to set answer
  setAnswer(answer) {
    this.setState({
      answers:[...this.state.answers, answer]
    });
  }

  //Helper function to remove answer
  removeAnswer(answer) {
    this.setState(prevState => ({
      answers: update(prevState.answers, {$splice: [[prevState.answers.indexOf(answer), 1]]})
    }))
  }

  //Helper function to set next question and send current answer
  setNextQuestion() {
    const counter = this.state.counter + 1;

    //New question is fetched from the server
    fetch(this.state.examValidationPath, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.getQueryVariable("token")
      },
      body: JSON.stringify({
        'question_id': this.state.questionId,
        'answersSelected': this.state.answers
      })
    })
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(data => {
      if(data.error){
        console.log(data.error);
        window.location = 'https://ico-cert.org/404';
      } else{
        const shuffledAnswerOptions = data.examQuestions.map((question) => this.shuffleArray(question.answers));

        this.setState((prevState) => {
          return {answersCount: prevState.answersCount + 1}
        });

        this.setState({
          counter: counter,
          examName: data.examName,
          question: data.examQuestions[0].question_text,
          questionId: data.examQuestions[0].question_id,
          answerOptions: shuffledAnswerOptions[0],
          time: data.time,
          duration: data.duration,
          firstname: data.firstname,
          lastname: data.lastname,
          questionTotal: data.questionTotal,
          questionIndex: data.questionIndex,
          answers: []
        });
      }
    });
  }

  //Helper function to show result and send last answer
  getResults() {
    fetch(this.state.examValidationPath, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.getQueryVariable("token")
      },
      body: JSON.stringify({
        'question_id': this.state.questionId,
        'answersSelected': this.state.answers
      })
    })
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    this.setState((prevState) => {
      return {answersCount: prevState.answersCount + 1}
    });

  }

  //Helper function to get the GET Parameter
  getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    alert('GET Parameter "' + variable + '" not set');
  }

  //Render the quiz components
  renderQuiz() {
    return (

      <Quiz
      answer={this.state.answer}
      answerOptions={this.state.answerOptions}
      question={this.state.question}
      questionTotal={this.state.questionTotal}
      questionIndex= {this.state.questionIndex}
      answerCount= {this.state.answerCount}
      onAnswerSelected={this.handleAnswerSelected}
      time={this.state.time * 1000}
      duration={this.state.duration}
      onButtonPressed={this.handleButtonPressed}
      resulting={this.resulting}
      />
    );
  }

  //Render the result components
  renderResult() {
    return (

      <Result
      answersCount= {this.state.answersCount}
      questionTotal= {this.state.questionTotal}
      />
    );
  }
  //Render the app
  render() {
    return (
      <div className="App">
      <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>{this.state.examName}</h2>
      <h4>{this.state.firstname} {this.state.lastname}</h4>
      </div>
      {this.state.result ? this.renderResult() : this.renderQuiz()}
      </div>
    );
  }

}

export default App;
