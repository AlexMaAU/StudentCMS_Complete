const express = require('express');
require('express-async-errors'); //这个包一定要在导入express后再导入，否则不起作用，专门用来处理异步错误。但是还是需要自定义错误中间件来处理要自定义的错误处理。
const app = express();
require('dotenv').config();
const indexRouter = require('./routes/index');
const connectDB = require('./utils/db');
const unknownError = require('./middlewares/unknownError');
const validateError = require('./middlewares/validateError');

const PORT = process.env.PORT || 3000;

app.use(indexRouter);

app.use(validateError); //其他详细类型的错误处理中间件要在未知错误处理中间件的前面

app.use(unknownError); //未知错误处理中间件要放在最后面

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running at http://127.0.0.1:${PORT}`);
  });
});
