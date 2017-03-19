import Relay from 'react-relay';

class UpdateUserMutation extends Relay.Mutation {
  
  getMutation() {
    return Relay.QL`
      mutation { updateUser }
    `;
  }

  getVariables() {
    return {
      name: this.props.name,
      address: this.props.address,
      oldEmail: this.props.oldEmail,
      email: this.props.email,
      age: this.props.age
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateUserPayload {
        user {
          name,
          address,
          email,
          age,
        },
        viewer {
          users,
        },
          
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { 
        user: this.props.id,
        viewer: this.props.viewerId,
      }
    }];
  }
}

export default UpdateUserMutation;