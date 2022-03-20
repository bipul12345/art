import React, { Component } from 'react'
import Axios from 'axios'
import { Container, Button } from 'reactstrap'
import { Link } from 'react-router-dom';

export default class MyEnrollment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            myEnrollments: [],
            user: {},
            config: {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            },
            isLoggedIn: false
        }
    }
    componentDidMount() {
        Axios.get('http://localhost:3001/enroll/myEnrollment/', this.state.config)
            .then((response) => {
                const data = response.data;
                this.setState({ myEnrollments: data });
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

    cancelEnrollment = (enrollId) => {
        Axios.delete(`http://localhost:3001/enroll/${enrollId}`, this.state.config)
            .then((response) => {
                alert("Your Enrollment has been removed");
                const filteredEnrollList = this.state.myEnrollments.filter((myEnrollments) => {
                    return myEnrollments._id !== enrollId;
                });
                this.setState({
                    myEnrollments: filteredEnrollList
                })

            }).catch((err) => console.log(err.response));
    }

    render() {
        return (
            <div>
                <Container >
                    <h1>
                        My Enrollment List
                    </h1>
                    <table className='table'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>Cover Page</th>
                                <th>Course Title</th>
                                <th>Owned By</th>
                                <th>Status</th>
                                <th>Contents</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.myEnrollments.map((myEnrollments) => {
                                return (
                                    <tr key={myEnrollments._id}>
                                        <td>
                                            <img className='img-container '
                                                width='200px' src={`http://localhost:3001/uploads/${myEnrollments.course.image}`}
                                                alt="profile" />
                                        </td>
                                        <td>{myEnrollments.course.title}</td>
                                        <td>{myEnrollments.by}</td>
                                        <td>
                                            {myEnrollments.status === "Not-Approved" ? (<Button color='warning' disabled>{myEnrollments.status}</Button>)
                                                : <Button color='success' disabled>{myEnrollments.status}</Button>}
                                        </td>
                                        <td>
                                            <Link to={`/viewResources/${myEnrollments.course._id}`}>
                                                {myEnrollments.status === "Not-Approved" ? (<Button color='primary' disabled>View Resources</Button>)
                                                    : <Button color='primary' >View Resources</Button>}
                                            </Link>

                                        </td>
                                        <td><Button color='danger' onClick={() => this.cancelEnrollment(myEnrollments._id)} >Remove</Button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Container>
            </div>
        )
    }
}
