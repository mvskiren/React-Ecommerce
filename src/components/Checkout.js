import React from "react";
import { Container, Box, Button, Heading, Text, TextField } from "gestalt";
import ToastMessage from "./ToastMessage";
import Axios from 'axios';
import Strapi from 'strapi-sdk-javascript/build/main';
import {Elements,StripeProvider,CardElement,injectStripe} from 'react-stripe-elements';
import { getcart, calcPrice,clearCart,calculateAmount } from "../utils";
import HashLoader from "react-spinners/HashLoader";



const apiUrl='https://strapi-mangodb.herokuapp.com' ; //|| process.env.API_URL || 'http://localhost:1337'  
const strapi =new Strapi(apiUrl);

class _CheckoutForm extends React.Component {
  state = {
    cartItems: [],
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: "",
    toast: false,
    toastMessage: "",
    orderProcessing: false,
    emailSent: false,
    email: "kiranmvs03@gmail.com",
    message: "sai working man",
    laoding: true,
    discount: 0
    
  };
  

  componentDidMount() {
    this.setState({ cartItems: getcart() });
   
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleConfirmOrder = async event => {
    event.preventDefault();

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }
  };
  handleSubmitOrder=async ()=>{
    this.setState({loading: false});
    const {cartItems,city,address,postalCode}=this.state;
    const amount =calculateAmount(cartItems);
  
    let token;
    try {
  const response=await this.props.stripe.createToken();
  token=response.token.id;
      // const response = await this.props.stripe.createToken();
      
    
      await strapi.createEntry("orders", {
        amount,
        details: cartItems, 
        city,
        postalCode,
        address,
        token
      });
      this.setState({loading: true});
      this.setState({confetti:true});
       
      clearCart();
      this.showToast("Your order has been successfully submitted to Strapi CMS ,You will receive a confirmation mail soon!");

     ///adding sendgrid request thogh axios

    //  Axios.post('http://localhost:3030/api/email', this.state)
    //  .then(res => {
    //      if(res.data.success) {
    //          this.setState({
                
    //              emailSent: true
    //          });
    //      } else {
    //          this.setState({
                 
    //              emailSent: false
    //          });
    //      }
    //  })
    //  .catch(err => {
    //      console.log(err.message);

    //      this.setState({
             
    //          emailSent: false
    //      });
    //  })


     ///clsoing request



    } catch (err) {
      this.showToast(err.message);
    }
  };


  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
  };

  showToast = toastMessage => {
    this.setState({ toast: true, toastMessage });
    setTimeout(() => this.setState({ toast: false, toastMessage: "" }), 5000);
  };
  coupon =async ({event})=>{
  
    event.persist();
    
    if (event.target.value==='NEW')
     this.setState({ [event.target.name]: 1000 });
  
  }
 
  render() {
    const { toast, toastMessage, cartItems } = this.state;

    return (
      
      <Container>
        <Box
          color="darkWash"
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          {/* Checkout Form Heading */}
          <h1 style={{background: 'linear-gradient(to right ,#FF0000, #6f6f89)','-webkit-background-clip': 'text',
         '-webkit-text-fill-color': 'transparent'}} >Checkout</h1> 
          <h5 style={{background: 'linear-gradient(to right ,#000000, #6f6f89)','-webkit-background-clip': 'text',
         '-webkit-text-fill-color': 'transparent'}}> Note: Expected delay in delivery of products due to Covid-19!</h5>
          {cartItems.length > 0 ? (
            <React.Fragment>
              {/* User Cart */}
              <ToastMessage show={toast} message={toastMessage} />
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
                marginTop={2}
                marginBottom={6}
              >
                <Text color="darkGray" italic>
                  {cartItems.length} Items for Checkout
                </Text>
                <Box padding={2}>
                  {cartItems.map(item => (
                    <Box key={item._id} padding={1}>
                      <Text color="midnight">
                         ${item.quantity * item.Price}
                      </Text>
                    </Box>
                  ))}
                </Box>
                {/* <Text bold>Total Amount: {calcPrice(cartItems)}-{this.state.discount}</Text>
                Apply Coupon Code:  <TextField
                  id="postalCode"
                  type="text"
                  name="discount"
                  placeholder="Enter your code here"
                  onChange={this.coupon}
                /> */}
              </Box>
              {/* Checkout Form */}
              <form
                style={{
                  display: "inlineBlock",
                  textAlign: "center",
                  maxWidth: 450
                }}
                onSubmit={this.handleConfirmOrder}
              >
                {/* Shipping Address Input */}
                <TextField
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Shipping Address"
                  onChange={this.handleChange}
                />
                {/* Postal Code Input */}
                <TextField
                  id="postalCode"
                  type="number"
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={this.handleChange}
                />
                {/* City Input */}
                <TextField
                  id="city"
                  type="text"
                  name="city"
                  placeholder="City of Residence"
                  onChange={this.handleChange}
                />
                {/* Confirmation Email Address Input */}
                <TextField
                  id="confirmationEmailAddress"
                  type="email"
                  name="confirmationEmailAddress"
                  placeholder="Confirmation Email Address"
                  onChange={this.handleChange}
                />

                <h4 style={{color:'black'}}>Payment Gateway by <span style={{color:'blue','font-size':'20px'}}>Stripe</span> </h4>
                {/*  card elemt */}
                <CardElement id="Stripe__input" onReady={input =>input.focus()} />
                <h5 style={{background: 'linear-gradient(to right ,#FF0000, #6f6f89)','-webkit-background-clip': 'text',
         '-webkit-text-fill-color': 'transparent'}}>Test card details : <span style={{color:'blue'}}> 4242 4242 4242 42424 </span> 04/24 242 42424</h5>
                 
                <button id="stripe__button" type="submit" onClick={this.handleSubmitOrder}>
                  Pay {calcPrice(cartItems)}
                </button>
              </form>
                    
            </React.Fragment>
          ) : (
            // Default Text if No Items in Cart
            <Box color="darkWash" shape="rounded" padding={4}>
              <Heading align="center" color="watermelon" size="xs">
                Your Cart is Empty
              </Heading>
              <Text align="center" italic color="green">
                Add some Items!
              </Text>
            </Box>
          )}
        </Box>
        
      </Container>
      
    );
    
  }
}
const CheckoutForm=injectStripe(_CheckoutForm);
const Checkout=()=>(
  <StripeProvider apiKey="pk_test_kY6IT8I2ZZjVhwkZgn1Eno0H00uYWO66ym">
  <Elements>
  <CheckoutForm />
  </Elements>
  </StripeProvider>

);


export default Checkout;
