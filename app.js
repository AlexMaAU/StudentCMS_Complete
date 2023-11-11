const express = require("express");
require("express-async-errors"); //这个包一定要在导入express后再导入，否则不起作用，专门用来处理异步错误。但是还是需要自定义错误中间件来处理要自定义的错误处理。
const cors = require("cors");
const app = express();
require("dotenv").config();
const indexRouter = require("./routes/index");
const connectDB = require("./utils/db");
const unknownError = require("./middlewares/unknownError");
const validateError = require("./middlewares/validateError");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(indexRouter);

// 注意中间件的绑定顺序，按照从上到下的顺序依次注册中间件
app.use(validateError); //其他详细类型的错误处理中间件要在未知错误处理中间件的前面

// 自定义的最后一级错误处理中间件, 当有错误是其他的中间件无法处理的时候，都交由最后一级来处理
app.use(unknownError); //未知错误处理中间件要放在最后面

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running at http://127.0.0.1:${PORT}`);
  });
});
