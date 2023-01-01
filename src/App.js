import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from './screens/HomeScreen'
import CreateScreen from './screens/CreateScreen'
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import AboutScreen from './screens/AboutScreen'
import BlogScreen from './screens/BlogScreen';
import BlogUpdateScreen from './screens/BlogUpdateScreen';

const App = ()=> {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />}/>
          <Route path="/create" element={<CreateScreen />}/>
          <Route path="/login" element={<LoginScreen />}/>
          <Route path="/signup" element={<SignUpScreen />}/>
          <Route path="/about" element={<AboutScreen/>}/>
          <Route path="/blog/:id" element={<BlogScreen/>}/>
          <Route path="/blog/update/:id" element={<BlogUpdateScreen/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
