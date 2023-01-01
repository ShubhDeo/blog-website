import React, { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Navbar/Navbar'
import {useParams} from 'react-router-dom'
import {arrayUnion, doc, getDoc, updateDoc, addDoc,collection, serverTimestamp,query, where, getDocs} from 'firebase/firestore'
import {toast, ToastContainer} from 'react-toastify'
import {db} from '../firebase'
import {Container} from 'react-bootstrap'
import {FaHeart} from 'react-icons/fa'
import {Button, Form, Row, Col} from 'react-bootstrap'

const BlogScreen = () => {
    const {id} = useParams();
    const [blogData,setBlogData] = useState()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const [toggleForm, setToggleForm] = useState(false);
    const [comment, setComment] = useState("");

    const [commentsData, setCommentsData] = useState([])

    const liked = useRef();

    const handleComment = async (e) => {
        e.preventDefault();

        if(!localStorage.getItem('user')) {
            toast("Sign In to comment on blog.")
        }else {
            
            try {
                const uid = JSON.parse(localStorage.getItem('user')).uid;
                const docRef = doc(db, "user", uid);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()) {
                    await addDoc(collection(db, "comments"), {
                        username: docSnap.data().username,
                        body: comment,
                        blogId: id,
                        timestamp: serverTimestamp()
                    })
                    fetchComments()
                    toast("Comment added.")
                    setComment("")
                    setToggleForm(false)
                }else {
                    console.log("uid not found.")
                    toast("Error occured, try again!")
                }

            } catch (error) {
                console.log(error.message)
                toast("Error occured, try again!")
            }

        }

    }

    const handleLike = async () => {
        if(!localStorage.getItem('user')) {
            toast("To like a blog, first Log In")
        }else if(!liked.current){
            try {
                const uid = JSON.parse(localStorage.getItem('user')).uid;
                const docRef = doc(db, "blogs", id);
                console.log(uid)

                await updateDoc(docRef, {
                    likes: arrayUnion(`${uid}`)
                })
                fetchData();
                console.log("success")
            } catch (error) {
                toast("Error occured.")
                console.log(error.message)
            }

        }
    }


    const fetchData = async () => {
        try {
            const docRef = doc(db, "blogs", id);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                const authorId = docSnap.data().userId.substring(5);
                const authorRef = doc(db, "user", authorId)
                const authorSnap = await getDoc(authorRef)
                let tempAuthor = 'Anonymous';

                if(authorSnap.exists()) {
                    tempAuthor = authorSnap.data().username
                }
                
                if(localStorage.getItem('user')) {
                    docSnap.data().likes.forEach(l => {
                        if(l===JSON.parse(localStorage.getItem('user')).uid) {
                            liked.current = true;
                        }
                    })
                }
                
                setBlogData({
                    id: docSnap.id,
                    data: {
                        ...docSnap.data(),
                        author: tempAuthor,
                        date: docSnap.data().timestamp.toDate()
                    }
                })
            }else {
                toast("Error loading blog, try again!")
            }
        } catch (error) {
            toast("Error loading blog, try again!")
        }
    }

    const fetchComments = async ()=> {
        const q = query(collection(db, "comments"), where("blogId", "==", id));

        const querySnapshot = await getDocs(q);
        let tempComments = []
        querySnapshot.forEach((doc) => {
            tempComments.push({
                id: doc.id,
                username: doc.data().username,
                body: doc.data().body,
                date: doc.data().timestamp.toDate()
            })
        });
        setCommentsData(tempComments);
    }

    useEffect(()=> {
        liked.current=false;
        fetchData();
        fetchComments();
    }, [])

    useEffect(()=> {
        console.log(commentsData)
    }, [blogData, commentsData])

  return (
    <>
        <Navbar />
        <ToastContainer />
        {blogData && (
            <Container className='my-5'>
                <h5 className='text-muted pb-2'>{blogData.data.author}</h5>
                <h5 className='text-muted pb-2'>{`${blogData.data.date.getDate()} ${months[blogData.data.date.getMonth()]} ${blogData.data.date.getFullYear()}`}</h5>
                <h1 className='text-center py-3'>{blogData.data.title}</h1>
                <h5 className='text-muted pb-2'>{blogData.data.description}</h5>
                <img src={blogData.data.img} alt="blog-img" style={{display: 'block',margin: '15px auto', width: '50%'}}/>
                <p>{blogData.data.body}</p>

                <Row>
                    <Col xs={12} lg={6} className='mr-5 mb-5'>
                        <Button className='btn btn-primary btn-outline ' onClick={handleLike}><FaHeart color={liked.current ? 'red' : 'white'} /> {`${blogData.data.likes.length} `} Likes</Button>
                        <Button className='btn btn-primary' style={{marginLeft: '10px'}} onClick={()=> {
                            setToggleForm(!toggleForm);
                        }}>Add Comment</Button>

                        {
                            toggleForm && (
                                <Form onSubmit={handleComment}>
                                    <Form.Group controlId="comment" className="my-3">
                        `               <Form.Label>Comment</Form.Label>
                                        <Form.Control
                                        type="text"
                                        placeholder="Enter Comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required={true}
                                        ></Form.Control>
                                    </Form.Group>
                                    <Button type="submit">Submit</Button>
                                </Form>
                            )
                        }
                    </Col>
                    <Col xs={12} lg={6}>
                        <h3 className='mb-5'>Comments</h3>
                        {commentsData.map( c => (
                            <div key={c.id} className='mb-2'>
                                <h5 style={{fontSize: '15px'}}>{c.username}</h5>
                                <p className='text-muted' style={{fontSize: '10px', marginBottom: '0.5rem'}}>{`${c.date.getDate()} ${months[c.date.getMonth()]} ${c.date.getFullYear()}`}</p>
                                <p className='text-muted' style={{fontSize: '15px'}}>{c.body}</p>
                                <hr />
                            </div>
                        ))}
                    </Col>
                </Row>

            </Container>
        )}
    </>
  )
}

export default BlogScreen