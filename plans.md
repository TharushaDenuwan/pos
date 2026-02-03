## Cart Plan

- Tables List

  - Cart
  - Cart Item

- In Cart table, Should have following attributes

  - Cart ID (Auto generated cart id)
  - User ID (Referenced to user table id)
  - Items List (Each one referenced to cart item)

- In Cart Item Table

  - cartId
  - productId
  - variantId
  - quantity

- API Handlers Overview

  - [GET] /api/carts : Used for Admin, List all carts in system - Route Done - Handler Done
  - [GET] /api/cart : Used by user side, To get cart - Route Done - Handler Done
  - [PUT] /api/cart/items : Add new item - Route Done - Handler Done
  - [GET] /api/cart/items/{itemId}: Get cart item - Route Done - Handler Done
  - [PATCH] /api/cart/items/{itemId} : Update cart item - Route Done - Handler Done
  - [DELETE] /api/cart/items/{itemId} : Delete cart item
