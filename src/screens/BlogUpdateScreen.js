import React, {useState, useEffect} from 'react'
import Navbar from '../components/Navbar/Navbar'
import FormContainer from '../components/FormContainer'
import {Form, Button} from 'react-bootstrap'
import {toast, ToastContainer} from 'react-toastify'
import { useParams } from 'react-router-dom'
import {doc,getDoc,updateDoc,serverTimestamp} from 'firebase/firestore'
import {db, storage} from '../firebase'
import {v4 as uuidv4} from 'uuid'
import {ref, uploadBytes, getDownloadURL}from 'firebase/storage'


const BlogUpdateScreen = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [thumbnail, setThumbnail] = useState('');
  const [file, setFile] = useState(null)
  const[blogData, setBlogData] = useState({})

  const {id} = useParams();


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

            setTitle(docSnap.data().title);
            setDescription(docSnap.data().description)
            setBody(docSnap.data().body)
            
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


    useEffect(()=> {
        fetchData();
    }, [])

    useEffect(()=> {

    }, [blogData,title,description,body])


  const updateHandler = async (e) => {
    e.preventDefault();

    if(!localStorage.getItem('user')) {
        toast("To update a blog, please Sign In");
        return;
    }

    try {
        const docRef = doc(db, "blogs", id);
        const imageID = uuidv4();
        let imagePath='';
        let imageUrl = blogData.data.img;
        if(file) {
          const fileType = file.type.substring(6);
          //console.log(fileType)
          const storageRef = ref(storage, `/images/${imageID}.${fileType}`)
          await uploadBytes(storageRef, file).then((snapshot) => {
            imagePath = snapshot.metadata.fullPath;
          });
          imageUrl = await getDownloadURL(ref(storage, imagePath))
        }
        
        await updateDoc(docRef, {
          title,
          description,
          body,
          img: imageUrl,
          timestamp: serverTimestamp()
        })
        toast("Blog Updated!!", {autoClose: 5000})
      } catch (error) {
        console.log(error.message)
          toast("Error while updating blog, try again!")
      }

  }

  return (
    <>
        <Navbar />
        <ToastContainer />
        <FormContainer>
        <Form onSubmit={updateHandler}>
          <Form.Group controlId="title" className="my-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required={true}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="desc" className="my-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={true}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="body" className="my-3">
            <Form.Label>Body</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              placeholder="Enter Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required={true}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="image" className="my-3">
            <Form.Label>Update Thumbnail</Form.Label>
            <Form.Control
              type="file"
              value={thumbnail}
              accept="image/jpeg, image/png"
              onChange={e => {
                setThumbnail(e.target.value);
                setFile(e.target.files[0])
              }}
            ></Form.Control>  
          </Form.Group>

          

          <Button variant="primary" className="my-3" type="submit">
            Submit Blog
          </Button>
        </Form>
        </FormContainer>
    </>
  )
}

export default BlogUpdateScreen