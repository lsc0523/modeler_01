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

export function NVC(_str){
	obj = String(_str);
	if(obj == null || obj == undefined || obj == 'null' || obj == 'undefined' || obj == '' ){
		return "";
	}else{
		return obj;
	}
}

export function getQueryData(sqlQuery, params){

	params.sqlQuery = sqlQuery;

	$.ajax({
		url: '/select',
		type: 'GET',
		data: params,
		dataType: 'text',
		success: function (data) {
			alert("조회에 성공하였습니다.");
			return data;
		},
		error: function (error) {
		  alert("조회에 실패하였습니다.");
		  return null;
		}
	  })
}