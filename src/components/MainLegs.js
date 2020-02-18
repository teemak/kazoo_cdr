import React, {Component} from 'react'
import axios from 'axios'


export default class MainLegs extends Component {
    state = {
        logs: []
    }

    componentDidMount() {
        const id = process.env.REACT_APP_ACCOUNT_ID;
        const name = process.env.REACT_APP_ACCOUNT_NAME;
        const creds = process.env.REACT_APP_CREDENTIALS;
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then(res => {
                this.setState({ logs: res.data })
            });
    }

    render() {
        return (
            <ul>
                <li>{id}</li>
                <li>{name}</li>
                <li>{creds}</li>
            </ul>
        )
    }
}