import React, {useState} from 'react'
import {Navbar, Container, Nav,Button} from 'react-bootstrap'
import {auth} from '../../firebase'
import {ToastContainer, toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'


const NavBar = () => {

  const [localUser, setLocalUser] = useState(localStorage.getItem('user'));
  const navigate = useNavigate()

  const logoutHandler = async()=> {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      setLocalUser(null);
      navigate('/')
    } catch (error) {
      toast("Problem logging out.", {autoClose: 2000})
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <ToastContainer />
      <Container>
        <Navbar.Brand href="/">Blogger</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {localStorage.getItem('user') && (<Nav.Link href="/create">Create</Nav.Link>)}
            {localStorage.getItem('user') && (<Nav.Link href="/about">About</Nav.Link>)}
          </Nav>
          <Nav>
            {
              localUser!==null ? (
                <Button className='btn btn-primary' onClick={logoutHandler}>Logout</Button>
              ) : (
                <Nav.Link href="/login">Login</Nav.Link>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar