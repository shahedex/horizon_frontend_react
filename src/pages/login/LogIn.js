import React, {Component} from 'react';
import {Button, Container, Form, Grid, Header, Segment,Card} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import LogInApi from '../../api/authApi';
import { Redirect} from "react-router-dom";
import axios from 'axios';

class LogIn extends Component{

    constructor(props){
        super(props);

        this.state = {
            formLoading: false,
            email: '',
            password: '',
            error: false,
            errorMessage: '',
            loggedIn: false
        };

        this.handleChange = (event, {name,value}) =>{

            this.setState({
                [name]: value
            })
        };

        this.onFormSubmit = ()=>{
            const data = {
                email : this.state.email,
                password: this.state.password
            };
            //console.log(data);
            this.setState({formLoading: true});
            //LogInApi.userLogin(data, this.formSubmitCallBack);
            const postData = {
                "email": data.email,
                "password": data.password
            }
            axios.post('http://127.0.0.1:5000/api/login', postData).then(response => {
                this.setState({formLoading:false});
                if(response.status != 200){
                    console.log(response.data);
                }
                else{
                    console.log(response.data.scopedToken);
                    localStorage.setItem("projectID", response.data.projectID);
                    localStorage.setItem("scopedToken", response.data.scopedToken);
                    this.setState({loggedIn: true});
                }
            }).catch(err => {
                console.log(err);
            });
        };
    }

    render(){
        const {email,password,error,errorMessage,loggedIn} = this.state ;
        return(
            loggedIn ?
                <Redirect to={"/console/overview"}/> :
                (
                    <Grid textAlign='center'  verticalAlign='middle'>
                        <Grid.Column style={{ maxWidth: 450 }}>

                        <Header as={"h1"} textAlign={"center"} color="blue" style={{paddingTop: 100}}>Login</Header>
                        {
                            error ?
                                <Segment inverted color='red' textAlign={"center"}>
                                    {errorMessage}
                                </Segment>
                                : null
                        }

                            <Form size={"large"} loading={this.state.formLoading} onSubmit={this.onFormSubmit}>
                                <Form.Input required label='Email' name={"email"} value={email}
                                            fluid
                                            icon="user"
                                            iconPosition='left'
                                            placeholder='Enter Your Email'
                                            onChange={this.handleChange} style={{width: 400}}/>
                                <Form.Input required type="password" label='Password' name={"password"} value={password}
                                            fluid
                                            icon="lock"
                                            iconPosition='left'
                                            placeholder="Enter Password" onChange={this.handleChange} style={{width: 400}}/>
                                <Button fluid color="blue">Login</Button>

                            </Form>

                        </Grid.Column>
                    </Grid>

        )
        );
    }
}

export default LogIn;
