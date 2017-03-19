import Relay from 'react-relay';

class DeleteUserMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`
      mutation { deleteUser }
    `;
  }

  getVariables() {
    return {
      id: this.props.id,
      email: this.props.email
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteUserPayload {
        viewer { users },
        DeletedUser,
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'RANGE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewerId,
      connectionName: 'users',
      pathToConnection: ['viewer', 'users'],
      deletedIDFieldName: 'DeletedUser'
    }];
  }
}

export default DeleteUserMutation;