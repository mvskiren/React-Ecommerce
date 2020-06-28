import React from 'react';
import {Box,Text,Heading,Image,SearchField,Button} from 'gestalt';
import {NavLink,withRouter} from 'react-router-dom';
import { getToken ,clearCart,clearToken} from '../utils/index';

class Navbar extends React.Component {   

handleSignout =()=>{
    clearToken();
    clearCart();
    this.props.history.push('/');
    //clear token
    //clear cart
    //redirect homepage
}



    render()
    {
        return getToken() !== null ? <AuthNav handleSignout={this.handleSignout} /> : <UnAuth />;
    }
   
    
};


const AuthNav =(props) =>
(
    <Box
    display="flex"
    justifyContent="around"
    alignItems="center"
    height={70}
    dangerouslySetInlineStyle={{
          __style: {
            backgroundColor: "#000000"
        //   backgroundColor: "#2874f0"
          }
        }}
   
    padding={1}
    shape="roundedBottom"
    >
      <Box display="flex" alignItems="center">
      <NavLink to="/">
        <Heading color="white" size="xs">Mojo</Heading>
        </NavLink>
        </Box>
    
     <Box display="flex" alignItems="center">
    <Box  margin={2} height={50} width={50}>
    </Box>

        </Box>
    
    <NavLink to="/Checkout">
        <Button 
        color="transparent"
        text="Sign Out" inline size="md" 
            onClick={props.handleSignout}
        />


  
    </NavLink>
    {/* <Box
      display="flex" justifyContent="center" marginTop={4}
      >
      </Box> */}

    </Box>


);



const UnAuth=()=>(
    <Box
    display="flex"
    justifyContent="around"
    alignItems="center"
    height={70}
   
    padding={1}
    shape="roundedBottom"
    dangerouslySetInlineStyle={{
          __style: {
          backgroundColor: "#000000"
          }
        }}
    >
      <Box display="flex" alignItems="center">
      <NavLink to="/">
        <Heading color="white" size="xs">Mojo</Heading>
        </NavLink>
        </Box>
     <NavLink to="/Signup">
        <Text color="white" size="x1">Register</Text>
    </NavLink>
    
    <NavLink  to="/">
     <Box display="flex" alignItems="center">
    <Box  margin={2} height={50} width={50}>
    </Box>

        </Box>
    </NavLink>

    <NavLink to="/Signin">
        <Text color="white" size="x1">Login</Text>
    </NavLink>
    <Box
      display="flex" justifyContent="center" marginTop={4}
      >
       
      </Box>

    </Box>
);
export default withRouter(Navbar);
