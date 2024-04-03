const { GraphQLScalarType } = require('graphql');
const { gql } = require('graphql-tag');

const typeDefs = gql`
scalar Date
type LoginResponse {
  status: Int!
  message: String
  token: String
}

type User{
email:String!
password:String!
order:[Order]
cart:Cart!
}

type Product{
  _id:ID!,
  name:String!,
  description:String,
  price:Int!,
  category:String!,
  image:String!,
  rating:Float!
}

type Cart{
  id:ID!,
  user:ID!,
  products: [CartItem!]!
  totalPrice:Int!
}

type CartItem {
  product: ID!
  quantity: Int!
}


type Order{
  _id:ID!,
  user:ID!,
  products:[Product],
  totalAmount:Int!
  orderDate:Date
}

type Status{
  status:Int!
  message:String
}

type CartResponse{
  status:Int!
  _id:ID,
  name:String,
  description:String,
  price:Int,
  category:String,
  image:String,
  rating:Float
}

type OrderResponse{
  status:Int!
  _id:ID,
  user:ID,
  products:[Product],
  totalAmount:Int,
  orderDate:Date
}

type Mutation { 
  login(email: String!, password: String!): LoginResponse!
  addItemToCart(productId:ID!): Status!
  removeItemFromCart(productId:ID!): Status!
  addOrder(totalAmount:Int!):Status!
}

type Query {
  Products(sortOption: String, ratingOption: Float, categoryOption: String, searchWord: String): [Product!]!
  Product(id:ID!):Product!
  ProductIds:[ID!]!
  Cart:[CartResponse]
  Order:[OrderResponse]
}
`;

module.exports = typeDefs