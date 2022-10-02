//  Compares logged in user ROLE with allowed Role
const authCheck = (user, role1, role2) => {
  const auth = true;
  console.log('user', user);
  console.log('auth', auth);
  if (role2) {
    if (user.role !== role1 && user.role !== role2) {
      return !auth;
    }
  } else if (user.role !== role1) {
    return !auth;
  }
  console.log('auth', auth);
  return auth;
};

export default authCheck;
