import Post from "../models/Post.js";

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
