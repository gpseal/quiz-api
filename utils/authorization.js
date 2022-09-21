//  Compares logged in user ROLE with allowed Role
const authCheck = (user, res, role1, role2) => {
  if (role2) {
    console.log('role2 exists');
    if (user.role !== role1 && user.role !== role2) {
      return res.status(403).json({
        msg: 'You are not authorized to perform this action',
      });
    }
  } else if (user.role !== role1) {
    console.log("here");
    return res.status(403).json({
      msg: 'You are not authorized to perform this action',
    });
  }
};

export default authCheck;
