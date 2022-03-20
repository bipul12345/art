import React, { Component } from 'react'
import { Modal, Container, Form, Input, FormGroup, Label, Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Link } from 'react-router-dom';
import Axios from 'axios'

export default class CommunityReplies extends Component {
    constructor(props) {
        super(props)

        this.state = {
            query: {},
            owner: {},
            answer: '',
            answers: [],
            user: {},
            config: {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            },
            isLoggedIn: false,
            isReply: false
        }
    }

    componentDidMount() {
        Axios.get('http://localhost:3001/query/' + (this.props.match.params.id), this.state.config)
            .then((response) => {
                const data = response.data;
                this.setState({ query: data, owner: data.askedBy });
                console.log(response.data);
            }).catch(error => console.log(error.response));

        Axios.get('http://localhost:3001/answer/viewRepliesOf/' + (this.props.match.params.id), this.state.config)
            .then((response) => {
                const data = response.data;
                this.setState({ answers: data });
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

    toggleReply = (e) => {
        this.setState({
            isReply: !this.state.isReply
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    addReply = () => {
        Axios.post(`http://localhost:3001/answer`, {
            query: this.state.query._id,
            answeredBy: this.state.user._id,
            answer: this.state.answer
        }, this.state.config)
            .then((response) => {
                console.log(response)
                // alert("Your reply posted successfully!")
                window.location.reload(false);
            }).catch((err) => console.log(err.response));
    }

    removeAnswer = (answerId) => {
        Axios.delete(`http://localhost:3001/answer/${answerId}`, this.state.config)
            .then((response) => {
                const filteredItemslist = this.state.answers.filter((answers) => {
                    return answers._id !== answerId
                })
                this.setState({
                    answers: filteredItemslist
                })
            }).catch((err) => console.log(err.response));
    }

    render() {
        return (
            <div>
                <Container id="AnswerDiv">
                    <h2 style={{ textAlign: "center", color: '#566573 ' }}>Replies</h2>
                    <div id="question">
                        <h3>{this.state.query.query}</h3>
                        <Label style={{ marginRight: '2%' }}>Categoty: {this.state.query.category}</Label>
                        <Label>Asked By: {this.state.owner.fullName}</Label>
                    </div>
                    {this.state.answers.map((answers) => {
                        return (
                            <div key={answers._id} id='answers' >
                                <h5>{answers.answer}</h5>
                                <Label style={{ marginRight: '10px' }}>Answered By: {answers.answeredBy.fullName}</Label>
                                {this.state.user._id === answers.answeredBy._id ? (<Button color='danger' onClick={() => this.removeAnswer(answers._id)} >Remove</Button>) :
                                    <Button color='danger' hidden>Remove</Button>}
                            </div>
                        )
                    })}
                    <br></br>
                    <Button color='primary' onClick={this.toggleReply}>Post Reply</Button>
                </Container>
                <Modal isOpen={this.state.isReply} toogle={this.toggleReply}>
                    <ModalHeader toggle={this.toggleReply}> Your Reply
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Input type='textarea' name='answer' onChange={this.handleChange} value={this.state.answer}></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.addReply}>Post Reply</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
