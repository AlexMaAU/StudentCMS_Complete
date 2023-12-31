//具体的错误处理中间件
//把原本的error返回信息给自定义了，这样的好处是可以马上知道具体的错误信息，而不是依赖于原生的错误信息返回(有时看不懂)
const validateError = (error, req, res, next) => {
  //check if this error is a validation error
  if (error.name === 'ValidationError') {
    res.status(400).json({ error: error.message });
    return;  //加上return，表示请求结束，不用再转递给下一个中间件
  }
  next(error); //如果这个错误中间件处理不了，传递给下一个错误中间件
};

class notFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'notFoundError';
  }
}

module.exports = validateError;
