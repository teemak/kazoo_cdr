import React, { Component } from 'react'
import Input from "@material-ui/core/Input";
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns'
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'

export default class CustomDate  extends Component {
    state = {
        start: new Date(),
        end: addDays(new Date(), 7),
        key: 'selection'
    }
    render() {
        return (
            <span className="custom-date">
                <div className="start-date">
                    <DateRangePicker 
                        onChange={item => console.log(item)}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={[this.state.start, this.state.end]}
                        direction='horizontal'
                    />
                </div>
                <div className="end-date">
                </div>
            </span>
        )
    }
}