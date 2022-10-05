//  Compares logged in user ROLE with allowed Role
const authCheck = (user, role1, role2) => {
  const auth = true;
  if (role2) {
    if (user.role !== role1 && user.role !== role2) {
      return !auth;
    }
  } else if (user.role !== role1) {
    return !auth;
  }
  return auth;
};

export default authCheck;
