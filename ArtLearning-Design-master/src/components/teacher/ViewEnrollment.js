import React, { Component } from 'react'
import Axios from 'axios'
import { Container, Button } from 'reactstrap'
import { Link } from 'react-router-dom';

export default class ViewEnrollment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            enrollments: [],
            user: {},
            config: {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            },
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:3001/enroll/enrollmentOf/' + (this.props.match.params.id), this.state.config)
            .then((response) => {
                const data = response.data;
                this.setState({ enrollments: data });
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

    approveEnrollment = (enrollmentId) => {
        Axios.put(`http://localhost:3001/enroll/${enrollmentId}`, {
            ...this.state.enrollments, status: "Approved"
        }, this.state.config)
            .then((response) => {
                console.log(response.data)
                window.location.reload(false);
            }).catch((err) => console.log(err.response))
    }

    removeEnrollments = (enrollmentId) => {
        Axios.delete(`http://localhost:3001/enroll/${enrollmentId}`, this.state.config)
            .then((response) => {
                alert("Enrollment has been removed.");
                const filteredEnrolllist = this.state.enrollments.filter((enrollments) => {
                    return enrollments._id !== enrollmentId;
                });
                this.setState({
                    enrollments: filteredEnrolllist,
                });
            })
            .catch((err) => console.log(err.response));
    }


    render() {
        return (
            <div>
                <Container>
                    <table className='table'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>Course</th>
                                <th>Student Name</th>
                                <th>Status</th>
                                <th>Verify</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.enrollments.map((enrollments) => {
                                return (
                                    <tr key={enrollments._id}>
                                        <td>{enrollments.course.title}</td>
                                        <td>{enrollments.student.fullName}</td>
                                        <td>
                                            {enrollments.status === "Not-Approved" ? (<Button color='warning' disabled>{enrollments.status}</Button>)
                                                : <Button color='success' disabled>{enrollments.status}</Button>}
                                        </td>
                                        <td>
                                            {enrollments.status === "Not-Approved" ? (<Button color='primary' onClick={() => this.approveEnrollment(enrollments._id)}>Approve</Button>)
                                                : <Button color='primary' disabled>Approved</Button>}

                                        </td>
                                        <td><Button color='danger' onClick={() => this.removeEnrollments(enrollments._id)}>Remove</Button></td>
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
