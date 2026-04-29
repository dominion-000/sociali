import Post from "../models/Post.js";

// create post
export const createPost=
async(req,res)=>{

try{

const {
 title,
 content,
 tags
}=req.body;

const post=
await Post.create({
 title,
 content,
 tags,
 author:req.user._id
});

res.status(201).json({
 success:true,
 data:post
});

}
catch(err){

res.status(500).json({
 success:false,
 message:err.message
});

}

};

// get posts
export const getMyPosts =
async (req,res)=>{

try{

const page=
parseInt(req.query.page)||1;

const limit=
parseInt(req.query.limit)||20;

const skip=
(page-1)*limit;

let filter={
 author:req.user._id
};

if(req.query.state){
 filter.state=
 req.query.state;
}

const posts=
await Post.find(filter)
.sort({createdAt:-1})
.skip(skip)
.limit(limit);

const total=
await Post.countDocuments(
 filter
);

res.json({
 success:true,
 data:posts,
 pagination:{
  page,
  limit,
  total_items:total,
  total_pages:
   Math.ceil(total/limit)
 }
});

}
catch(err){

res.status(500).json({
 success:false,
 message:err.message
});

}

};

// publish post
export const publishPost=
async(req,res)=>{

try{

const post=
await Post.findOne({
 _id:req.params.id,
 author:req.user._id
});

if(!post){
 return res.status(404).json({
  success:false,
  message:"Post not found"
 });
}

post.state="published";

await post.save();

res.json({
 success:true,
 message:"Post published",
 data:post
});

}
catch(err){

res.status(500).json({
 success:false,
 message:err.message
});

}

};
