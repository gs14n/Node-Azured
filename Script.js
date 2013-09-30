db.zips.aggregate([
{
    $project:{city:1, state:1, pop:1, tag:{$add:[12345]}}, 
    $match:{$and:[{$pop:{$gt:25000}}, {$state:{$in:['CA','NY']}}]}
}
]);

db.zips.aggregate([
{
    $project:{city:1, state:1, pop:1, tag:{$add:[12345]}}, 
    $group:{_id:{city:"$city", tag:"$tag"}, city_pop:{$sum:"$pop"}},
    $match:{$and:[{$city_pop:{$gt:25000}}, {$state:{$in:['CA','NY']}}]},
    $group:{_id:"$_id.tag", average:{$avg:"$city_pop"}}
}
]);

db.zips.aggregate([
{
    $project:{city:1, state:1, pop:1, tag:{$add:[12345]}}, 
    $group:{_id:{city:"$city", tag:"$tag"}, city_pop:{$sum:"$pop"}}
}
]);

db.zips.aggregate([
{
    $project:{city:1, state:1, pop:1, tag:{$add:[12345]}},
    $group:{_id:"$tag"+"a", count:{$sum:1}}
}
]);

db.zips.aggregate([
{
    $project:{city:1, state:1, pop:1}, 
    $match:{"state":{$in:['CA','NY']}},
    $group:{_id:"$state",city_pop:{$sum:"$pop"}},
    $match:{"city_pop":{$gt:25000}}
}
]);  


db.zips.aggregate([
{
    $project:{city:1, state:1, pop:1}, 
}
]);  

db.zips.aggregate([
{
   $match:{"state":"CA"},
}])

db.zips.aggregate([
{
    $project:{city:1, state:1, pop:1}, 
    $match:{state:{$in:['CA','NY']}}
}
])


db.zips.aggregate([
{$match:{state:{$in:["CT","NJ"]}}},
{$group:{_id:"$city",city_pop:{$sum:"$pop"}}},
{$match:{"city_pop":{$gt:25000}}},
{$group:{_id:"abc", avg:{$avg:"$city_pop"}}}
]); 



db.zips.aggregate([
{
    $match:{state:{$in:["NY","CA"]}}},
    {$group:{_id:{state:"$state",city:"$city"},total_pop:{$sum:"$pop"}}},
    {$match:{total_pop:{$gt:25000}}},
    {$group:{_id:"abc", "pop_avg":{$avg:"$total_pop"}}}
])

db.class.aggregate([
{$unwind: "$scores" },
{$match : { 'scores.type' : {$in: [ "homework", "exam"] } } }, 
{$group : { _id : { class_id:"$class_id", student_id:"$student_id"},student_avg : {$avg : "$scores.score" } } },
{$group:{_id:"$_id.class_id",class_avg:{$avg:"$student_avg"}}},
{$sort:{class_avg:-1}}
]);

db.zips.aggregate([
{$project: {first_char: {$substr : ["$city",0,1]}, pop:"$pop"}},
{$match:{first_char:{$in:["0","1","2","3","4","5","6","7","8","9"]}}},
{$group:{_id:"abc",total:{$sum:"$pop"}}}
])
