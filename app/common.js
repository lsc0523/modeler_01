/* 

common.js 

*/

var obj;

export function isNotEmpty(_str){
	obj = String(_str);
	if(obj == null || obj == undefined || obj == 'null' || obj == 'undefined' || obj == '' ) return false;
	else return true;

}

export function isEmpty(_str){
	return !isNotEmpty(_str);
}


//module.exports[ isNotEmpty , isEmpty ]