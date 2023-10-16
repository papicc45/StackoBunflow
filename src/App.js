import Header from './components/Header'
import Content from "./components/MyInfo";
import Login from "./components/SignUp";
import {useState} from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import SignUp from "./components/SignUp";
import MainPage from "./components/MainPage";
import Router from "./Router";

function App() {

  return (
    <>
        <Router></Router>
        {/*<Header></Header>*/}
        {/*<MainPage></MainPage>*/}
        {/*<SignUp></SignUp>*/}
    </>
  );
}

export default App;
