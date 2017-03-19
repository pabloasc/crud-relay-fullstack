/* eslint-disable no-unused-vars, no-use-before-define */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection
} from 'graphql-relay';

import {
  List,
  User,
  getList,
  getUser,
  getUsers,
  addUser,
  deleteUser,
  updateUser
} from './database';


/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'List') {
      return getList(id);
    } else if (type === 'User') {
      return getUser(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof List) {
      return listType;
    } else if (obj instanceof User) {
      return userType;
    }
    return null;
  }
);

/**
 * Define your own types here
 */

const listType = new GraphQLObjectType({
  name: 'List',
  description: 'A kind of list',
  fields: () => ({
    id: globalIdField('list'),
    users: {
      type: userConnection,
      description: 'Users that belongs to this list',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getUsers(), args)
    },
    name: {
      type: GraphQLString,
      description: 'List\'s name'
    }
  }),
  interfaces: [nodeInterface]
});

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'Users added by default',
  fields: () => ({
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      description: 'Name of user'
    },
    address: {
      type: GraphQLString,
      description: 'Address of the user'
    },
    email: {
      type: GraphQLString,
      description: 'Email of the user'
    },
    age: {
      type: GraphQLString,
      description: 'Age the user'
    }
  }),
  interfaces: [nodeInterface]
});

/**
 * Define your own connection types here
 */
const { connectionType: userConnection, edgeType: userEdge } = connectionDefinitions({ name: 'User', nodeType: userType });

/**
 * Add user mutation
 */

const addUserMutation = mutationWithClientMutationId({
  name: 'AddUser',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLString) }
  },

  outputFields: {
    userEdge: {
      type: userEdge,
      resolve: (obj) => {
        const cursorId = cursorForObjectInConnection(getUsers(), obj);
        return { node: obj, cursor: cursorId };
      }
    },
    viewer: {
      type: listType,
      resolve: () => getList(1)
    }
  },

  mutateAndGetPayload: ({ name, address, email, age }) => addUser(name, address, email, age)
});

/**
 * Update user mutation
 */

const updateUserMutation = mutationWithClientMutationId({
  name: 'UpdateUser',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    oldEmail: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLString) }
  },

  outputFields: {
    user: {
      type: userType,
      resolve: ({email}) => getUser(email),
    },
    viewer: {
      type: listType,
      resolve: () => getList(1)
    }
  },

  mutateAndGetPayload: ({ name, address, email, oldEmail, age }) => updateUser(name, address, email, oldEmail, age)
});

/**
 * Delete user mutation
 */

const deleteUserMutation = mutationWithClientMutationId({
  name: 'DeleteUser',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    email: { type: new GraphQLNonNull(GraphQLString) }
  },

  outputFields: {
    DeletedUser: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: listType,
      resolve: () => getList(1)
    }
  },

  mutateAndGetPayload: ({ id, email }) => deleteUser(id, email)
});


/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: listType,
      resolve: () => getList(1)
    }
  })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addUser: addUserMutation,
    deleteUser: deleteUserMutation,
    updateUser: updateUserMutation,
    
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
