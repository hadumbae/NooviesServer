/**
 * A readonly array of possible user roles in the system.
 *
 * @example
 * ```ts
 * import UserRoleConstant from './UserRoleConstant';
 *
 * const roles: typeof UserRoleConstant[number][] = ["USER", "ADMIN"];
 * ```
 */
const UserRoleConstant = [
    "USER",
    "ADMIN",
] as const;

export default UserRoleConstant;
