import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row,Col,Card } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Navbar from "../components/Navbar/Navbar";
import { auth, db } from "../firebase";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {FaTrashAlt, FaEdit} from 'react-icons/fa'
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AboutScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("");
  const [blogs, setBlogs] = useState([]);

  const navigate = useNavigate();

  const fetchBlogs = async () => {
    const blogsRef = collection(db, "blogs");
    const q = query(
      blogsRef,
      where(
        "userId",
        "==",
        `user/${JSON.parse(localStorage.getItem("user")).uid}`
      )
    );

    const querySnapshot = await getDocs(q);
    let tempData = [];
    querySnapshot.forEach((doc) => {
      tempData.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setBlogs(tempData);
  };

  const fetchData = async () => {
    //console.log("hello")
     try {
        
        onAuthStateChanged(auth, async (user) => {
          if(user) {
            const docRef = doc(
              db,
              "user",
              JSON.parse(localStorage.getItem("user")).uid
            );
            const docSnap = await getDoc(docRef);
  
            if(docSnap.exists()) {
              setEmail(docSnap.data().email);
              setPassword(docSnap.data().password);
              setConfirmPassword(docSnap.data().password)
              setUsername(docSnap.data().username);
            }
          }
        })

     } catch (error) {
       toast("Error in fetching data, try again!")
     }
  };

  useEffect(() => {
    fetchData();
    fetchBlogs();
  }, []);

  useEffect(()=> {
    //console.log(email, username)
  }, [email, username,password,confirmPassword])

  const submitHandler = async (e) => {
    e.preventDefault();

    if(password.length < 6) {
      toast("Password must be atleast 6 characters.", {autoClose: 5000})
    }
    else if(confirmPassword!==password) {
      toast("Password not matched!!", {autoClose: 5000})
    }else {
      try {
        onAuthStateChanged(auth, async (user) => {
          if(user) {
            const docRef = doc(
              db,
              "user",
              user.uid
            );
            
            await updateDoc(docRef, {
                username,
                password,
                email
            })
            toast("Information Updated!!", {autoClose: 5000})
            
  
          }else {
            toast("Login to perform actions!!", {autoClose: 5000})
          }
        })
  
     } catch (error) {
       toast("Error in fetching data, try again!")
     }
    }

    
  };

  const handlePublish = async (blogID, publish) => {
     try {
      const blogRef = doc(db, "blogs", blogID)

      await updateDoc(blogRef, {
        publish: !publish
      })

      fetchBlogs();
     } catch (error) {
        toast("Error while updating result.")
     }

  }

  const updateHandler = (blogID) => {
    navigate(`/blog/update/${blogID}`)
  }

  const deleteHandler = async (blogID) => {
    console.log("delete")

    try {
      await deleteDoc(doc(db, "blogs", blogID));
      const fetchBlogs = async () => {
        const blogsRef = collection(db, "blogs");
        const q = query(
          blogsRef,
          where(
            "userId",
            "==",
            `user/${JSON.parse(localStorage.getItem("user")).uid}`
          )
        );
  
        const querySnapshot = await getDocs(q);
        let tempData = [];
        querySnapshot.forEach((doc) => {
          tempData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setBlogs(tempData);
      };
      fetchBlogs();
    } catch (error) {
      toast("Error occured while deleting blog")
    }

  }


  return (
    <>
      <Navbar />
      <Container className="my-5">
        {!localStorage.getItem("user") ? (
          <h2>Login First</h2>
        ) : (
          <>
            <h2>About</h2>
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
                    onChange={(e) => setUsername(e.target.value)}
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
                <Form.Group controlId="password" className="my-3">
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
                  Update Profile
                </Button>
              </Form>
            </FormContainer>
            <h2>My Blogs</h2>
            <Row className='my-5'>
              {blogs.map((doc) => (
                <Col key={doc.id} xs={12} md={4} lg={3} className="mx-2">
                  <Card style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={doc.data.img} />
                    <Card.Body>
                      <Card.Title>{doc.data.title}</Card.Title>
                      <Card.Text></Card.Text>
                      <Card.Text>{doc.data.description}</Card.Text>
                      <FaEdit size={'2em'} color='black' style={{marginRight: '15px', cursor: 'pointer'}} onClick={() => {updateHandler(doc.id)}}/> 
                      <FaTrashAlt size={'2em'} color={'red'} style={{cursor: 'pointer', marginRight: '15px'}} onClick={() => {deleteHandler(doc.id)}}/>
                      {doc.data.publish ? (<Button className='btn btn-danger btn-sm' onClick={() => {handlePublish(doc.id,true)}}>Unpublish</Button>) : (
                        <Button className='btn btn-success btn-sm' onClick={() => {handlePublish(doc.id,false)}}>Publish</Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default AboutScreen;
