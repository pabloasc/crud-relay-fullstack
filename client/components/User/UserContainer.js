import Relay from 'react-relay';
import User from './UserComponent';

export default Relay.createContainer(User, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on List {
        id,
        users(first: 100) {
          edges {
            node {
              id
              name
              address
              email
              age
            }
          }
        }
      }`
  }
});
