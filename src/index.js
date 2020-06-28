import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router,Switch,Route,Redirect } from 'react-router-dom';
import "./index.css";
import 'gestalt/dist/gestalt.css';
import Navbar from "./components/Navbar";
import App from "./components/App";
// import registerServiceWorker from "./sw";
// import { domainToASCII } from "url";
import {getToken} from './utils/index';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Checkout from './components/Checkout';
import Details from './components/Details';
import Footer from './components/Footer';




const PrivateRoute =({component :Component, ...rest})=>(
    <Route {...rest} render={props =>(
        getToken() !==null ? <Component {...props} />: <Redirect to={{
            pathname :'/Signup',
            state: {from :props.location}
        }}/>
    )} />
)





const Root =()=>(
    <Router basename="/react-ecommerce">
    <React.Fragment>
    <Navbar />
   
  
        <Switch>
            <Route component={App} exact path='/' />
            <Route component={Signup} exact path='/Signup'/>
            <Route component={Signin} exact path='/Signin'/>
            <PrivateRoute component={Checkout} exact path='/Checkout'/>
            <Route component={Details} exact path='/:brandId' />
           
        </Switch>
        
        <Footer />
        </React.Fragment>
       
    </Router>

)


ReactDOM.render(<Root />, document.getElementById("root"));
// registerServiceWorker();
