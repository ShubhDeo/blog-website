import React, {useState} from 'react'
import Navbar from '../components/Navbar/Navbar'
import CustomFormContainer from '../components/FormContainer'
import {Form, Button} from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import {storage, db} from '../firebase'
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {addDoc, collection, serverTimestamp, updateDoc} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';



const CreateScreen = () => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [thumbnail, setThumbnail] = useState('');
  const [file, setFile] = useState(null)

  //const [loading, setLoading] = useState(false)

  
  const submitHandler = async (e)=> {
    e.preventDefault();
    //console.log("hellp")
    if(!localStorage.getItem('user')) {
      toast("To create a blog, please Sign In");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "blogs"), {
        timestamp: serverTimestamp()
      });
      //console.log(docRef);
      const imageID = uuidv4();
      let imagePath='';
      let imageUrl = '';
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
        publish: false,
        likes: [],
        userId: `user/${JSON.parse(localStorage.getItem('user')).uid}`,
        timestamp: serverTimestamp()
      })
      toast("Blog Created!!, to publish the blog go to about section", {autoClose: 5000})
      setTitle("")
      setDescription("")
      setBody("")
      setThumbnail(null)
    } catch (error) {
        toast("Error while creating blog, try again!")
    }

  }

  return (
    <>
      <Navbar />
      <ToastContainer />
      <CustomFormContainer>
      <Form onSubmit={submitHandler}>
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
            <Form.Label>Thumbnail</Form.Label>
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
      </CustomFormContainer>
    </>
  )
}

export default CreateScreen