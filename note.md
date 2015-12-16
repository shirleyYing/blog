db.users.find({},{"user":"1","age":2})  只返回：user ，age
用key：0 可以去除一些键值对
>db.users.find({"name":"1"},{"email":0})

{ "_id" : ObjectId("566430c4af2f48805e95c715"), "name" : "1", "password" : "c4ca4238a0b923820dcc509a6f75849b" }
