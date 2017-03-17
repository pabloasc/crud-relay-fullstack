/* eslint-disable global-require */
import React from 'react';
import Relay from 'react-relay';
import { Grid, Cell, Card, CardTitle, CardText, CardActions, Button } from 'react-mdl';
import Page from '../Page/PageComponent';
import styles from './User.scss';
import AddUser from './AddUserComponent';
import DeleteUserMutation from './DeleteUserMutation';

const inputData = {
  newUser: { id: 1, name: 'Dave' }
};

export default class User extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object.isRequired
  };

  deleteUser = (email) => {
    const deleteUserMutation = new DeleteUserMutation({ email : email });
    Relay.Store.commitUpdate(deleteUserMutation);
  }

  render() {
    return (
      <div>
        <Page heading='User List'>
          <Grid>
            {this.props.viewer.users.edges.map((edge) => {
              const imageUrl = require(`../../assets/people.png`);
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
                      <b>Age:</b> {edge.node.id}
                    </CardText>
                    <Cell style={{ textAlign: 'left' }}>
                      <Button  onClick={this.deleteUser.bind(this, edge.node.email)}>Delete</Button>
                    </Cell>
                  </Card>
                </Cell>
              );
            })}
          </Grid>
        </Page>
        <AddUser viewer={this.props.viewer} />
      </div>
    );
  }
}
