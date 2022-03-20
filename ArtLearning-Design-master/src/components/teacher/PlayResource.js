import React, { Component } from 'react'
import ReactPlayer from 'react-player';
import { Redirect, Link } from 'react-router-dom';
import Axios from 'axios';
import { Container } from 'reactstrap';

export default class PlayResource extends Component {
    constructor(props) {
        super(props)

        this.state = {
            resources: {},
            video: '',
            user: {},
            config: {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            },
        }
    }

    componentDidMount() {
        Axios.get("http://localhost:3001/resource/" + (this.props.match.params.id), this.state.config)
            .then((response) => {
                console.log(response.data);
                this.setState({
                    resources: response.data,
                    video: response.data.file
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

    render() {
        return (
            <div>
                <Container>

                    <ReactPlayer controls width='1000px' height='560px'
                        style={{ margin: '10px auto' }}
                        url={`http://localhost:3001/uploads/` + (this.state.resources.file)}
                        onReady={() => console.log('onReady Callback')}
                        onStart={() => console.log('onStart Callback')}
                        onPause={() => console.log('onPause Callback')}
                        onEnded={() => console.log('onEnded Callback')}
                        onError={() => console.log('onError Callback')}
                    >
                    </ReactPlayer>
                    <h1 style={{ margin: '10px 50px' }}>{this.state.resources.fileTitle}</h1>
                </Container>

            </div>
        )
    }
}
