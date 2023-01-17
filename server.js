import { ApolloServer, gql } from "apollo-server";

/**
 *  typeDefs에는 GraphQL에서 사용할 도메인을 선언한다.
 *  각 도메인에 대해서 Query와 Mutation을 정의 할 수 있다.
 *  Query는 서버에서 가져오고 싶은 데이터 (즉 서버에서 외부에 제공할 데이터를 적어준다.)
 *  Mutation에서는 서버에 대하여 허용 하는 조작 REST API에서는 (POST, PUT, DELETE)에 해당하는 동작을 기술한다.
 */
const tweets = [
  {
    id: "1",
    text: "first one!",
    userId: "2",
  },
  {
    id: "2",
    text: "second one",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "nico",
    lastName: "las",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }

  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

/**
 * resolvers는 Controller의 역할과 비슷하다.
 * REST API에서는 요청이 들어오면 요청을 수행하는 핸들러 메소드가 로직을 수행하고 결과를 반환한다.
 * resolver는 제공하는 Schema에 해당하는 resolver를 매핑하고 그 안에서 메소드를 선언하여 작업을 수행한다.
 */
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("allUsers called!");
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },

    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  /**
   *  user에는 full name이라는 값이 존재하지 않는다.
   *  fullname이라는 값을 제공하기 위해서 모든 user에 대해서 fullName 메소드를 호출해준다.
   */
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      console.log("userId called");
      console.log(userId);
      return users.filter((user) => userId === user.id)[0];
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
