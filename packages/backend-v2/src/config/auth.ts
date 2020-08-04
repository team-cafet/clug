export const BCRYPT_SALT_ROUND = 10;
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const TOKEN_EXPIRE_IN = process.env.TOKEM_EXPIRE_IN || 365 * 24 * 60 * 60;
export const PERMISSIONS = {
  admin: 'admin',
  manager: [
    'member:read',
    'member:write',
    'club:read',
    'club:write',
    'organisation:read',
    'organisation:write',
    'staff:read',
    'staff:write',
    'user:read',
    'memberLabel:read',
    'memberLabel:write',
    'membership:read',
    'membership:write',
    'payment:read',
    'payment:write',
    'paymentRequest:read',
    'paymentRequest:write'
  ],
  user: [
    'member:read',
    'member:write',
    'staff:read',
    'staff:write',
    'organisation:read',    
    'club:read',
    'club:write',
    'memberLabel:read',
    'memberLabel:write',
    'membership:read',
    'membership:write',
    'payment:read',
    'payment:write',
    'paymentRequest:read',
    'paymentRequest:write'
  ]
};
export enum EXISTING_GROUPS {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}