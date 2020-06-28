import React, { Component } from "react";
import "./App.css";
import banner from '../assets/img/banner.jpg';
import { Button,Container, Box, Heading, Card, Image, Text,SearchField } from "gestalt";
import { Link } from "react-router-dom"; 
import Strapi from 'strapi-sdk-javascript/build/main';
import Navbar from './Navbar.js';
import HashLoader from "react-spinners/HashLoader";
import Additon from './Additon';



const apiUrl='https://strapi-mangodb.herokuapp.com' ; //|| process.env.API_URL || 'http://localhost:1337'  
const strapi =new Strapi(apiUrl);



class App extends Component {

  state={
    limit: 4,
    brands :[],
    searchTerm : "",
    loading : true
  };
  
 

async componentDidMount()
{
  try{
    const response = await strapi.request('POST','/graphql',{
      data:{
        query : `query
        {
        brands{
          _id
          name
          Description
          Image{
             url
          }
        } 
        }`
  
      }
    });
    this.setState({brands : response.data.brands});
    this.setState({loading : false});
    console.log(response);
   console.log(response.data.brands);
  }
  catch (err)
  {
    console.error(err);
  }


}
loadMore=()=>
{

  ///this.setState({limit: this.state.limit+1});
  this.setState((prevState) => {
    return { limit: prevState.limit + 1 }
  })
}

handleChange=({value})=>
{

  this.setState({searchTerm: value});
}
filteredBrands = ({searchTerm,brands}) => {
 return brands.filter(brand =>{
   return (
  ( brand.name.toLowerCase().includes(searchTerm.toLowerCase())  )  
                          ||
  ( brand.Description.toLowerCase().includes(searchTerm.toLowerCase()) )
   );
 })
}
changeed=()=>{
  alert("Hello");
}

render() {
  const { brands } = this.state;

  if(this.state.loading===true) {
    return <div style={{display:"flex",justifyContent:"center",alignItems:"center",'margin-top':"250px"}}>  
    <HashLoader
    size={45}
    color={"#000000"}
  />
    </div>

}

  return (
    
   
    <Container>
      {/* Brands Section */}
      <Box
      display="flex" justifyContent="center" marginTop={4} marginBottom={4}
      >
        <SearchField
        id="searchField"
        accessibilityLabel="Brands search"
        onChange={this.handleChange}
        placeholder="Search Shirts,Jeans.."
         />
      </Box>  
      <Box margin={1}>
      <img src={banner} style={{ flex: '1',width: '100%',height: '390px','object-fit':'cover' }} />
      </Box>


      <Box display="flex" justifyContent="center" marginBottom={2} >
        {/* Brands Header */}
       <h1 style={{background: 'linear-gradient(to right ,#FF0000, #6f6f89)','-webkit-background-clip': 'text',
         '-webkit-text-fill-color': 'transparent'}} >Jeans & Shirts </h1> 

      </Box>
      <Box
        dangerouslySetInlineStyle={{
          __style: {
            backgroundColor: "#C8C8C8",
           
          }
        }}
        shape="rounded"
        wrap
        display="flex"
        justifyContent="around"
        onClick={this.changeed}
        marginBottom={5}
        
        
      >
      
    
        {this.filteredBrands(this.state).slice(0,this.state.limit).map(brand => (
          <Box paddingY={4} margin={2} width={200} key={brand._id} >
         
            <Card
              image={
                <Box height={200} width={200}  onClick={this.changeed} >
                  <Image
                    fit="cover"
                    cursor="pointer"
                    alt="Brand"
                    naturalHeight={1}
                    naturalWidth={1}
                    src={`https://res.cloudinary.com/dmof6hlhv/image/upload/v1593185706/${brand.name}.png`}
                    // src={`${apiUrl}${brand.Image[0].url}`}
                     onClick={this.changeed}
                  />
                 
                   
                </Box>
              }
            >
            
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Text bold size="xl">
                  {brand.name}
                </Text>
                <Text  size="m">
                  Sizes : S,M,L <strike style={{opacity:'0.5'}}>XL</strike>
                </Text>
                <Text>{brand.description}</Text>
                
                <Text bold size="xl" color="red">
              
                   <Link to={`/${brand._id}`}>Buy</Link>
                   
                </Text>


                
              </Box>
            </Card>
           
          </Box>
          
        
        ))}
   
       
     
      </Box>
      <Box marginBottom={1}  display="flex" alignItems="center" justifyContent="center" >
        { this.state.limit < this.state.brands.length &&
        <Button inline  color="black" onClick={this.loadMore} text="Load More" />
        }
        </Box>
        <Additon/>
    </Container>
   
  );
}
}

export default App;
