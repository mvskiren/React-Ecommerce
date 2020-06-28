import React, { Component } from 'react';
import Strapi from 'strapi-sdk-javascript/build/main';
import { Box, Heading,Text,Button,Mask,IconButton } from "gestalt";
// import classes from './details.css';
import {calcPrice,getcart,setcart} from '../utils/index';
import { Link,withRouter } from "react-router-dom"; 
import HashLoader from "react-spinners/HashLoader";



const apiUrl='https://strapi-mangodb.herokuapp.com' ; //|| process.env.API_URL || 'http://localhost:1337'
const strapi =new Strapi(apiUrl);



class Details extends Component {
    state={
        price :"",
        Reseller : "",
        details: [],
        checkdetails: [],
        name:"",
        loading: false,
        cartItems: [],

    };
  async componentDidMount()
  {
      try{
        const response =await strapi.request('POST','/graphql',{
            data:{
                query:`
                query{
                    brand (id: "${this.props.match.params.brandId}"){
                      _id
                      name
                    details {
                      _id
                    
                      Image{
                        url
                      }
                      Price
                      Reseller
                    }
                  }
                  }`
    
            }
        });
        this.setState(
            {
                price: response.data.brand.details[0].Price,
                Reseller: response.data.brand.details[0].Reseller,
                details : response.data,
                checkdetails : response.data.brand.details[0],
                name:response.data.brand.name,
                cartItems: getcart()
                
                
            }
        );
        this.setState({loading : true})
        console.log(response);

      }
          catch(err){
              console.error(err);
          }
      
    

  }
  addTocart=()=>
  {
    const alreadyInCart=this.state.cartItems.findIndex(items => items._id===this.state.checkdetails._id);
    if(alreadyInCart===-1){
      const updateCartItems=this.state.cartItems.concat({
        ...this.state.checkdetails,
        quantity:1
      });
      this.setState({cartItems: updateCartItems},()=> setcart(updateCartItems));
    }
    else {
      const updateCartItems=[...this.state.cartItems];
      updateCartItems[alreadyInCart].quantity+=1;
      this.setState({cartItems:updateCartItems},()=> setcart(updateCartItems));
    }

  }
  checkout=() => {
   this.props.history.push("/Checkout");
  }



    render() {
        if(this.state.loading===false) {
            return <div style={{display:"flex",justifyContent:"center",alignItems:"center",'margin-top':"250px"}}>  
            <HashLoader
            size={45}
            color={"#000000"}
          />
            </div>
        
        }
        return (
            <div style={{display: "flex",flexDirection:"column",justifyContent:"center",alignItems:"center",margin:"10px"}}>
              
              <img src={`${apiUrl}${this.state.details.brand.details[0].Image.url}`} alt="product"/>
              <h3>Brand Name: {this.state.name}</h3>
              <h4>Reseller : {this.state.Reseller}</h4>
              <h5>Price :<strong>{this.state.price}/-</strong></h5>
              <Box paddingY={4} margin={2} width={200}>
              <Button  onClick={this.addTocart}text="Add to Cart" color="blue" />
              </Box>

            <Box margin={7} marginLeft={9}>
              <Mask shape="rounded" wash>
                <Box display="flex" direction="column" alignItems="center" padding={9} >
               <h2 style={{background: 'linear-gradient(to right ,#FF0000, #6f6f89)','-webkit-background-clip': 'text',
         '-webkit-text-fill-color': 'transparent'}}>Cart </h2>
                  <Text color="gray" italic>
                    {this.state.cartItems.length} items selected
                  </Text>
                  {this.state.cartItems.map((items,index) =>(
                    <Box key={items._id} display="flex" alignItems="center">
                     <Text>
                     <strong  style={{background: 'linear-gradient(to right ,#FF0000, #6f6f89)','-webkit-background-clip': 'text',
         '-webkit-text-fill-color': 'transparent'}}>Item -{index+1} : </strong>  {this.state.name} *(Qty-{items.quantity}) -${(items.quantity * items.Price).toFixed(2)}
                     </Text>
                     <IconButton
                     icon="cancel"
                     colour="red"
                      />

                   
                    </Box>

                  ))}
                <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                  <Box margin={5}>
                    {this.state.cartItems.length ===0 && (
                      <Text color="red">Cart is Empty</Text>
                    )}
                  </Box>
                  <Box margin={3}>
                  <Text size="lg">Total {calcPrice(this.state.cartItems)}</Text>
                 </Box>
                  <Button text="Checkout" inline onClick={this.checkout}/> 
                 
                </Box>
                </Box>
              </Mask>
            </Box>

            </div>
        )
    }
}
export default withRouter(Details);