import React, {Component} from 'react'
import axios from 'axios'


export default class MainLegs extends Component {
    state = {
        logs: []
    }

    componentDidMount() {
        console.log("COMPONENT DID MOUNT")
        const url = process.env.REACT_APP_URL;
        const token = process.env.REACT_APP_TOKEN;

        console.log("URL", url)
        console.log("TOKEN", token)
        axios({ 
            method: 'get', 
            url,
            headers: {
                'x-auth-token': token,
                'content-type': 'application/json' 
            }
        }).then(res => console.log(res));
    }

    render() {
        return (
            <ul>
                <li>Placeholder</li>
            </ul>
        )
    }
}