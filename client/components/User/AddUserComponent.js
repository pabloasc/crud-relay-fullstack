import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import Dropdown from 'react-dropdown';
import { Grid, Cell, Card, CardTitle, CardText, CardActions, Button } from 'react-mdl';
import styles from './User.scss';
import Page from '../Page/PageComponent';
import AddUserMutation from './AddUserMutation';
import UpdateUserMutation from './UpdateUserMutation';
import DeleteUserMutation from './DeleteUserMutation';

const inputData = {
  newUser: { name: '', address: '', email: '', age: '' }
};

export default class User extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };
  
  title = "Add User";
  isNew = this.props.node ? false : true;
  button = !this.isNew ? "EDIT" : "ADD";
  cardClass = !this.isNew ? styles.none : styles.card;

  id = !this.isNew ? this.props.node.id : "";
  name = !this.isNew ? this.props.node.name : "";
  address = !this.isNew ? this.props.node.address : "";
  email = !this.isNew ? this.props.node.email : "";
  age = !this.isNew ? this.props.node.age : "";
  
  state = {
    form: {
      errors: ''
    },
    inputs : [
      { name: 'name', type: 'text', placeholder: 'Name', defaultValue: this.name},
      { name: 'address', type: 'text', placeholder: 'Address',  defaultValue: this.address},
      { name: 'email', type: 'email', placeholder: 'Email Address',  defaultValue: this.email},
      { name: 'age', type: 'number', placeholder: 'Age', defaultValue: this.age},
    ]
  }

  renderInput = (input) => {
    return (
      <label key={input.name}>
      {input.placeholder}
        <input className={styles.input}
          id={input.name}
          key={input.name}
          ref={input.name}
          name={input.name}
          type={input.type}
          defaultValue={input.defaultValue} />
      </label> 
    );
  };

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
    } else if (this.isNew) {
      if (this.props.viewer.users.edges.find(w => w.node.email === values.email)) {
        this.setState({ form: { errors: 'User already exist' } });
        isValidated = false;
      }
    }
    validated(isValidated);
  };

  addUser = () => {
    var self = this;
    this.state.inputs.map((x, i) => { inputData.newUser[x.name] = self.refs[x.name].value });
    this.validation(inputData.newUser, (isValidated) => {
      if(isValidated) {
        if (self.isNew) {
          const addUserMutation = new AddUserMutation({ viewerId: self.props.viewer.id, ...inputData.newUser });
          Relay.Store.commitUpdate(addUserMutation);
        } else {
          inputData.newUser.id = self.props.node.id;
          inputData.newUser.oldEmail = self.email;
          const updateUserMutation = new UpdateUserMutation({ viewerId: self.props.viewer.id, ...inputData.newUser });
          Relay.Store.commitUpdate(updateUserMutation);
        }
      }  
    });
  }

  deleteUser = (id, email) => {
    const deleteUserMutation = new DeleteUserMutation({ viewerId: this.props.viewer.id, id: id, email : email });
    Relay.Store.commitUpdate(deleteUserMutation);
  }

  render() {
    const imageUrl = require(`../../assets/team.jpg`);
    return (
      <Card className={this.cardClass}>
        <CardActions className={styles.name}>
          {this.isNew &&
            <Button>{this.title}</Button>
          }
        </CardActions>
        <CardText>
          <ul>
            {this.state.form.errors}
          </ul>
          {this.state.inputs.map(this.renderInput)}
        </CardText>
        <Grid>
          <Cell col={12}>
            <Button raised accent onClick={this.addUser.bind(this,)}>{this.button}</Button>
          </Cell>
        </Grid>
      </Card>
    );
  }
}
