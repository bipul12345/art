import React, { Component } from 'react'
import { Container, Label, Button, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom';
import Axios from 'axios'

export default class CourseInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            owner: {},
            course: {},
            resources: [],
            user: {},
            config: {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            },
            isLoggedIn: false
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:3001/courses/' + (this.props.match.params.id), this.state.config)
            .then((response) => {
                const data = response.data;
                this.setState({ course: data, owner: data.owner });
                console.log(response.data);
            }).catch(error => console.log(error.response));

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
        if (this.state.course.courseType === 'Free') {
            return (
                <div>
                    <Container id="courseInfo">
                        <img style={{ margin: "10px auto" }} top width="70%"
                            src={`http://localhost:3001/uploads/${this.state.course.image}`} alt="Card_image" />
                        <br></br>
                        <div id="courseDetails">
                            <Row>
                                <Col> <Label >Title: {this.state.course.title}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col> <Label >Price: {this.state.course.price}</Label></Col>
                                <Col><Label>Course Type: {this.state.course.courseType}</Label></Col>
                            </Row>
                            <Row>
                                <Col> <Label >Medium: {this.state.course.medium}</Label></Col>
                                <Col><Label>Tutor: {this.state.owner.fullName}</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>Description: {this.state.course.detail}</Label></Col>
                            </Row>
                        </div>
                        <hr></hr>
                        <div id="courseResources">
                            <table className='table' style={{ margin: '25px auto' }}>
                                <thead className="thead-dark">
                                    <tr>
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

                        </div>
                    </Container>
                </div>
            )
        }
        else {
            return (
                <div>
                    <Container id="courseInfo">
                        <img style={{ margin: "10px auto" }} top width="70%"
                            src={`http://localhost:3001/uploads/${this.state.course.image}`} alt="Card_image" />
                        <br></br>
                        <div id="courseDetails">
                            <Row>
                                <Col> <Label >Title: {this.state.course.title}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col> <Label >Price: {this.state.course.price}</Label></Col>
                                <Col><Label>Course Type: {this.state.course.courseType}</Label></Col>
                            </Row>
                            <Row>
                                <Col> <Label >Medium: {this.state.course.medium}</Label></Col>
                                <Col><Label>Tutor: {this.state.owner.fullName}</Label></Col>
                            </Row>
                            <Row>
                                <Col><Label>Description: {this.state.course.detail}</Label></Col>
                            </Row>
                        </div>
                        <Button color="danger" onClick={() => this.postEnrollment(this.state.course._id, this.state.owner.fullName)}>Enroll Now</Button>
                    </Container>
                </div>
            )
        }

    }
}
