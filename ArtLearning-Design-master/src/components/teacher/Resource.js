import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import Axios from 'axios';

import { Container, Row, Col, Form, Input, FormGroup, Label, Button, CustomInput, Alert } from 'reactstrap'
import FileUploadButton from '../FileUploadButton'
import { ReactPlayer } from 'react-player';

export default class Resource extends Component {
    constructor(props) {
        super(props)

        this.state = {
            resources: [],

            file: '',
            fileTitle: '',

            user: {},
            config: {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            },
        }
    }

    componentDidMount() {
        Axios.get("http://localhost:3001/resource/resourceOf/" + (this.props.match.params.id), this.state.config)
            .then((response) => {
                console.log(response.data);
                this.setState({
                    resources: response.data,
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
                alert("Resource Added!!")
                this.setState({
                    file: response.data.filename
                })
            }).catch((err) => console.log(err.response))
    }

    addResource = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:3001/resource',
            {
                file: this.state.file,
                fileTitle: this.state.fileTitle,
                course: this.props.match.params.id
            }, this.state.config)
            .then((response) => {
                console.log(response.data);
                alert("you have posted your course successfully!")
                window.location.reload(false);
                this.setState({
                    file: '',
                    fileTitle: ''
                });

            }).catch((err) => console.log(err))
    }

    removeResource = (resourceId) => {
        Axios.delete(`http://localhost:3001/resource/${resourceId}`, this.state.config)
            .then((response) => {
                alert("Resource has been removed!")
                const filteredItemslist = this.state.resources.filter((resources) => {
                    return resources._id !== resourceId
                })
                this.setState({
                    resources: filteredItemslist
                })
            }).catch((err) => console.log(err.response));
    }
    render() {
        return (
            <div>

                <Container>
                    <Form>
                        <FormGroup>
                            <Label for="title">Course Title</Label>
                            <Input type="text" name="fileTitle" id="fileTitle" value={this.state.fileTitle} onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup>

                            <Label for="image">Choose Resource</Label>
                            <FormGroup>
                                <CustomInput type='file' id='image'
                                    onChange={this.handleFileSelect} />
                                {this.state.selectedFile ? (<FileUploadButton
                                    uploadFile={this.uploadFile} />) : null}
                            </FormGroup>
                        </FormGroup>
                        <Button color='primary' onClick={this.addResource}>Add Resource</Button>
                    </Form>

                    <div className='table'>
                        <table className='table' style={{ width: '98%', margin: '25px auto' }}>
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Course</th>
                                    <th scope="col">File Title</th>
                                    <th scope="col">File</th>
                                    <th scope="col">Remove</th>
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

                                                <td>
                                                    <Button color='danger' block onClick={() => this.removeResource(resource._id)} >Remove</Button>
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
}
