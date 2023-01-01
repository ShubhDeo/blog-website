import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { db } from "../firebase";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { Card, Button, Container, Col, Row,Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const [blogData, setBlogData] = useState([]);
  const navigate = useNavigate();
  const [queryData, setQueryData] = useState('')


  const fetchBlogs = async (tempQueryData='') => {
    const blogsRef = collection(db, "blogs");
    let q;
    if(tempQueryData.length === 0) {
      q = query(
        blogsRef,
        where(
          "publish",
          "==",
          true
        )
      );
    }else {
      q = query(
        blogsRef,
        where(
          "publish",
          "==",
          true
        ),where(
          "title",
          "==",
          tempQueryData
        )
      );
    }

    const querySnapshot = await getDocs(q);
    let tempData = [];
    querySnapshot.forEach((doc) => {
      tempData.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setBlogData(tempData);
  };


  useEffect(() => {
    fetchBlogs();
  }, []);

  const submitHandler = ()=> {
    if(queryData.length > 0) {
      fetchBlogs(queryData)
    }
  }

  return (
    <>
      <Navbar />
      <Container className='my-5'>
      <Form onSubmit={submitHandler} className='mx-2 mb-5' style={{width: '40%'}}>
                <Form.Group controlId="query" className="my-3" style={{display: 'block'}}>
                  <Form.Control
                    type="text"
                    
                    placeholder="Search query"
                    value={queryData}
                    onChange={(e) => setQueryData(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button onClick={submitHandler}>Search</Button>
        </Form>
        <Row>
        {blogData.map((doc) => (
          <Col key={doc.id} xs={12} md={4} lg={3} className='mx-2'>
            <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src={doc.data.img}/>
            <Card.Body>
              <Card.Title>{doc.data.title}</Card.Title>
              <Card.Text></Card.Text>
              <Card.Text>{doc.data.description}</Card.Text>
              <Button variant="primary" onClick={()=>{navigate(`/blog/${doc.id}`)}}>Read Full blog</Button>
            </Card.Body>
          </Card>
          </Col>
        ))}
        </Row>
      </Container>
    </>
  );
};

export default HomeScreen;
