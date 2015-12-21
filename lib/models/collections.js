Posts = new Mongo.Collection("posts");
Posts.attachSchema(Schemas.Posts);

Comments = new Mongo.Collection("comments");
Comments.attachSchema(Schemas.Comments);
