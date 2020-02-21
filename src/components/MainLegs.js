import React, {Component} from 'react'
//import axios from 'axios'
import fake from '../../src/data.json'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";

export default class MainLegs extends Component {
    state = {
        logs: fake
    }

    componentDidMount() {
        //const url = process.env.REACT_APP_URL;
        //const token = process.env.REACT_APP_TOKEN;

        /*
        axios({ 
            method: 'get', 
            url,
            headers: {
                'x-auth-token': token,
                'content-type': 'application/json' 
            }
        }).then(res => console.log(res));
        */
    }
    icon(direction) {
        let point;
        switch(direction) {
            case 'inbound':
                point = <FontAwesomeIcon style={{color: "#6db65b"}} size='2x' icon={faArrowCircleRight} />
                break;
            case 'outbound':
                point = <FontAwesomeIcon style={{color: '#22a5ff'}} size='2x' icon={faArrowCircleLeft} />
                break;
            default:
                return;
        }
        return point;
    }

    render() {
        //const call = this.state.logs.fake.data;
        //console.log("TEST DATA", this.state.logs.data[0]);
        return (
            <tbody>
                {this.state.logs.data.map(call => {
                    const {id, direction, caller_id_name, caller_id_number, callee_id_name, callee_id_number, hangup_cause, datetime, duration_seconds} = call;
                    return (
                        <tr key={id}>
                            <td>{this.icon(direction)}</td>
                            <td>{caller_id_name}<p>{caller_id_number}</p></td>
                            <td>{callee_id_name}<p>{callee_id_number}</p></td>
                            <td>{hangup_cause}</td>
                            <td>{datetime}</td>
                            <td>{duration_seconds}</td>
                        </tr>
                    );
                })}
            </tbody>
        )
    }
}