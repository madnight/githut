import React from 'react'
import axios from 'axios'
import data from './data.json'
var DataTable = require('react-data-components').DataTable;


export default class LangTable extends React.Component {

  constructor() {
// Table data as a list of array.
super()
this.columns = [
  { title: 'Name', prop: 'name'  },
  { title: 'City', prop: 'city' },
  { title: 'Address', prop: 'address' },
  { title: 'Phone', prop: 'phone' }
];

this.data = [
  { name: 'name value', city: 'city value', address: 'address value', phone: 'phone value' },
  { name: 'value', city: 'city value', address: 'address value', phone: 'phone value' }
];
}

    render() {
        return (

<table id="example" class="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Office</th>
                <th>Age</th>
                <th>Start date</th>
                <th>Salary</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Tiger Nixon</td>
                <td>System Architect</td>
                <td>Edinburgh</td>
                <td>61</td>
                <td>2011/04/25</td>
                <td>$320,800</td>
            </tr>
            <tr>
                <td>Garrett Winters</td>
                <td>Accountant</td>
                <td>Tokyo</td>
                <td>63</td>
                <td>2011/07/25</td>
                <td>$170,750</td>
            </tr>
            <tr>
                <td>Ashton Cox</td>
                <td>Junior Technical Author</td>
                <td>San Francisco</td>
                <td>66</td>
                <td>2009/01/12</td>
                <td>$86,000</td>
            </tr>
          </tbody>
    </table>

        );
    }

}
