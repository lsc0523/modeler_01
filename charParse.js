

var mod = require("korean-text-analytics");
var task = new mod.TaskQueue();


export function parse(str){
    return new Promise((resolve , reject) => {
        mod.ExecuteMorphModule(str, function (err , rep){
            if(err){
                reject(err);
            }else{
                resolve(rep);
            }
        })
    })
}

