import React, {Component} from 'react'
import Input from "@material-ui/core/Input";
import { DateRangePicker } from 'react-date-range'

export default class CustomDate  extends Component {
    render() {
        return (
            <span className="custom-date">
                <div className="start-date">
                    <p className="start-date-header">START DATE</p>
                    <Input placeholder="Select Date" />
                    <DateRangePicker/>
                </div>
                <div className="end-date">
                    <p className="end-date-header">END DATE</p>
                    <Input placeholder="Select Date" />
                </div>
            </span>
        )
    }
}