import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import Axios from 'axios';
import { Container, Row, Col, Form, Input, FormGroup, Label, Button, CustomInput, Alert } from 'reactstrap'
import FileUploadButton from '../FileUploadButton'

export default class AddCourse extends Component {
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

            user: {},
            config: {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            },
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFileSelect = (e) => {
        this.setState({
            selectedFile: e.target.files[0]
        })
    }

    uploadFile = (e) => {
        e.preventDefault();
        const data = new FormData()
        data.append('courseFile', this.state.selectedFile)
        Axios.post('http://localhost:3001/upload', data)
            .then((response) => {
                console.log(response.data)
                this.setState({
                    image: response.data.filename
                })
            }).catch((err) => console.log(err.response))
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

    addCourse = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/courses',
            {
                image: this.state.image,
                title: this.state.title,
                detail: this.state.detail,
                price: this.state.price,
                owner: this.state.user._id,
                medium: this.state.medium,
                courseType: this.state.courseType
            }, this.state.config)
            .then((response) => {
                console.log(response.data);
                alert("you have posted your course successfully!")
                this.setState({
                    image: '',
                    title: '',
                    detail: '',
                    price: '',
                    owner: '',
                    medium: '',
                    courseType: ''
                });

            }).catch((err) => console.log(err))
    }

    render() {
        if (this.state.user.role === 'student') {
            return <Redirect to='/' />
        }
        return (
            <div>
                <Container>
                    <h2 style={{ margin: '20px 0px 0px 0px' }}>Add Courses </h2>

                    <Link to={`/viewMyCourses`}>
                        <Button color="primary" style={{ margin: '-40px 60px 0px 60px', float: 'right' }}> View my cources</Button>
                    </Link>
                    <hr></hr>
                    <Row>
                        <Col sm="12" md={{ size: 6, offset: 3 }}>
                            <Form>
                                <FormGroup>
                                    <Label for="title">Course Title</Label>
                                    <Input type="text" name="title" id="title" value={this.state.title} onChange={this.handleChange} />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="medium">Medium</Label>
                                    <Input type="select" name="medium" id="medium" value={this.state.medium} onChange={this.handleChange} >
                                        <option >Select medium of the course</option>
                                        <option>Charcoal Drawing</option>
                                        <option>Graphite Drawing</option>
                                        <option>Water Color</option>
                                        <option>Oil Painting</option>
                                        <option>Digital Painting</option>
                                    </Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="courseType">Course Type</Label>
                                    <Input type="select" name="courseType" id="courseType" value={this.state.courseType} onChange={this.handleChange} >
                                        <option >Select type of the course</option>
                                        <option>Free</option>
                                        <option>Paid</option>
                                    </Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="detail">Detail of the course</Label>
                                    <Input type="textarea" name="detail" id="detail" value={this.state.detail} onChange={this.handleChange} />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="price">Price</Label>
                                    <Input type="number" name="price" id="price" value={this.state.price} onChange={this.handleChange} />
                                </FormGroup>

                                <FormGroup>

                                    <Label for="image">Course Cover</Label>
                                    <FormGroup>
                                        <img className='img-thumbnail image'
                                            width='400' src={`http://localhost:3001/uploads/${this.state.image}`}
                                        />
                                        <CustomInput type='file' id='image'
                                            onChange={this.handleFileSelect} />
                                        {this.state.selectedFile ? (<FileUploadButton
                                            uploadFile={this.uploadFile} />) : null}
                                    </FormGroup>
                                </FormGroup>
                                <Button color='primary' block onClick={this.addCourse}>Add course</Button>
                            </Form>
                        </Col>
                    </Row>

                </Container>
            </div>
        )
    }
}
