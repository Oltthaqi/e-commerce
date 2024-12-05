export enum UserPermissions {
  DEFAULT = 'DEFAULT', // Normal users: manage personal orders, profile, etc.
  ORDERS = 'ORDERS', // Manage all orders: view, update status, delete.
  PRODUCTS = 'PRODUCTS', // Manage all products: create, update, delete.
  CATEGORIES = 'CATEGORIES', // Manage categories: create, update, delete.
  ROLES = 'ROLES', // Admin: manage roles.
  PERMISSION = 'PERMISSION', // Admin: manage permissions.
  USERS = 'USERS', // Admin: manage users.
  SHIPPING = 'SHIPPING', //Manage shipping: view, update, delete.
}
