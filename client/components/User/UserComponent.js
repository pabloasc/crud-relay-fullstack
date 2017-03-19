/* eslint-disable global-require */
import React from 'react';
import Relay from 'react-relay';
import { Grid, Cell, Card, CardTitle, CardText, CardActions, Button } from 'react-mdl';
import Page from '../Page/PageComponent';
import styles from './User.scss';
import AddUser from './AddUserComponent';
import DeleteUserMutation from './DeleteUserMutation';

export default class User extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  state = {
    filter: true
  }

  deleteUser = (id, email) => {
    const deleteUserMutation = new DeleteUserMutation({ viewerId: this.props.viewer.id, id: id, email : email });
    Relay.Store.commitUpdate(deleteUserMutation);
  };

  filterByAge = (bool) => {
    this.setState({ filter: bool });
  }

  render() {
    return (
      <div>
        <Page heading='User List'>
          <Grid>
            <Cell col={12}>
              <Button colored onClick={this.filterByAge.bind(this, true)}>List all Users</Button>
              <Button colored onClick={this.filterByAge.bind(this, false)}>List over 30</Button>
            </Cell>
            {this.props.viewer.users.edges.map((edge) => {
              const imageUrl = require(`../../assets/team.jpg`);
              var toggleForm = (display) => { edge.node.displayForm = display ? false : true; this.forceUpdate(); };
              if (this.state.filter || edge.node.age > 30) {
                return (
                  <Cell col={4} key={edge.node.id}>
                    <Card className={styles.card}>
                      <CardTitle expand className={styles.image} style={{ backgroundImage: `url(${imageUrl})` }} />
                      <CardActions className={styles.name}>
                        <Button colored>{edge.node.name}</Button>
                      </CardActions>
                      <CardText>
                        <b>Address:</b> {edge.node.address} <br />
                        <b>Email:</b> {edge.node.email} <br />
                        <b>Age:</b> {edge.node.age}
                      </CardText>
                      <Grid>
                        <Cell col={6}>
                          <Button className={styles.button} onClick={this.deleteUser.bind(this, edge.node.id, edge.node.email)}>Delete</Button>
                        </Cell>
                        <Cell col={6}>
                          <Button className={styles.button} onClick={toggleForm.bind(this, edge.node.displayForm)}>Edit</Button>
                        </Cell>
                      </Grid>
                      <Cell col={12}>
                        {edge.node.displayForm &&
                          <AddUser viewer={this.props.viewer} node={edge.node} />
                        }
                      </Cell>
                    </Card>
                  </Cell>
                );
              }
            })}
            <AddUser viewer={this.props.viewer} />
          </Grid>
        </Page>
      </div>
    );
  }
}
