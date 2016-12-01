import React from 'react'
import axios from 'axios'
import data from './data.json'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'


const products = [];

function addProducts(quantity) {
  const startId = products.length;
  for (let i = 0; i < quantity; i++) {
    const id = startId + i;
    products.push({
      id: id,
      name: 'Item name ' + id,
      price: 2100 + i
    });
  }
}

addProducts(30)

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

this.options = {
  defaultSortName: 'name',  // default sort column name
  defaultSortOrder: 'desc'  // default sort order
};
}

    render() {
        return (
      <div>
        <BootstrapTable data={ products } ref='table' bordered={ false } options={ this.options } >
          <TableHeaderColumn dataField='id' isKey={ true } dataSort>Product ID</TableHeaderColumn>
          <TableHeaderColumn dataField='name' dataSort>Product Name</TableHeaderColumn>
          <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
        </BootstrapTable>
      </div>
        );
    }

}
