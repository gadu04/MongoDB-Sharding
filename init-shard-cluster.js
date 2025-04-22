use admin

// Initialize Config Server Replica Set
db = connect("localhost:27020/admin")
rs.initiate({
  _id: "configReplSet",
  configsvr: true,
  members: [
    { _id: 0, host: "localhost:27020" }
  ]
})

// Initialize Shard 1 Replica Set
db = connect("localhost:27018/admin")
rs.initiate({
  _id: "shard1ReplSet",
  members: [
    { _id: 0, host: "localhost:27018" }
  ]
})

// Initialize Shard 2 Replica Set
db = connect("localhost:27019/admin")
rs.initiate({
  _id: "shard2ReplSet",
  members: [
    { _id: 0, host: "localhost:27019" }
  ]
})

// Configure Sharding via mongos
db = connect("localhost:27017/admin")
sh.addShard("shard1ReplSet/localhost:27018")
sh.addShard("shard2ReplSet/localhost:27019")
sh.enableSharding("testDB")
sh.shardCollection("testDB.testCollection", { _id: "hashed" })
printjson(sh.status())