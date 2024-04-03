import { ApolloClient, InMemoryCache } from '@apollo/client';
const client = new ApolloClient({
  uri: "https://ecommerce-website-next-graphql.vercel.app/",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache', 
    },
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache', 
    },
  },
});

export default client;
