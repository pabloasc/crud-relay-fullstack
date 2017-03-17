import React from 'react';
import Relay from 'react-relay';
import Dropdown from 'react-dropdown';
import { Grid, Cell, Button } from 'react-mdl';
import Page from '../Page/PageComponent';
import AddUserMutation from './AddUserMutation';

const inputData = {
  newUser: { name: '', address: '', email: '', age: '' }
};

export default class User extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  state = {
    form: {
      errors: ''
    }
  }

  validation = (values, validated) => {
    var isValidated = true;
    this.setState({ form: { errors: '' } });
    const emailPattern = /(.+)@(.+){2,}\.(.+){2,}/;
    if (values.name.length === 0 
      || values.address.length === 0 
      || values.email.length === 0 ) {
      this.setState({ form: { errors: 'Complete all the fields' } });
      isValidated = false;
    } else if (!emailPattern.test(values.email)) {
      this.setState({ form: { errors: 'Enter a valid email' } });
      isValidated = false;
    }
    validated(isValidated);
  };

  handleChange = (evt) => {
    inputData.newUser[evt.target.name] = evt.target.value;
  };

  addUser = () => {
    var self = this;
    this.validation(inputData.newUser, (isValidated) => {
      if(isValidated) {
        const addUserMutation = new AddUserMutation({ viewerId: self.props.viewer.id, ...inputData.newUser });
        Relay.Store.commitUpdate(addUserMutation);
      }  
    });
  }

  render() {
    return (
      <Page heading='Add a User'>
        <Grid>
          <Cell col={12}>
            <ul>
              {this.state.form.errors}
            </ul>
          </Cell>
          <Cell col={12}>
            <label>
              <input
                name="name"
                type="text"
                onChange={this.handleChange}
                placeholder="Name" />   
            </label>
          </Cell>
          <Cell col={12}>
            <label>
              <input
                name="address"
                type="text"
                onChange={this.handleChange}
                placeholder="Address" />
            </label>
          </Cell>
          <Cell col={12}>
            <label>
              <input
                name="email"
                type="email"
                onChange={this.handleChange}
                placeholder="Email" />
            </label>
          </Cell>
          <Cell col={12}>
            <label>
              <input
                name="age"
                type="number"
                onChange={this.handleChange}
                placeholder="Age" />
            </label>
          </Cell>
          
          <Cell style={{ textAlign: 'left' }}>
            <Button raised accent onClick={this.addUser.bind(this)}>Add User</Button>
          </Cell>
        </Grid>
      </Page>
    );
  }
}
