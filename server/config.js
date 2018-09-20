module.exports = {
  port: 3000,
  // 数据库
  mongodb: 'mongodb://localhost:27017/dochat',
  jwtSecret: 'dochat',
  tokenExpiressTime: 7 * 24 * 60 * 60 *1000,
  maxGroupsCount: 10,
  qiniu: {
    accessKey: 'bv4JVdeyVsiXTPU2uoWHncDoYjKb6sBRR_BHGx4j',
    secretKey: 'Jtwfd4zCSWFMnsZk6U6ZuqM9HKt4PXcLcxPBlkX7',
    bucket: 'dochat',
    urlPrefix: 'http://p92a4w4xj.bkt.clouddn.com/'
  }
}
