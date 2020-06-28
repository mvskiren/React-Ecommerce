import React from "react";
import Strapi from 'strapi-sdk-javascript/build/main';
import { Container, Box, Button, Heading, Text, TextField } from "gestalt";
import {setToken} from '../utils/index';
const apiUrl='https://strapi-mangodb.herokuapp.com' ; //|| process.env.API_URL || 'http://localhost:1337'  
const strapi =new Strapi(apiUrl);
class Signup extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    loading: false
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

handleSubmit = async event => {
    event.preventDefault();
    const {username,email,password}= this.state;
    
    try
    {
        this.setState({loading : true});
        const response =await strapi.register(username,email,password);
        this.setState({loading : false});
        console.log(response);
        setToken(response.jwt);
        this.redirectUser('/');

        //set loading is -true
        //make a request to strapi 
        //set loading to false
        // put the token (to manage user session) in local storage

    }
    catch(err){
        console.error(err);
    }
};

redirectUser= path =>{
    this.props.history.push(path);

}

isFormEmpty= ({username,password,email}) =>{
    return !username || !email || !password ;
}




  render() {
    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#ebe2da"
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
        >
          {/* Sign Up Form */}
          <form
            style={{
              display: "inlineBlock",
              textAlign: "center",
              maxWidth: 450
            }}
            onSubmit={this.handleSubmit}
          >
            {/* Sign Up Form Heading */}
            <Box
              marginBottom={2}
              display="flex"
              direction="column"
              alignItems="center"
            >
              <h1 style={{background: 'linear-gradient(to right ,#FF0000, #6f6f89)','-webkit-background-clip': 'text',
         '-webkit-text-fill-color': 'transparent'}} >Register</h1> 
              <Text italic color="orchid">
                Sign up to start shopping!
              </Text>
             
            </Box>
            {/* Username Input */}
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />
            {/* Email Address Input */}
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={this.handleChange}
            />
            {/* Password Input */}
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <Button inline color="blue" text="Submit" type="submit" />
          </form>
        </Box>
      </Container>
    );
  }
}

export default Signup;
