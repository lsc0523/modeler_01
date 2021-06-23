
var modelListJs = "modelList JS";
console.log(modelListJs);

var treeList = require('./treeView.js');

$(document).ready(function(){




  treeList.listree();
  //Page loading 
  //$("#user-table > tbody > tr").show();
  //$("#user-table > tbody").attr('style', "display:'';");
  //var temp = $("#user-table > tbody > tr > td:nth-child(n):contains('" + $('#keyword').val() + "')");
  // var temp = $("#user-table > tbody > tr > td:nth-child(n):contains('" + "조립" + "')");
  $("#user-table > tbody > tr").addClass('show_paging');
  
  jQuery('.pagination li:first-child').addClass("disabled");

  checkForHash();
  pagination();
  location.hash=""

  $("#keyword").keyup(function () {
    var k = $(this).val();
    $("#user-table > tbody > tr").hide();
    $("#user-table > tbody > tr > td:nth-child(n):contains('" + k + "')").parent().show();

  })

  $('#createModel').on('click', function(){
    
    var DB_MODELID;
    var DB_MODELCATID;

    $.ajax({
      url: '/companycheck',
      type:'GET',
      dataType: "json",
      async : false,
      success : function(data) {
        var ret = data['factory'];
        var ret2 = data['process1'];

        if($('#factory option:selected').text()=='NULL'){
          for(var i=0;i<ret.length;i++){
            if($('#company option:selected').text()==ret[i].MODELCATTYPENAME){
              DB_MODELID = ret[i].MODELCATTYPEID;
            }
          }
        }
        else{
          for(var i=0;i<ret.length;i++){
            if($('#factory option:selected').text()==ret[i].MODELCATTYPENAME){
              DB_MODELID = ret[i].MODELCATTYPEID;
            }
          }
        }

        if($('#process2 option:selected').text()=='NULL'){
          if($('#process1 option:selected').text()=='NULL'){
            DB_MODELCATID = "NULL";
          }
          else{
            for(var i=0;i<ret2.length;i++){
              if($('#process1 option:selected').text()==ret2[i].MODELCATNAME){
                DB_MODELCATID = ret2[i].MODELCATID;
              }
            }
          }       
        }
        else{
          for(var i=0;i<ret2.length;i++){
            if($('#process2 option:selected').text()==ret2[i].MODELCATNAME){
              DB_MODELCATID = ret2[i].MODELCATID;
            }
          }
        }


      },
      error : function(error) {
        alert("메일 전송이 실패하였습니다.");
      }
    });
    str_hash = $("#company option:selected").text() + "^" + $('#factory option:selected').text() + "^" + $('#process1 option:selected').text() + "^" + $('#process2 option:selected').text() + "^" + $(".page-item.active > a").text();
    location.hash = "#" + str_hash;
    window.location ="/modeler?DB_ID="+DB_MODELID+"&DB_CATID="+DB_MODELCATID;
  });
//수정
  $('#company').on('change',function(){

    $.ajax({
      url: '/companycheck',
      type:'GET',
      dataType: "json",
      async : false,
      success : function(data) {

        var ret = data['factory'];
        var ret2 = data['process1'];
        var selectElem = document.getElementById("factory");
        var selectElem2 = document.getElementById("process1");
        var target;

        $('#factory').empty();
        $('#process1').empty();
        $('#process2').empty();
        $('#factory').append($('<option>NULL</option>'));
        $('#process1').append($('<option>NULL</option>'));
        $('#process2').append($('<option>NULL</option>'));

        for(var i=0;i<ret.length;i++){
          if(ret[i].MODELCATTYPENAME==$('#company option:selected').text()){
            target = ret[i].MODELCATTYPEID;
          }
        }

          
        for(var i=0;i<ret.length;i++){
          if(ret[i].MODELCATTYPEID_PR==target){
            var element = document.createElement("option");
            element.innerText = ret[i].MODELCATTYPENAME;
            element.value = ret[i].MODELCATTYPENAME;
            selectElem.append(element);
          }
        }

        for(var i=0;i<ret2.length;i++){
          if(ret2[i].MODELCATTYPEID==target && !ret2[i].MODELCATID_PR){
            var element = document.createElement("option");
            element.innerText = ret2[i].MODELCATNAME;
            element.value = ret2[i].MODELCATNAME;
            selectElem2.append(element);
          }
        }
        
        $("#user-table > tbody > tr").hide();
        $("#user-table > tbody > tr").removeClass('show_paging');
       
        if($("#company option:selected").text()=="NULL"){
          $("#user-table > tbody > tr").show();
          $("#user-table > tbody > tr").addClass('show_paging');
        }
        else{
          $("#user-table > tbody > tr > td:nth-child(6):contains('" + target + "')").parent().show();
          $("#user-table > tbody > tr > td:nth-child(6):contains('" + target + "')").parent().addClass('show_paging');
          for(var i=0;i<ret.length;i++){
            if(ret[i].MODELCATTYPEID_PR==target){
              $("#user-table > tbody > tr > td:nth-child(6):contains('" + ret[i].MODELCATTYPEID + "')").parent().show();
              $("#user-table > tbody > tr > td:nth-child(6):contains('" + ret[i].MODELCATTYPEID + "')").parent().addClass('show_paging');
            }
          }
        }
        },
      error : function(error) {
          alert("메일 전송이 실패하였습니다.");
        }

    });

    pagination();
  });

  $('#factory').on('change',function(){

    $.ajax({
      url: '/companycheck',
      type:'GET',
      dataType: "json",
      async: false,
      success : function(data) {

        var ret = data['factory'];
        var ret2 = data['process1'];
        var selectElem = document.getElementById("factory");
        var selectElem2 = document.getElementById("process1");
        var target;
        var target_company;

        $('#process1').empty();
        $('#process2').empty();
        $('#process1').append($('<option>NULL</option>'));
        $('#process2').append($('<option>NULL</option>'));

        for(var i=0;i<ret.length;i++){
          if(ret[i].MODELCATTYPENAME==$('#factory option:selected').text()){
            target = ret[i].MODELCATTYPEID;
          }
        }

        for(var i=0;i<ret.length;i++){
          if(ret[i].MODELCATTYPENAME==$('#company option:selected').text()){
            target_company = ret[i].MODELCATTYPEID;
          }
        }
        
        $("#user-table > tbody > tr").hide();
        $("#user-table > tbody > tr").removeClass('show_paging');

        if($("#factory option:selected").text()=="NULL"){
          $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_company + "')").parent().show();
          $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_company + "')").parent().addClass('show_paging');
          for(var i=0;i<ret.length;i++){
            if(ret[i].MODELCATTYPEID_PR==target_company){
              $("#user-table > tbody > tr > td:nth-child(6):contains('" + ret[i].MODELCATTYPEID + "')").parent().show();
              $("#user-table > tbody > tr > td:nth-child(6):contains('" + ret[i].MODELCATTYPEID + "')").parent().addClass('show_paging');
            }
          }

          for(var i=0;i<ret2.length;i++){
            if(ret2[i].MODELCATTYPEID==target_company && !ret2[i].MODELCATID_PR){
              var element = document.createElement("option");
              element.innerText = ret2[i].MODELCATNAME;
              element.value = ret2[i].MODELCATNAME;
              selectElem2.append(element);
            }
          }

        }
        else{
          $("#user-table > tbody > tr > td:nth-child(6):contains('" + target + "')").parent().show();
          $("#user-table > tbody > tr > td:nth-child(6):contains('" + target + "')").parent().addClass('show_paging');

          for(var i=0;i<ret2.length;i++){
            if(ret2[i].MODELCATTYPEID==target && !ret2[i].MODELCATID_PR){
              var element = document.createElement("option");
              element.innerText = ret2[i].MODELCATNAME;
              element.value = ret2[i].MODELCATNAME;
              selectElem2.append(element);
            }
          }
        }
        },
      error : function(error) {
          alert("메일 전송이 실패하였습니다.");
        }

    });
    pagination();
  });

  $('#process1').on('change', function(){

    $.ajax({
      url: '/companycheck',
      type:'GET',
      dataType: "json",
      async : false,
      success : function(data) {

        var ret =data['factory'];
        var ret2 = data['process1'];
        var selectElem2 = document.getElementById("process2");
        var target;
        var target_company;
        var target_factory;
    
        $('#process2').empty();
        $('#process2').append($('<option>NULL</option>'));

        for(var i=0;i<ret2.length;i++){
          if(ret2[i].MODELCATNAME==$('#process1 option:selected').text()){
            target = ret2[i].MODELCATID;
          }
        }

        for(var i=0;i<ret.length;i++){
          if(ret[i].MODELCATTYPENAME==$('#company option:selected').text()){
            target_company = ret[i].MODELCATTYPEID;
          }
        }

        for(var i=0;i<ret.length;i++){
          if(ret[i].MODELCATTYPENAME==$('#factory option:selected').text()){
            target_factory = ret[i].MODELCATTYPEID;
          }
        }

        for(var i=0;i<ret2.length;i++){
          if(ret2[i].MODELCATID_PR==target){
            var element = document.createElement("option");
            element.innerText = ret2[i].MODELCATNAME;
            element.value = ret2[i].MODELCATNAME;
            selectElem2.append(element);
          }
        }

        $("#user-table > tbody > tr").hide();
        $("#user-table > tbody > tr").removeClass('show_paging');

        if($("#process1 option:selected").text()=="NULL"){
          if($("#factory option:selected").text()=="NULL"){
            $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_company + "')").parent().show();
            $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_company + "')").parent().addClass('show_paging');
          }
          else{
            $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_factory + "')").parent().show();
            $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_factory + "')").parent().addClass('show_paging');
          }
        }
        else{

          $("#user-table > tbody > tr > td:nth-child(7):contains('" + target + "')").parent().show();
          $("#user-table > tbody > tr > td:nth-child(7):contains('" + target + "')").parent().addClass('show_paging');

          for(var i=0;i<ret2.length;i++){
            if(ret2[i].MODELCATID_PR==target){
              $("#user-table > tbody > tr > td:nth-child(7):contains('" + ret2[i].MODELCATID + "')").parent().show();
              $("#user-table > tbody > tr > td:nth-child(7):contains('" + ret2[i].MODELCATID + "')").parent().addClass('show_paging');
              // $(temp2).parent().show();
            }
          }

        }

        },
      error : function(error) {
          alert("메일 전송이 실패하였습니다.");
        }
      
    });
    pagination();
  });

  $('#process2').on('change',function(){
    

    $.ajax({
      url: '/companycheck',
      type:'GET',
      dataType: "json",
      async : false,
      success : function(data) {

        var ret =data['factory'];
        var ret2 = data['process1'];
        var target;
        var target_process2;

        for(var i=0;i<ret2.length;i++){
          if(ret2[i].MODELCATNAME==$('#process1 option:selected').text()){
            target = ret2[i].MODELCATID;
          }
        }

        for(var i=0;i<ret2.length;i++){
          if(ret2[i].MODELCATNAME==$('#process2 option:selected').text()){
            target_process2 = ret2[i].MODELCATID;
          }
        }

        $("#user-table > tbody > tr").hide();
        $("#user-table > tbody > tr").removeClass('show_paging');

        if($("#process2 option:selected").text()=="NULL"){
          $("#user-table > tbody > tr > td:nth-child(7):contains('" + target + "')").parent().show();
          $("#user-table > tbody > tr > td:nth-child(7):contains('" + target + "')").parent().addClass('show_paging');

          for(var i=0;i<ret2.length;i++){
            if(ret2[i].MODELCATID_PR==target){
              $("#user-table > tbody > tr > td:nth-child(7):contains('" + ret2[i].MODELCATID + "')").parent().show();
              $("#user-table > tbody > tr > td:nth-child(7):contains('" + ret2[i].MODELCATID + "')").parent().addClass('show_paging');
              // $(temp2).parent().show();
            }
          }
        }
        else{
          $("#user-table > tbody > tr > td:nth-child(7):contains('" + target_process2 + "')").parent().show();
          $("#user-table > tbody > tr > td:nth-child(7):contains('" + target_process2 + "')").parent().addClass('show_paging');
        }

        },
      error : function(error) {
          alert("메일 전송이 실패하였습니다.");
        }
      
    });
    pagination();
    // if($('#process2 option:selected').text()=='NULL'){
    //   $("#user-table > tbody > tr > td:nth-child(11):contains('" + $("#process1 option:selected").text() + "')").parent().show();
    // }
    // else{
    //   $("#user-table > tbody > tr > td:nth-child(11):contains('" + $("#process2 option:selected").text() + "')").parent().show();
    // }
  });

  var alert_select_value = function(select_obj){
    var selected_index = select_obj.selectedIndex;
    var selected_value = select_obj.options[selected_index].value;

    $("#user-table > tbody > tr").hide();
    $("#user-table > tbody > tr > td:nth-child(n):contains('" + selected_value + "')").parent().show();

  }

  $('#Progress_Loading').hide();

  $(document).ajaxStart(function(){
    $('#Progress_Loading').show(); //ajax실행시 로딩바를 보여준다.
  })

  $(document).ajaxStop(function(){
    $('#Progress_Loading').hide(); //ajax종료시 로딩바를 숨겨준다.
  });

  $("#delete").on('click', function (e) {
    e.preventDefault();
    var checkDelete = confirm("삭제 하시겠습니까?");

    if (checkDelete) {
      var returnurl = window.location.pathname;
      var href = $(this).attr("href");
      //window.location = href;
      //window.location = returnurl;
      var $checklist = $(".trModel.show_paging input[type='checkbox']:checked").parent().parent()
      var modellist;

      for(var i=0;i<$checklist.length;i++){
        $.ajax({
          url: '/delete',
          type: 'GET',
          async: false,
          data: {
            id: $checklist[i].children[7].innerText,
            page : returnurl.split('/')[2]
          },
          dataType: 'text',
          success: function (data) {
              //Row 삭제
              // e.target.parentNode.parentNode.parentNode.remove();
              //alert("삭제 성공하였습니다.");
          },
          error: function (error) {
            print(error);
            alert("삭제 실패하였습니다. 재시도 하시기 바랍니다.");
            window.location = returnurl;
          }
        })
      }  

      if (typeof window !== 'undefined') { alert("삭제 성공하였습니다.") };
      var categoryCompany = $('#company option:selected').text();
      var categoryFactory = $('#factory option:selected').text();
      var categoryProcess1 = $('#process1 option:selected').text();
      var categoryProcess2 = $('#process2 option:selected').text();

      str_hash = $("#company option:selected").text() + "^" + $('#factory option:selected').text() + "^" + $('#process1 option:selected').text() + "^" + $('#process2 option:selected').text() + "^" + $(".page-item.active > a").text()
      location.hash = "#" + str_hash;
      location.reload();
      //$("#user-table > tbody > tr").hide();
    }
  });

  $("#copy").on('click', function (e) {
    e.preventDefault();
    var checkDelete = confirm("복사 하시겠습니까?");

    if (checkDelete) {
      var returnurl = window.location.pathname;
      var href = $(this).attr("href");
      var $checklist = $(".trModel.show_paging input[type='checkbox']:checked").parent().parent();
      var modellist;

      for(var i=0;i<$checklist.length;i++){

        var formData = new FormData();
        formData.append("id", $checklist[i].children[9].innerText);
        //formData.append("modelID", modelID[0].innerText);
        formData.append("type", $checklist[i].children[5].innerText);
        formData.append("modelCatID", $checklist[i].children[6].innerText);
        formData.append("processID", $checklist[i].children[8].innerText);
        formData.append("historyYN", false);
        formData.append("modelName", $checklist[i].children[2].innerText+"_copy");
        formData.append("modelDetailName", $checklist[i].children[3].innerText);
        formData.append("modelComment" , "");
        formData.append("diagramCnt" , $checklist[i].children[10].innerText);

        $.ajax({
          url: "/insert",
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          enctype: 'multipart/form-data',
          async: false,
          success: function (data) {
            //alert("저장이 완료 되었습니다.");
            //window.location.href = 'home/1';
            //window.location.href = 'modeler?id=' + data.id;
          },
          error: function (error) {
            alert("Error!");
          }
    
        });
      }  

      if (typeof window !== 'undefined') { alert("복사 성공하였습니다.") };
      str_hash = $("#company option:selected").text() + "^" + $('#factory option:selected').text() + "^" + $('#process1 option:selected').text() + "^" + $('#process2 option:selected').text() + "^" + $(".page-item.active > a").text()
      location.hash = "#" + str_hash;
      location.reload();
    }
  });

});

