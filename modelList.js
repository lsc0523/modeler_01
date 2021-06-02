
//var homeJs = "home JS";
//console.log(homeJs);

var treeList = require('./treeView.js');

$(document).ready(function(){



    treeList.listree();
    //Page loading 
    //$("#user-table > tbody > tr").show();
    //$("#user-table > tbody").attr('style', "display:'';");
    //var temp = $("#user-table > tbody > tr > td:nth-child(n):contains('" + $('#keyword').val() + "')");
    // var temp = $("#user-table > tbody > tr > td:nth-child(n):contains('" + "조립" + "')");
    // $(temp).parent().show();

    $("#keyword").keyup(function () {
      var k = $(this).val();
      $("#user-table > tbody > tr").hide();
      $("#user-table > tbody > tr > td:nth-child(n):contains('" + k + "')").parent().show();

    })

    $('#createModel').on('click', function(){
      var DB_MODELID = "NULL";
      var DB_MODELCATID = "NULL";

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
            for(var i=0;i<ret2.length;i++){
              if($('#process1 option:selected').text()==ret2[i].MODELCATNAME){
                DB_MODELCATID = ret2[i].MODELCATID;
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
          alert("메일 전송이 실패하였습니다2." + error);
        }
      });
      
      location.href='/modeler?DB_ID=' + DB_MODELID + '&DB_CATID=' + DB_MODELCATID;
    });

    $('#company').on('change',function(){

      $.ajax({
        url: '/companycheck',
        type:'GET',
        dataType: "json",  
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
              selectElem.append(element);
            }
          }

          for(var i=0;i<ret2.length;i++){
            if(ret2[i].MODELCATTYPEID==target && !ret2[i].MODELCATID_PR){
              var element = document.createElement("option");
              element.innerText = ret2[i].MODELCATNAME;
              selectElem2.append(element);
            }
          }
          
          $("#user-table > tbody > tr").hide();
          if($("#company option:selected").text()=="NULL"){
            $("#user-table > tbody > tr").show();
          }
          else{
            $("#user-table > tbody > tr > td:nth-child(6):contains('" + target + "')").parent().show();
            for(var i=0;i<ret.length;i++){
              if(ret[i].MODELCATTYPEID_PR==target){
                $("#user-table > tbody > tr > td:nth-child(6):contains('" + ret[i].MODELCATTYPEID + "')").parent().show();
              }
            }
          }
         },
        error : function(error) {
           alert("메일 전송이 실패하였습니다.");
         }

     });
    });

    $('#factory').on('change',function(){

      $.ajax({
        url: '/companycheck',
        type:'GET',
        dataType: "json",  
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

          if($("#factory option:selected").text()=="NULL"){
            $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_company + "')").parent().show();
            
            for(var i=0;i<ret.length;i++){
              if(ret[i].MODELCATTYPEID_PR==target_company){
                $("#user-table > tbody > tr > td:nth-child(6):contains('" + ret[i].MODELCATTYPEID + "')").parent().show();
              }
            }

            for(var i=0;i<ret2.length;i++){
              if(ret2[i].MODELCATTYPEID==target_company && !ret2[i].MODELCATID_PR){
                var element = document.createElement("option");
                element.innerText = ret2[i].MODELCATNAME;
                selectElem2.append(element);
              }
            }

          }
          else{
            $("#user-table > tbody > tr > td:nth-child(6):contains('" + target + "')").parent().show();

            for(var i=0;i<ret2.length;i++){
              if(ret2[i].MODELCATTYPEID==target && !ret2[i].MODELCATID_PR){
                var element = document.createElement("option");
                element.innerText = ret2[i].MODELCATNAME;
                selectElem2.append(element);
              }
            }
          }
         },
        error : function(error) {
           alert("메일 전송이 실패하였습니다.");
         }

     });
    });

    $('#process1').on('change', function(){

      $("#user-table > tbody > tr").hide();

      $.ajax({
        url: '/companycheck',
        type:'GET',
        dataType: "json",
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
              selectElem2.append(element);
            }
          }

          $("#user-table > tbody > tr").hide();
          if($("#process1 option:selected").text()=="NULL"){
            if($("#factory option:selected").text()=="NULL"){
              $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_company + "')").parent().show();
            }
            else{
              $("#user-table > tbody > tr > td:nth-child(6):contains('" + target_factory + "')").parent().show();
            }
          }
          else{

            $("#user-table > tbody > tr > td:nth-child(7):contains('" + target + "')").parent().show();

            for(var i=0;i<ret2.length;i++){
              if(ret2[i].MODELCATID_PR==target){
                $("#user-table > tbody > tr > td:nth-child(7):contains('" + ret2[i].MODELCATID + "')").parent().show();
                // $(temp2).parent().show();
              }
            }

          }

         },
        error : function(error) {
           alert("메일 전송이 실패하였습니다.");
         }
        
      });
    });

    $('#process2').on('change',function(){
      $("#user-table > tbody > tr").hide();

      $.ajax({
        url: '/companycheck',
        type:'GET',
        dataType: "json",
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

          if($("#process2 option:selected").text()=="NULL"){
            $("#user-table > tbody > tr > td:nth-child(7):contains('" + target + "')").parent().show();

            for(var i=0;i<ret2.length;i++){
              if(ret2[i].MODELCATID_PR==target){
                $("#user-table > tbody > tr > td:nth-child(7):contains('" + ret2[i].MODELCATID + "')").parent().show();
                // $(temp2).parent().show();
              }
            }
          }
          else{
            $("#user-table > tbody > tr > td:nth-child(7):contains('" + target_process2 + "')").parent().show();
          }

         },
        error : function(error) {
           alert("메일 전송이 실패하였습니다.");
         }
        
      });

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

    $(".delete").on('click', function (e) {
      e.preventDefault();
      var checkDelete = confirm("삭제 하시겠습니까?");

      if (checkDelete) {
        var returnurl = window.location.pathname;
        var href = $(this).attr("href");
        //window.location = href;
        //window.location = returnurl;
        $.ajax({
          url: '/delete',
          type: 'GET',
          data: {
            id: href.split('=')[1],
            page : returnurl.split('/')[2]
          },
          dataType: 'text',
          success: function (data) {
              //Row 삭제
              e.target.parentNode.parentNode.parentNode.remove();
              alert("삭제 성공하였습니다.");
          },
          error: function (error) {
            alert("삭제 실패하였습니다. 재시도 하시기 바랍니다.");
            window.location = returnurl;
          }
        })
        
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
              window.location = "/modeler?id=" + modelId;
            }
            else if(key == 'delete'){
              var checkDelete = confirm("삭제하시겠습니까?");

              if (checkDelete) {
                window.location = "/delete?id=" + modelId;
              }
            }
            else if(key == 'open'){
              window.location = "/viewer?id=" + modelId;
            }
            else if (key == 'history'){
              window.location = '/history/1?id=' + modelId;
            }
        },
        items: {
            "edit": {name: "수정", icon: "edit"},
            "open": {name: "열기", icon: "copy"},
            // "delete": {name: "삭제", icon: "delete"},
            // "history" : {name : "이력보기" , icon : "paste"},
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

  $(document).on('click', '#deleteRow', function () {
    this.parentNode.remove()
  });


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
  //                                 '<td> <button class="context-menu-one btn btn-link" style="background-color: #ffffff;" id=' + data.data[i].MODELID + '>' +
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

