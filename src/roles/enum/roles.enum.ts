export enum UserRoles {
  ADMIN = 'ADMIN', // Full access to all permissions
  MANAGER = 'MANAGER', // Manage orders, products, categories, and shipping
  VENDOR = 'VENDOR', // Manage their own products and orders
  CUSTOMER = 'CUSTOMER', // Normal user with access to browsing and purchasing
  SHIPPING_AGENT = 'SHIPPING_AGENT', // Manage shipping operations
}
