import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import SignUp from "./components/SignUp";
import MainPage from "./components/MainPage";
import SignIn from "./components/SignIn";
import QusetionList from "./components/QusetionList";
import AskQuestion from "./components/AskQuestion";
import QusetionDetail from "./components/QusetionDetail";


export default function Router() {
    return (
        <>
            <BrowserRouter>
                <Header></Header>
                <Routes>
                    <Route path='/' element={<MainPage/>}></Route>
                    <Route path='/signin' element={<SignIn/>}></Route>
                    <Route path='/signup' element={<SignUp/>}></Route>
                    <Route path='/questions' element={<QusetionList/>}></Route>
                    <Route path='/questions/ask' element={<AskQuestion/>}></Route>
                    <Route path='/questions/question/detail/:questionId' element={<QusetionDetail/>}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}