import React, { Component } from 'react'
import { Form, Input, FormGroup, Label, Button, Container } from 'reactstrap'

export default class QueryForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            category: '',
            query: ''

        }
    }

    render() {
        return (
            <div>
                <Container>
                    <Form>
                        <FormGroup>
                            <Label for="category">Medium</Label>
                            <Input type="select" name="category" id="category" value={this.state.category} onChange={this.handleChange} >
                                <option >Select medium of the course</option>
                                <option>Sketching</option>
                                <option>Painting</option>
                                <option>Animation</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="query">Course Title</Label>
                            <Input type="text" name="query" id="query" value={this.state.query} onChange={this.handleChange} />
                        </FormGroup>

                    </Form>
                </Container>
            </div>
        )
    }
}
