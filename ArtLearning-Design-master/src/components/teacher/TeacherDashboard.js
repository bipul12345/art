import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import Axios from 'axios';
import { Row, Container, Button } from 'reactstrap'

import imageFile from '../assets/courseFile.jpg'

export default class TeacherDashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {},
            config: {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            },
        }
    }

    componentDidMount() {
        Axios.get("http://localhost:3001/users/myProfile", this.state.config)
            .then((response) => {
                console.log(response.data);
                this.setState({
                    user: response.data,
                    isLoggedIn: true,

                });
            })
            .catch((err) => console.log(err.response));

    }
    handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        // alert("Logout Successfull");
        this.props.history.push('/login')
    }
    render() {
        if (this.state.user.role === 'student') {
            return <Redirect to='/' />
        }
        return (
            <div >
                <div className="dashboard_container">

                    <h6 className="mb-3 mt-3 text-muted text-center"> Teacher's Dashboard </h6>

                    <Container className="dashboard_btn_container">
                        <Row>
                            <Link className="col-lg-3 col-md-4 shadow p-3 mb-5 rounded bg-success text-dark mt-3 mb-3 pt-3 pb-3 controls nounderline"
                                to="/viewMyCourses" style={{ width: '22rem' }}>
                                <h4 className="text-center"><img style={{ width: "200px" }} src={require('../assets/courseFile.jpg')}
                                    alt="sportlogo" /></h4>
                                <h4 className="text-center">My Courses</h4>
                                <p className="text-center"><small>View courses infos...</small></p>
                            </Link>
                            <span className="col-lg-1 col-md-4"></span>
                            <Link to='/login'><Button color="dark" style={{ margin: '10px' }} onClick={this.handleLogout}>Logout</Button></Link>
                        </Row>
                    </Container>
                </div>
            </div>
        )
    }
}
