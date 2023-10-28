const mongoose = require('mongoose');
require('dotenv').config();
const DB_CONNECT = process.env.DB_CONNECT;

async function connectDB() {
  if (!DB_CONNECT) {
    console.log('DB_CONNECT is not set');
    process.exit(1);
  }
  mongoose.connect(DB_CONNECT);
  mongoose.connection.on('connected', () => {
    console.log('DB connected');
  });
  mongoose.connection.on('error', () => {
    console.log('DB connection error');
    process.exit(2);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('DB disconnected');
    process.exit(3);
  });

  // 获取到 Mongoose 库中的默认连接对象 - 获取的是默认连接对象的引用。这个引用允许你访问默认连接的各种属性和方法，以便监听连接事件、处理连接错误、执行数据库操作等。
  // 只是为了获取默认的数据库连接对象的引用，它并没有实际连接到数据库。这个连接对象是由Mongoose创建并维护的，通常它连接到MongoDB服务器上的test数据库。
  // 这个默认行为主要用于开发和测试目的，以便你可以快速启动应用并在test数据库中进行开发、测试或原型工作。
  // mongoose.connection的目的是先用默认连接对象来测试mongoose本身是否可以正常连接数据库，从而确保mongoose本身没有问题
//   const db = mongoose.connection;
//   db.on('error', (error) => {
//     console.error(error);
//     process.exit(2);
//   });
//   db.on('connected', () => {
//     console.log('DB connected');
//   });
//   db.on('disconnected', () => {
//     console.log('DB disconnected');
//   });

  // 实际地建立数据库连接
//   mongoose.connect(connectString);
}

module.exports = connectDB;
