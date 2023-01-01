import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { Link } from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {auth,db} from '../firebase'
import {createUserWithEmailAndPassword,deleteUser  } from 'firebase/auth'
import {doc, setDoc} from 'firebase/firestore'
import { useNavigate } from "react-router-dom";




const HomeScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUserName] = useState("");

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    //console.log(crypto.randomBytes(16).toString('hex'))
    if(password!==confirmPassword) {
      toast("Password not matching.", {autoClose: 2000})
    }else if(password.length < 6) {
      toast("Password length must be atleast 6 characters.", {autoClose: 2000})
    }

    const addUser = async () => {
       try {
          const {user} = await createUserWithEmailAndPassword(auth,email,password);

          // const salt = bcrypt.genSaltSync(16);
          // const hashedPassword = bcrypt.hashSync(password, salt);
          // console.log(hashedPassword)

          await setDoc(doc(db, "user", user.uid), {
            username,
            email,
            password
          })
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setUserName("");
          localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email
          }));
          navigate("/")
       } catch (error) {
          await deleteUser(auth.currentUser);
          console.log(error.message)
          toast('Error adding user.', {autoClose: 2000})
       }
    }
    addUser();
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <FormContainer>
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
          <Form.Group controlId="username" className="my-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
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
          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={true}
            ></Form.Control>
          </Form.Group>

          <Button variant="primary" className="my-3" type="submit">
            Sign Up
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            Already a user ? <Link to={"/login"}>Login</Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default HomeScreen;
