import React, { Component } from 'react'
import Axios from 'axios'
import { Container, Button, Label } from 'reactstrap'
import { Link } from 'react-router-dom';

export default class ViewCourse extends Component {
    constructor(props) {
        super(props)

        this.state = {
            course: {},
            owner: {},
            resources: [],
            user: {},
            config: {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            },
            isLoggedIn: false

        }
    }

    componentDidMount() {
        Axios.get("http://localhost:3001/courses/" + (this.props.match.params.id), this.state.config)
            .then((response) => {
                console.log(response.data);
                this.setState({
                    course: response.data,
                    owner: response.data.owner
                });
            }).catch((err) => console.log(err.response));

        Axios.get("http://localhost:3001/resource/resourceOf/" + (this.props.match.params.id), this.state.config)
            .then((response) => {
                console.log(response.data);
                this.setState({
                    resources: response.data,
                });
            }).catch((err) => console.log(err.response));

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

    render() {
        return (
            <div>

                <Container>
                    <h1 style={{ textAlign: 'center' }}>
                        {this.state.course.title}
                    </h1>
                    <h2 style={{ textAlign: 'center', }}>
                        BY: {this.state.owner.fullName}
                    </h2>
                    <Link to='/myEnrollments'>
                        <Button color="primary" style={{ float: "right", marginBottom: '25px' }}>Back to my courses</Button>
                    </Link>
                    <table className='table' style={{ margin: '25px auto' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Course</th>
                                <th scope="col">File Title</th>
                                <th scope="col">File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.resources.map((resource) => {
                                    return (
                                        <tr key={resource._id}>

                                            <td>
                                                {resource.course.title}
                                            </td>
                                            <td>
                                                {resource.fileTitle}
                                            </td>
                                            <td>
                                                <Link to={`/playResource/${resource._id}`}>
                                                    <Button color='success' block >Play</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </Container>
            </div>
        )
    }
}
