import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Form, Button, Row, Col } from "react-bootstrap";
import CustomFormContainer from "../components/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import {auth} from '../firebase'
import {ToastContainer, toast} from 'react-toastify'
import { signInWithEmailAndPassword } from "firebase/auth";



const HomeScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const signIn = async()=> {
      try {
        const {user} = await signInWithEmailAndPassword(auth,email,password);
        setEmail('');
        setPassword('')
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email
        }));
        navigate('/')
      } catch (error) {
        toast("Invalid credentials", {autoClose: 2000})
      }
    }

    signIn();

  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <CustomFormContainer>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            ></Form.Control>
          </Form.Group>
          <Button variant="primary" className="my-3" type="submit">
            Log In
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            New user ? <Link to={"/signup"}>Register</Link>
          </Col>
        </Row>
      </CustomFormContainer>
    </>
  );
};

export default HomeScreen;
