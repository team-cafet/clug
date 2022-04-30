export const BCRYPT_SALT_ROUND = 10;
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const TOKEN_EXPIRE_IN =
  process.env.TOKEM_EXPIRE_IN || 365 * 24 * 60 * 60;

export enum Permissions {
  admin = 'admin',

  memberR = 'member:read',
  memberW = 'member:write',

  clubR = 'club:read',
  clubW = 'club:write',

  organisationR = 'organisation:read',
  organisationW = 'organisation:write',

  staffR = 'staff:read',
  staffW = 'staff:write',

  userR = 'user:read',
  userW = 'user:write',

  membershipR = 'membership:read',
  membershipW = 'membership:write',

  paymentR = 'payment:read',
  paymentW = 'payment:write',

  paymentRequestR = 'paymentRequest:read',
  paymentRequestW = 'paymentRequest:write',

  membershipPlanR = 'membershipPlan:read',
  membershipPlanW = 'membershipPlan:write'
}

export const GROUP_PERMISSIONS = {
  admin: Permissions.admin,
  manager: [
    Permissions.memberR,
    Permissions.memberW,

    Permissions.clubR,
    Permissions.clubW,

    Permissions.organisationR,
    Permissions.organisationW,

    Permissions.staffR,
    Permissions.staffW,

    Permissions.userR,

    Permissions.membershipR,
    Permissions.membershipW,

    Permissions.membershipPlanR,
    Permissions.membershipPlanW,

    Permissions.paymentR,
    Permissions.paymentW,

    Permissions.paymentRequestR,
    Permissions.paymentRequestW
  ],
  user: [
    Permissions.memberR,
    Permissions.memberW,

    Permissions.clubR,
    Permissions.clubW,

    Permissions.organisationR,

    Permissions.staffR,
    Permissions.staffW,

    Permissions.membershipR,
    Permissions.membershipW,

    Permissions.membershipPlanR,
    Permissions.membershipPlanW,

    Permissions.paymentR,
    Permissions.paymentW,

    Permissions.paymentRequestR,
    Permissions.paymentRequestW
  ]
};

export enum EXISTING_GROUPS {
  ADMIN = 'admin',

  /* Manager group contains all people who's working
   * at Clug
   */
  MANAGER = 'manager',

  // User group contains all clug user
  USER = 'user'
}
