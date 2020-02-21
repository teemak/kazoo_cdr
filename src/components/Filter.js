import React, { Component } from 'react'
import Input from "@material-ui/core/Input";
import data from '../data.json'

export default class Filter extends  Component {
    criteria(input) {
        console.log('FILTER THIS: ', input)
        console.log('DATA: ', Object.values(data.data[0]).join()) // Array of strings

        let search = input;
        let regex = /(?:^|W)`${input}`(?:$|W)/
        console.log("REGEX TESTER", regex);

        if(Object.values(data.data[0]) === input) {
            console.log("** THERE IS A MATCH")
        }
    }

    render() {
        return (
    		<Input id="outlined-basic" placeholder="Filter By Caller, Duration, Number..." onChange={event => this.criteria(event.target.value)} />
        );
    }
}