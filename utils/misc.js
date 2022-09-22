const catchReturn = (res, err) => {
  res.status(500).json({
    msg: err.message,
  });
};

const notAuthorized = (res) => {
  res.status(403).json({
    msg: 'You are not authorized to perform this action',
  });
};

export { catchReturn, notAuthorized };
