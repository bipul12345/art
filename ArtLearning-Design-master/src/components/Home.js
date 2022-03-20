import React, { Component } from 'react'

import { Container, CardColumns, Card, CardImg, CardBody, CardTitle, Button } from 'reactstrap'
import { Link } from 'react-router-dom';
import Axios from 'axios'
export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            courses: [],
            user: {},
            config: {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            },
            isLoggedIn: false
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:3001/courses', this.state.config)
            .then((response) => {
                const data = response.data;
                this.setState({ courses: data });
                console.log(response.data);
            }).catch(error => console.log(error.response));

        Axios.get('http://localhost:3001/users/myProfile', this.state.config)
            .then((response) => {
                console.log(response.data)
                this.setState({
                    user: response.data,
                    isLoggedIn: true
                })
            })
            .catch((err) => console.log(err.response));
    }

    handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        // alert("Logout Successfull");
        this.props.history.push('/login')
    }

    postEnrollment = (courseId, by) => {
        Axios.post(`http://localhost:3001/enroll`,
            {
                course: courseId,
                student: this.state.user._id,
                by: by
            }, this.state.config)
            .then((response) => {
                alert("your enrollment has been sent, Please wait for approval!")
                console.log(response);
            }).catch((err) => console.log(err.response));

    }

    render() {
        if (localStorage.getItem('token')) {
            return (
                <div>
                    <h1>
                        Welcome "{this.state.user.fullName}"
                    </h1>
                    <Link to='/login'><Button color="dark" style={{ margin: '10px' }} onClick={this.handleLogout}>Logout</Button></Link>
                    <Link to='/myEnrollments'><Button color="dark" style={{ margin: '10px' }}>My Enrollments</Button></Link>
                    <Link to='/communityForum'><Button color="dark" style={{ margin: '10px' }}>Community Forum</Button></Link>
                    <CardColumns>
                        {this.state.courses.map((courses =>
                            <Card key={courses._id}>
                                <CardImg className="cardimg" top width="70%" height="280px" src={`http://localhost:3001/uploads/${courses.image}`} alt="Card_image" />
                                <CardBody>
                                    <CardTitle className="cardtitle">{courses.title}</CardTitle>
                                    <CardTitle className="cardtitle">Rs: {courses.price}</CardTitle>
                                    <CardTitle className="cardtitle">MEDIUM: {courses.medium}</CardTitle>
                                    <CardTitle className="cardtitle">TYPE: {courses.courseType}</CardTitle>
                                    <CardTitle className="cardtitle">TUTOR: {courses.owner.fullName}</CardTitle>
                                    <hr></hr>

                                    <Link to={`/courseDetails/${courses._id}`}>
                                        <Button color="primary" > More Details</Button>
                                    </Link>
                                    {courses.courseType === 'Free' ? (<Button color="danger" style={{ margin: '5px' }} disabled>Enroll Now</Button>) :
                                        <Button color="danger" style={{ margin: '5px' }} onClick={() => this.postEnrollment(courses._id, courses.owner.fullName)}>Enroll Now</Button>}
                                </CardBody>
                            </Card>
                        ))}
                    </CardColumns>
                </div>
            )
        }
        else {
            return (
                <div>
                    <h1>
                        Welcome "{this.state.user.fullName}"
                        </h1>
                    <Link to='/login'><Button color="dark" style={{ margin: '10px' }} onClick={this.handleLogout}>Logout</Button></Link>
                    <Link to='/myEnrollments'><Button color="dark" style={{ margin: '10px' }}>My Enrollments</Button></Link>
                    <Link to='/communityForum'><Button color="dark" style={{ margin: '10px' }}>Community Forum</Button></Link>
                    <CardColumns>
                        {this.state.courses.map((courses =>
                            <Card key={courses._id}>
                                <CardImg className="cardimg" top width="70%" height="280px" src={`http://localhost:3001/uploads/${courses.image}`} alt="Card_image" />
                                <CardBody>
                                    <CardTitle className="cardtitle">{courses.title}</CardTitle>
                                    <CardTitle className="cardtitle">Rs: {courses.price}</CardTitle>
                                    <CardTitle className="cardtitle">MEDIUM: {courses.medium}</CardTitle>
                                    <CardTitle className="cardtitle">TYPE: {courses.courseType}</CardTitle>
                                    <CardTitle className="cardtitle">TUTOR: {courses.owner.fullName}</CardTitle>
                                    <hr></hr>

                                    <Link to={`/courseDetails/${courses._id}`}>
                                        <Button color="primary" > More Details</Button>
                                    </Link>
                                    {courses.courseType === 'Free' ? (<Button color="danger" style={{ margin: '5px' }} disabled>Enroll Now</Button>) :
                                        <Link to='/login'>
                                            <Button color="danger" style={{ margin: '5px' }} onClick={() => this.postEnrollment(courses._id, courses.owner.fullName)}>Enroll Now</Button></Link>}

                                </CardBody>
                            </Card>
                        ))}
                    </CardColumns>
                </div>
            )
        }

    }
}
