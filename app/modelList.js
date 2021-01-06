
//var homeJs = "home JS";
//console.log(homeJs);

var treeList = require('./treeView.js');

$(document).ready(function(){

    treeList.listree();
    //Page loading 
    $("#user-table > tbody > tr").hide();
    var temp = $("#user-table > tbody > tr > td:nth-child(n):contains('" + $('#keyword').val() + "')");
    $(temp).parent().show();


    $("#keyword").keyup(function () {
      var k = $(this).val();
      $("#user-table > tbody > tr").hide();
      var temp = $("#user-table > tbody > tr > td:nth-child(n):contains('" + k + "')");

      $(temp).parent().show();
    })

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

  $.contextMenu({
        selector: '.context-menu-one', 
        trigger: 'left',
        callback: function(key, options) {
            var m = "clicked: " + key;
            //window.console && console.log(m) || alert(m); 
            var modelId = options.$trigger[0].parentNode.parentNode.childNodes[3].innerText;

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
            "delete": {name: "삭제", icon: "delete"},
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

  $(document).on('click', '#deleteRow', function () {
    this.parentNode.remove()
  });


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