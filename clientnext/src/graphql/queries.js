import { gql } from '@apollo/client';

export const LOGIN = gql
    `mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        status
        message
        token
    }
  }
  `
export const GET_ALL_PRODUCTS = gql`
query GetAllProducts($sortOption: String, $ratingOption: Float, $categoryOption: String, $searchWord: String) {
    Products(sortOption: $sortOption, ratingOption: $ratingOption, categoryOption: $categoryOption, searchWord: $searchWord) {
      _id
      name
      description
      price
      category
      image
      rating
    }
  }
`;

export const GET_PRODUCT_IDS = gql`
query GetProductIds {
    ProductIds
  }
  
`

export const GET_PRODUCT_ITEMS = gql`
query GetProductItems($id: ID!) {
    Product(id: $id) {
      _id
      rating
      category
      description
      image
      name
      price
    }
  }
`

export const GET_CART = gql`
query GetCart {
    Cart {
    status
      _id
      category
      description
      image
      name
      price
      rating
    }
  }
`

export const ADD_TO_CART = gql`
mutation AddToCart($productId: ID!) {
    addItemToCart(productId: $productId) {
      message
      status
    }
  }
`;

export const REMOVE_FROM_CART = gql`
mutation RemoveFromCart($productId: ID!) {
    removeItemFromCart(productId: $productId) {
      message
      status
    }
  }
`

export const GET_ORDERS = gql`
query GetOrders {
  Order {
    status
    _id
    user
    products {
      _id
      name
      description
      price
      category
      image
      rating
    }
    totalAmount
    orderDate
  }
}
`

export const ADD_ORDER = gql`
mutation AddOrder($totalAmount: Int!) {
    addOrder(totalAmount: $totalAmount) {
      message
      status
    }
  }
`



export default {
    LOGIN,
    GET_ALL_PRODUCTS,
    GET_PRODUCT_IDS,
    GET_PRODUCT_ITEMS,
    GET_CART,
    ADD_TO_CART,
    REMOVE_FROM_CART,
    GET_ORDERS,
    ADD_ORDER
};