$('#btn_user').on('click', function(){
    var url= "/userPopup";    
    var winWidth = 1060;
    var winHeight = 620;
    var popupOption= "width="+winWidth+", height="+winHeight;
    var myWindow = window.open(url,"userPopup",popupOption);  
});


/*
$('.viewHistory').on('click', function (e) {

    if ($(e.target).hasClass("clicktd")) {

      if ($('#history_layer').is(':visible')) {
        $('#history_layer').hide();
        $('#history_layer').removeAttr('name');
      }
      else {
        var top = e.clientY - 20;
        var left = e.clientX - 40;
        $('#history_layer').attr('name', $(this)[0].children[1].textContent);
        $('#history_layer').css({
          "top": top +$(window).scrollTop(),
          "left": left,
          "position": "absolute"
        }).show();
      }
    }
});
*/

$.contextMenu({
      selector: '.context-menu-one', 
      trigger: 'left',
      callback: function(key, options) {
          var m = "clicked: " + key;
          //window.console && console.log(m) || alert(m); 
          var modelId = options.$trigger[0].id;

          if(key == 'edit'){
            str_hash = $("#company option:selected").text() + "^" + $('#factory option:selected').text() + "^" + $('#process1 option:selected').text() + "^" + $('#process2 option:selected').text() + "^" + $(".page-item.active > a").text()
            location.hash = "#" + str_hash;
            window.location = "/modeler?id=" + modelId;
          }
          else if(key == 'delete'){
            var checkDelete = confirm("삭제하시겠습니까?");

            if (checkDelete) {
              str_hash = $("#company option:selected").text() + "^" + $('#factory option:selected').text() + "^" + $('#process1 option:selected').text() + "^" + $('#process2 option:selected').text() + "^" + $(".page-item.active > a").text()
            location.hash = "#" + str_hash;
              window.location = "/delete?id=" + modelId;
            }
          }
          else if(key == 'open'){
            str_hash = $("#company option:selected").text() + "^" + $('#factory option:selected').text() + "^" + $('#process1 option:selected').text() + "^" + $('#process2 option:selected').text() + "^" + $(".page-item.active > a").text()
            location.hash = "#" + str_hash;
            window.location = "/viewer?id=" + modelId;

          }
          else if (key == 'history'){
            str_hash = $("#company option:selected").text() + "^" + $('#factory option:selected').text() + "^" + $('#process1 option:selected').text() + "^" + $('#process2 option:selected').text() + "^" + $(".page-item.active > a").text()
            location.hash = "#" + str_hash;
            window.location = '/history/1?id=' + modelId;
          }
      },
      items: {
          "edit": {name: "수정", icon: "edit"},
          "open": {name: "열기", icon: "copy"},
          // "delete": {name: "삭제", icon: "delete"},
          "history" : {name : "이력보기" , icon : "paste"},
          "sep1": "---------",
          "quit": {name: "나가기", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
      }
});

$('#history_layer').on('click', function(e){
  var s = '';
  console.log($(this).attr('name'));
  window.location = '/history/1?id=' + $(this).attr('name');
});

$(document).on('click', '[name="historyclick"]', function () {
  var s = "";
});

// $(document).on('click', '.trModel', function (e) {
  
//   if (!this.children[0].childNodes[0].checked)
//   {
//   // if (this.cusor ! =)

//     var modelId =  this.children[7].innerText;
//     str_hash = $("#company option:selected").text() + "^" + $('#factory option:selected').text() + "^" + $('#process1 option:selected').text() + "^" + $('#process2 option:selected').text() + "^" + $(".page-item.active > a").text()
//     location.hash = "#" + str_hash;
//     window.location = "/modeler?id=" + modelId;
//    }
// });



// tr 클릭이벤트. 체크박스 제외
$('.modelDesc').click(function(e){

  // if (e.target.nodeName=='INPUT' || e.target.nodeName=='BUTTON' || e.target.nodeName=='IMG'  ) return;

//  if ( e.target.id == '#modelDesc')
//   {

  var modelId =  this.parentElement.children[7].innerText;
  str_hash = $("#company option:selected").text() + "^" + $('#factory option:selected').text() + "^" + $('#process1 option:selected').text() + "^" + $('#process2 option:selected').text() + "^" + $(".page-item.active > a").text()
  location.hash = "#" + str_hash;
  window.location = "/modeler?id=" + modelId;
  // }
})


//test
// $(function(){
//   $(window).scroll(function(){  //스크롤하면 아래 코드 실행
//          var num = $(this).scrollTop();  // 스크롤값
//          if( num > 52 ){  // 스크롤을 36이상 했을 때
//             $(".section2").css("top",(num-45)+"px");
//          }else{
//              $(".section2").css("position","relative");
//              $(".section2").css("top","52px");
//          }
//     });
//   });
//Javascript
// var count = 0;
// //스크롤 바닥 감지
// window.onscroll = function(e) {
//     //추가되는 임시 콘텐츠
//     //window height + window scrollY 값이 document height보다 클 경우,

//     var maxHeight = $(document).height();
//     var currentScroll = $(window).scrollTop() + $(window).height();

//     if (maxHeight <= currentScroll) {
//     //if((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
//       //실행할 로직 (콘텐츠 추가)
//         count++;
//         //var addContent = '<div class="block"><p>'+ count +'번째로 추가된 콘텐츠</p></div>';
//         //article에 추가되는 콘텐츠를 append
//         //$('article').append(addContent);
//         $.ajax({
//           url: '/modelListData',
//           type: 'GET',
//           data: {
//             startpage: count * 15 , 
//             endpage : (count +1) * 15
//           },
//           dataType: 'json',
//           success: function (data) {
//               //alert(data);
//             for(var i=1; i < data.data.length; i++){
//               $('.tableBody').append('<tr style="background-color: #ffffff; border: 1px solid hsl(0 0% 87% / 1);">' +        
//                                 '<td><input type="checkbox"></td>'+
//                                 '<td style="display : none;">' + data.data[i].MODELID +'</td>' +
//                                 '<td>' + data.data[i].PROCESSID +'</td>' +
//                                 '<td>' + data.data[i].MODELNAME +'</td>' +
//                                 '<td>' + data.data[i].MODELDESC +'</td>' +
//                                 '<td style="padding-left: 20px;">' + data.data[i].MODELDIAGRAM_CNT +'</td>' +
//                                 '<td>' + data.data[i].UPDDTTM +'</td>' +
//                                 '<td>' + data.data[i].INSUSER +'</td>' +
//                                 '<td>' + data.data[i].UPDUSER +'</td>' +
//                                 '<td> <button class="context-menu-one" style="background-color: #ffffff;" id=' + data.data[i].MODELID + '>' +
//                                 '<img src="/menu.svg" style="padding-right: 5px;" with="13", height="13">' +            
//                                 '</button> </td>' 
//                               + '</tr>'+
//                               '<tr>'+
//                                '<td></td>'+
//                               '</tr>'                                
//                               );                
//              }
//           }
//           ,
//           error: function (error) {
//             alert("예상치 못한 에러가 발생하였습니다 [ERROR-01]");
//           }
//         })
//     }
// };


$(document).on('click','#SendMail',function(){
  //var pcode=$(this).attr('id'); //이거는 해당 element의 id value값을 가져오는것.
  var mailAddress = $(this).parents('span').parents('li')[0].childNodes[0].textContent;

  if(mailAddress.trim() != "" && 
      mailAddress.trim() != undefined && 
      mailAddress.trim() != 'undefined'){
      
    $.ajax({
        url: '/mailSend',
        type:'GET',
        data : { email : mailAddress},
        dataType: "json",  
        success : function(data) {

          if(data.result == 'ok'){
            alert("메일 전송이 성공하였습니다.");
          }else{
            alert("메일 전송이 실패하였습니다.");
          }
          //window.location.href = '/home/1';
        },
        error : function(error) {
          alert("메일 전송이 실패하였습니다.");
        }

    });

  }
  else{
    alert("메일주소를 확인하시기 바랍니다.");
  }
  
});

$('#th_checkAll').on('click', function(e){
  if( $("#th_checkAll").is(':checked')){
    $(".trModel.show_paging.show_inpage input[name=checkRow]").prop("checked", true);
  }
  else{
    $(".trModel.show_paging.show_inpage input[name=checkRow]").prop("checked", false);
  }
});

// jQuery('.pagination a').click(function(e) {
//   e.preventDefault();
//   $tr.hide();
//   var page = jQuery(this).text();

//   if ($(this).attr('aria-label')=='Next'){
//     drawPage( (Math.floor(($(".page-item.active > a").text()-1)/page_num_row)+1)*page_num_row + 1);
//     // page = (Math.floor(($(".page-item.active > a").text()-1)/page_num_row))*page_num_row + 1
//   }
//   else if($(this).attr('aria-label')=='Previous'){
//     drawPage( (Math.floor(($(".page-item.active > a").text()-1)/page_num_row))*page_num_row);
//   }
//   else{
//     jQuery('.pagination li').removeClass("active");
//     jQuery(this).parent().addClass("active");
//   }

//   page = $(".page-item.active > a").text(); 
//   var temp = page - 1;
//   var start = temp * req_num_row;
//   var current_link = temp;

//   for (var i = 0; i < req_num_row; i++) {
//     $tr.eq(start + i).show();
//   }

// });

function pagination() {
	var req_num_row = 20;  //화면에 표시할 목록 개수
  var page_num_row = 5;  //화면에 표시할 paging 개수
  var page_number = 1;   //화면에서 가리키는 page 위치
	var $tr = jQuery('.tableBody .show_paging');  // paging 대상 class 명
	var total_num_row = $tr.length;
	var num_pages = 0;
	if (total_num_row % req_num_row == 0) {
		num_pages = total_num_row / req_num_row;
	}
	if (total_num_row % req_num_row >= 1) {
		num_pages = total_num_row / req_num_row;
		num_pages++;
		num_pages = Math.floor(num_pages++);
	}
  var start = 0;

  if(location.hash){
    var str_hash = location.hash;
    str_hash = decodeURI(str_hash.replace("#",""));
    arr_curpage = str_hash.split("^");
    page_number = parseInt(arr_curpage[4]);

    start = (page_number-1) * req_num_row;
  }

  drawPage(page_number);
  // jQuery('.pagination').empty();
	// jQuery('.pagination').append('<li class="page-item">'
	// 				+ '<a class="page-link" href="#" tabindex="-1"aria-label="Previous">'
	// 				+ '<span aria-hidden="true">&laquo;</span>'
	// 				+ '<span class="sr-only">Previous</span></a></li>');

	// for (var i = 1; i <= num_pages && i <= page_num_row ; i++) {
	// 	jQuery('.pagination').append('<li class="page-item "><a class="page-link" href="#">' + (Math.floor((page_number-1)/page_num_row)*page_num_row+i) + '</a></li>');
	// 	jQuery('.pagination li:nth-child(2)').addClass("active");
	// 	jQuery('.pagination a').addClass("pagination-link");
	// }

	// jQuery('.pagination').append('<li class="page-item">'
	// 				+ '<a class="page-link" href="#" aria-label="Next">'
	// 				+ ' <span aria-hidden="true">&raquo;</span>'
	// + '<span class="sr-only">Next</span></a></li>');


  // if (page_number <= page_num_row){
  //   $('.pagination li:first-child').css('visibility','hidden');
  // }
  // else{
  //   $('.pagination li:first-child').css('visibility','');
  // }

  // if(num_pages <= page_num_row || page_number >= (num_pages-page_num_row+1) ){
  //   $('.pagination li:last-child').css('visibility','hidden');
  // }
  // else{
  //   $('.pagination li:last-child').css('visibility','');
  // }
  
  // if(location.hash){
  //   var str_hash = location.hash;
  //   str_hash = decodeURI(str_hash.replace("#",""));
  //   arr_curpage=str_hash.split("^");
  //   page_number = parseInt(arr_curpage[4]);

  //   start = (page_number-1) * req_num_row;

  //   jQuery('.pagination li').removeClass("active");
  //   $('.pagination li').eq(page_number).addClass("active");
	// 	// jQuery(this).parent().addClass("active");
  // }

  $("tr input[name=checkRow]").prop("checked", false);
  $("tr input[name=checkAll]").prop("checked", false);
  $(".trModel.show_paging.show_inpage").removeClass("show_inpage");

  $tr.hide();
	$tr.each(function(i) {
		//jQuery(this).hide();

    // if(location.hash){
    //   var str_hash = location.hash;
    //   str_hash = decodeURI(str_hash.replace("#",""));
    //   arr_curpage=str_hash.split("^");
    //   start = (parseInt(arr_curpage[4])-1) * req_num_row;
    // }

		if (i + 1 <= req_num_row) {
			$tr.eq(start+i).show();
      $tr.eq(start+i).addClass("show_inpage");
		}

	});

	jQuery('.pagination a').click(function(e) {
		e.preventDefault();
		$tr.hide();
		var page = jQuery(this).text();

    if ($(this).attr('aria-label')=='Next'){
      var next_num = (Math.floor(($(".page-item.active > a").text()-1)/page_num_row)+1)*page_num_row + 1;
      //drawPage(next_num);
      for (var i = 1; i <= num_pages && i <= page_num_row ; i++) {
        $('.pagination li').eq(i).children(0).text(next_num);
        next_num += 1;
      }

      for (var i = 1; i <= page_num_row ; i++) {
        if($('.pagination li').eq(i).children(0).text() > num_pages){
          $('.pagination li').eq(i).css('display','none');
        }
        else{
          $('.pagination li').eq(i).css('display','');
        }
      }

      $('.pagination li').removeClass("active");
      $('.pagination li').eq(1).addClass("active");

      if ($('.pagination li').eq(1).children(0).text() <= page_num_row){
        $('.pagination li:first-child').css('visibility','hidden');
      }
      else{
        $('.pagination li:first-child').css('visibility','');
      }
      if(num_pages <= page_num_row || $('.pagination li').eq(1).children(0).text() >= (num_pages-page_num_row+1) ){
        $('.pagination li:last-child').css('visibility','hidden');
      }
      else{
        $('.pagination li:last-child').css('visibility','');
      }
    }
    else if($(this).attr('aria-label')=='Previous'){
      var next_num = (Math.floor(($(".page-item.active > a").text()-1)/page_num_row))*page_num_row;
      //drawPage(next_num);
      for (var i = 1; i <= num_pages && i <= page_num_row ; i++) {
        $('.pagination li').eq(i).children(0).text(next_num-(page_num_row)+i);
        
      }

      for (var i = 1; i <= page_num_row ; i++) {
        if($('.pagination li').eq(i).children(0).text() > num_pages){
          $('.pagination li').eq(i).css('display','none');
        }
        else{
          $('.pagination li').eq(i).css('display','');
        }
      }

      $('.pagination li').removeClass("active");
      $('.pagination li').eq(page_num_row).addClass("active");

      if ( $('.pagination li').eq(page_num_row).children(0).text() <= page_num_row){
        $('.pagination li:first-child').css('visibility','hidden');
      }
      else{
        $('.pagination li:first-child').css('visibility','');
      }
  
      if(num_pages <= page_num_row || $('.pagination li').eq(1).children(0).text() >= (num_pages-page_num_row+1) ){
        $('.pagination li:last-child').css('visibility','hidden');
      }
      else{
        $('.pagination li:last-child').css('visibility','');
      }
    }
    else{
      jQuery('.pagination li').removeClass("active");
      jQuery(this).parent().addClass("active");
    }

    page = $(".page-item.active > a").text(); 
		var temp = page - 1;
		var start = temp * req_num_row;
		var current_link = temp;

    $("tr input[name=checkRow]").prop("checked", false);
    $("tr input[name=checkAll]").prop("checked", false);
    $(".trModel.show_paging.show_inpage").removeClass("show_inpage");

		for (var i = 0; i < req_num_row; i++) {
			$tr.eq(start + i).show();
      $tr.eq(start+i).addClass("show_inpage");
      
		}
 
    // console.log($(this).html().indexOf('Next'));
    // if($(this).html().indexOf('Next') <= -1 && $(this).html().indexOf('Previous') <= -1){
    // $pageItem.removeClass("active");
    // $(this).addClass("active");
  

		// if (temp >= 1) {
		// 	jQuery('.pagination li:first-child').removeClass("disabled");
		// } else {
		// 	jQuery('.pagination li:first-child').addClass("disabled");
		// }

    // if (page == '«Previous'){
    //   if (page === 1) {
    //     page = Math.ceil($('.pagination .post').length/pageSize);
    // } else {
    //     page--;
    // }
    // console.log(page);
    // showPage(page);
    // }

	});

  $('#prev').click(prevPage);
  $('#next').click(nextPage);
  // $(document).ready(function(){
  //   var $pageItem = $(".pagination li")

  //   $pageItem.click(function(){
  //     console.log($(this).html().indexOf('Next'));
  //     if($(this).html().indexOf('Next') <= -1 && $(this).html().indexOf('Previous') <= -1){
  //     $pageItem.removeClass("active");
  //     $(this).addClass("active");
  //       }
  //   });
  // });

  function prevPage() {
    debugger;
    if (page === 1) {
        page = Math.ceil($('.pagination .post').length/pageSize);
    } else {
        page--;
    }
    console.log(page);
    showPage(page);
  }

  function nextPage() {
    if (page == Math.ceil($('.pagination .post').length/pageSize)) {
        page = 1;
    } else {
        page++;
    }
    showPage(page);
  }

  function drawPage(page_number){
    jQuery('.pagination').empty();
    jQuery('.pagination').append('<li class="page-item">'
            + '<a class="page-link" href="#" tabindex="-1"aria-label="Previous">'
            + '<span aria-hidden="true">&laquo;</span>'
            + '<span class="sr-only">Previous</span></a></li>');

    for (var i = 1; i <= num_pages && i <= page_num_row ; i++) {
      jQuery('.pagination').append('<li class="page-item "><a class="page-link" href="#">' + (Math.floor((page_number-1)/page_num_row)*page_num_row+i) + '</a></li>');
      //jQuery('.pagination li:nth-child('+page_number+')').addClass("active");
      jQuery('.pagination a').addClass("pagination-link");
    }

    for (var i = 1; i <= page_num_row ; i++) {
      if($('.pagination li').eq(i).children(0).text() > num_pages){
        $('.pagination li').eq(i).css('display','none');
      }
      else{
        $('.pagination li').eq(i).css('display','');
      }
    }

    $('.pagination li').removeClass("active");
    jQuery('.pagination li:nth-child('+ (page_number%page_num_row+1) +')').addClass("active");

    jQuery('.pagination').append('<li class="page-item">'
            + '<a class="page-link" href="#" aria-label="Next">'
            + ' <span aria-hidden="true">&raquo;</span>'
    + '<span class="sr-only">Next</span></a></li>');


    if (page_number <= page_num_row){
      $('.pagination li:first-child').css('visibility','hidden');
    }
    else{
      $('.pagination li:first-child').css('visibility','');
    }

    if(num_pages <= page_num_row || page_number >= (num_pages-page_num_row+1) ){
      $('.pagination li:last-child').css('visibility','hidden');
    }
    else{
      $('.pagination li:last-child').css('visibility','');
    }
  }

	jQuery('.prev').click(function(e) {
		e.preventDefault();
		jQuery('.pagination li:first-child').removeClass("active");
	});

	jQuery('.next').click(function(e) {
		e.preventDefault();
		jQuery('.pagination li:last-child').removeClass("active");
	});

}

function checkForHash(){
  if(location.hash){
    var str_hash = location.hash;
    str_hash = decodeURI(str_hash.replace("#",""));
    arr_curpage=str_hash.split("^");

    $.ajax({
      url: '/companycheck',
      type:'GET',
      dataType: "json",
      async : false,
      success : function(data) {

        var ret = data['factory'];
        var ret2 = data['process1'];
        var target_company = null; 
        var target_factory = null; 
        var target_process1 = null;
        var target_process2 = null;

        $('#company').empty();
        $('#factory').empty();
        $('#process1').empty();
        $('#process2').empty();
        $('#company').append($('<option>NULL</option>'));
        $('#factory').append($('<option>NULL</option>'));
        $('#process1').append($('<option>NULL</option>'));
        $('#process2').append($('<option>NULL</option>'));
          
        for(var i=0;i<ret.length;i++){
          if(!ret[i].MODELCATTYPEID_PR){
            var element = document.createElement("option");
            element.innerText = ret[i].MODELCATTYPENAME;
            element.value = ret[i].MODELCATTYPENAME
            $('#company').append(element);

            if(ret[i].MODELCATTYPENAME==arr_curpage[0]){
              target_company = ret[i].MODELCATTYPEID;
            }
          }
          else if(ret[i].MODELCATTYPEID_PR==target_company){
            var element = document.createElement("option");
            element.innerText = ret[i].MODELCATTYPENAME;
            element.value = ret[i].MODELCATTYPENAME;
            $('#factory').append(element);

            if(ret[i].MODELCATTYPENAME==arr_curpage[1]){
              target_factory = ret[i].MODELCATTYPEID;
            }
          }
        }

        $('#company').val(arr_curpage[0]).attr("selected","selected");
        $('#factory').val(arr_curpage[1]).attr("selected","selected");

        if(target_factory!=null){
          target_company = target_factory;
        }

        for(var i=0;i<ret2.length;i++){
          if(!ret2[i].MODELCATID_PR && ret2[i].MODELCATTYPEID==target_company){
            var element = document.createElement("option");
            element.innerText = ret2[i].MODELCATNAME;
            element.value = ret2[i].MODELCATNAME;
            $('#process1').append(element);

            if(ret2[i].MODELCATNAME==arr_curpage[2]){
              target_process1 = ret2[i].MODELCATID;
            }
          }
          else if(ret2[i].MODELCATID_PR==target_process1 && ret2[i].MODELCATTYPEID==target_company){
            var element = document.createElement("option");
            element.innerText = ret2[i].MODELCATNAME;
            element.value = ret2[i].MODELCATNAME;
            $('#process2').append(element);

            if(ret2[i].MODELCATNAME==arr_curpage[3]){
              target_process2 = ret2[i].MODELCATID;
            }
          }
        }

        $('#process1').val(arr_curpage[2]).attr("selected","selected");
        $('#process2').val(arr_curpage[3]).attr("selected","selected");

        $("#user-table > tbody > tr").hide();
        $("#user-table > tbody > tr").removeClass('show_paging');

        if($("#process2 option:selected").text()!="NULL"){
          $("#user-table > tbody > tr > td:nth-child(7):contains('" + target_process2 + "')").parent().show();
          $("#user-table > tbody > tr > td:nth-child(7):contains('" + target_process2 + "')").parent().addClass('show_paging');
        }
        else if($("#process1 option:selected").text()!="NULL"){
          $("#user-table > tbody > tr > td:nth-child(7):contains('" + target_process1 + "')").parent().show();
          $("#user-table > tbody > tr > td:nth-child(7):contains('" + target_process1 + "')").parent().addClass('show_paging');

          for(var i=0;i<ret2.length;i++){
            if(ret2[i].MODELCATID_PR==target_process1){
              $("#user-table > tbody > tr > td:nth-child(7):contains('" + ret2[i].MODELCATID + "')").parent().show();
              $("#user-table > tbody > tr > td:nth-child(7):contains('" + ret2[i].MODELCATID + "')").parent().addClass('show_paging');
              // $(temp2).parent().show();
            }
          }
        }
        else if($("#factory option:selected").text()!="NULL"){          
          $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_company + "')").parent().show();
          $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_company + "')").parent().addClass('show_paging');
        }
        else{
          $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_company + "')").parent().show();
          $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_company + "')").parent().addClass('show_paging');
          for(var i=0;i<ret.length;i++){
            if(ret[i].MODELCATTYPEID_PR==target_company){
              $("#user-table > tbody > tr > td:nth-child(6):contains('" + ret[i].MODELCATTYPEID + "')").parent().show();
              $("#user-table > tbody > tr > td:nth-child(6):contains('" + ret[i].MODELCATTYPEID + "')").parent().addClass('show_paging');
            }
          }
        }
        //test
        // $("#user-table > tbody > tr").hide();
        // $("#user-table > tbody > tr").removeClass('show_paging');
       
        // if($("#company option:selected").text()=="NULL"){
        //   $("#user-table > tbody > tr").show();
        //   $("#user-table > tbody > tr").addClass('show_paging');
        // }
        // else{
        //   $("#user-table > tbody > tr > td:nth-child(6):contains('" + target + "')").parent().show();
        //   $("#user-table > tbody > tr > td:nth-child(6):contains('" + target + "')").parent().addClass('show_paging');
        //   for(var i=0;i<ret.length;i++){
        //     if(ret[i].MODELCATTYPEID_PR==target){
        //       $("#user-table > tbody > tr > td:nth-child(6):contains('" + ret[i].MODELCATTYPEID + "')").parent().show();
        //       $("#user-table > tbody > tr > td:nth-child(6):contains('" + ret[i].MODELCATTYPEID + "')").parent().addClass('show_paging');
        //     }
        //   }
        // }
      },
      error : function(error) {
          alert("메일 전송이 실패하였습니다.");
      }
    })


  }
}
