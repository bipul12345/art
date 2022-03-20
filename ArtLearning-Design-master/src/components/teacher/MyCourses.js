import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import Axios from 'axios';
import { Button, Container } from 'reactstrap';

export default class MyCourses extends Component {
    constructor(props) {
        super(props)

        this.state = {
            image: '',
            title: '',
            detail: '',
            price: '',
            owner: '',
            medium: '',
            courseType: '',

            courses: [],

            user: {},
            config: {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            },
        }
    }

    componentDidMount() {
        Axios.get("http://localhost:3001/courses/myCourses", this.state.config)
            .then((response) => {
                console.log(response.data);
                this.setState({
                    courses: response.data,
                });
            }).catch((err) => console.log(err.response));


        Axios.get("http://localhost:3001/users/myProfile", this.state.config)
            .then((response) => {
                console.log(response.data);
                this.setState({
                    user: response.data,
                    isLoggedIn: true,
                });
            }).catch((err) => console.log(err.response));
    }

    removeCourses = (courseId) => {
        Axios.delete(`http://localhost:3001/courses/${courseId}`, this.state.config)
            .then((response) => {
                alert("Course removed.")
                const filteredItemslist = this.state.courses.filter((courses) => {
                    return courses._id !== courseId
                })
                this.setState({
                    courses: filteredItemslist
                })
            }).catch((err) => console.log(err.response));
    }

    render() {
        if (this.state.user.role === 'student') {
            return <Redirect to='/' />
        }

        return (
            <div >
                <Container>
                    <h2 style={{ margin: '20px 0px 0px 0px' }}>My Courses </h2>

                    <Link to={`/addCourse`}>
                        <Button color="primary" style={{ margin: '-40px 60px 0px 60px', float: 'right' }}>Add New Courses</Button>
                    </Link>
                    <hr></hr>
                </Container>
                <div className='table'>
                    <table className='table' style={{ width: '98%', margin: '25px auto' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Image</th>
                                <th scope="col">Title</th>
                                <th scope="col" style={{ width: '22%' }}>Detail</th>
                                <th scope="col">Type</th>
                                <th scope="col" >Medium</th>
                                <th scope="col" style={{ width: '6%' }}>Price</th>
                                <th scope="col">Edit</th>
                                <th scope="col">Resources</th>
                                <th scope="col">Enrollment</th>
                                <th scope="col">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.courses.map((courses) => {
                                    return (
                                        <tr key={courses._id}>
                                            <th>
                                                <img className='img-container '
                                                    width='200px' src={`http://localhost:3001/uploads/${courses.image}`}
                                                    alt="profile" />
                                            </th>
                                            <td>
                                                {courses.title}
                                            </td>
                                            <td>
                                                {courses.detail}
                                            </td>
                                            <td>
                                                {courses.courseType}
                                            </td>
                                            <td>
                                                {courses.medium}
                                            </td>
                                            <td>
                                                Rs. {courses.price}
                                            </td>
                                            <td>
                                                <Link to={`/editCourse/${courses._id}`}>
                                                    <Button color='primary' block >Edit</Button>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to={`/addResource/${courses._id}`}>
                                                    <Button color='success' block >Add</Button>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to={`/viewEnrollments/${courses._id}`}>
                                                    <Button color='warning' block >Enrollment</Button>
                                                </Link>
                                            </td>
                                            <td>
                                                <Button color='danger' block onClick={() => this.removeCourses(courses._id)}>Remove</Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
