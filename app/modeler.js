import $ from 'jquery';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import minimapModule from 'diagram-js-minimap';
import minimap from 'diagram-js-minimap/lib/Minimap';
import diagramXML from '../resources/newDiagram.bpmn';
import CliModule from 'bpmn-js-cli';
import customTranslate from './customTranslate/customTranslate';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import customContextPad from './custom';
//import tooltips from "diagram-js/lib/features/tooltips";
//import BpmnColor from 'bpmn-js-in-color';

var common = require('./common');
var colorPick = require('./colorPick')

//var BpmnColor = require('bpmn-js-in-color');

import {
  registerBpmnJSPlugin
} from 'camunda-modeler-plugin-helpers';

import plugin from './TooltipInfoService';

var container = $('#js-drop-zone');
var canvas = $('#js-canvas');
var customTranslateModule = {
  translate: [ 'value', customTranslate ]
};

var bpmnModeler = new BpmnModeler({
  container: canvas,
  keyboard: { bindTo: document },
  propertiesPanel: {
    parent: '#js-properties-panel'
  },
  additionalModules: [
  minimapModule,
  propertiesPanelModule,
  propertiesProviderModule,
  CliModule,
  customTranslateModule,
  //tooltips,
  plugin
  //customContextPad
  //BpmnColor
  //require('bpmn-js-in-color')
  ],
  cli: {
    bindTo: 'cli'
  },
  moddleExtensions: {
    camunda: camundaModdleDescriptor
  }
});

var file_prams = [];

function createNewDiagram(xml) {

  if(common.isNotEmpty(xml)){
    openDiagram(xml);
  }
  else
  {
    openDiagram(diagramXML);
  }

/*
  if(xml != "" && xml != undefined && xml != 'undefined'){
    openDiagram(xml);
  }
  else{
    openDiagram(diagramXML);
  }
  */
}

async function openDiagram(xml) {

  try {
    await bpmnModeler.importXML(xml);

    container
    .removeClass('with-error')
    .addClass('with-diagram');

    //bpmnModeler.get('minimap').open();
    bpmnModeler.get('minimap').open();
    /*
    var elementRegistry = bpmnModeler.get("elementRegistry");
    var tooltips = bpmnModeler.get("tooltips");

    var startEvent = elementRegistry.get("StartEvent_1");
    tooltips.add({
    position: {
      x: startEvent.x,
      y: startEvent.y - 20
    },
    html:
      '<div style="width: 100px; background: fuchsia; color: white;">TOOL TIP</div>'
  });
  */
  
  console.log('Awesome! Ready to navigate!');

} catch (err) {

  container
  .removeClass('with-diagram')
  .addClass('with-error');

  container.find('.error pre').text(err.message);

  console.error(err);
}
}


function registerFileDrop(container, callback) {

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;

    var file = files[0];

    var reader = new FileReader();

    reader.onload = function(e) {

      var xml = e.target.result;

      callback(xml);
    };

    reader.readAsText(file);
  }

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  container.get(0).addEventListener('dragover', handleDragOver, false);
  container.get(0).addEventListener('drop', handleFileSelect, false);
}


// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
  window.alert(
    'Looks like you use an older browser that does not support drag and drop. ' +
    'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
  registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions

$(function() {
  var data = $("#xmlData");
  console.log(data);
  createNewDiagram(data[0].innerText);
  
  $('#js-properties-panel').hide();
  $('.map').hide();
  $('.toggle').hide();
  $('.accordion').hide();
  //colorPick.colorPicker();

  var downloadLink = $('#js-download-diagram');
  var downloadSvgLink = $('#js-download-svg');

  if( $('#file_length') > 0 ){
    $('#btn-download').css({ color : "green"});
  }

  $('.buttons a').click(function(e) {
    if (!$(this).is('.active')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  //setTimes..
  var today = new Date();
      
  var hours = today.getHours();      // 시
  var minutes = today.getMinutes();  // 분
  var seconds = today.getSeconds();  // 초

  $('#save-time').val(" Autosaved at "+ hours + ":" + minutes + ":" + seconds);


  bpmnModeler.on('element.click', function(e) {

    var element = e.element;
    // get incoming shapes
    var incoming = element.incoming;
    // get outgoing shapes
    var outgoing = element.outgoing;
  });

  
  $('#btn-panel').on('click' , function(){
    if($('#js-properties-panel').is(':visible')){   
       $('#js-properties-panel').hide();
    }
    else
    {
      $('#js-properties-panel').show();
    }
  });

  $('#btn-minimap').on('click' , function(){
    if($('.map').is(':visible')){
      $('.map').hide();
    }
    else{
      $('.map').show();
    }

  });

  $('#btn-list').on('click', function(){

    if(document.getElementById("mySidenav").style.width == "0px" || 
       document.getElementById("mySidenav").style.width == "" )
    {
      openNav();
    }
    else
    {
      closeNav();
    }
    /*
    if($('.accordion').is(':visible')){
      $('.accordion').hide();
      $('.panel').hide();
    }
    else{
      $('.accordion').show();
      $('.panel').show();
    }
    */

    //$('.accordion').hide();
  })


  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
  function openNav() {
    document.getElementById("mySidenav").style.width = "400px";
    document.getElementById("main_list").style.marginLeft = "400px";
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main_list").style.marginLeft = "0";
  }


  //zoom
  $('#zoom-reset').on('click' , function(){
    bpmnModeler.get('zoomScroll').reset();
  })

  $('#zoom-in').on('click', function(){
    bpmnModeler.get('zoomScroll').stepZoom(1);
  })

  $('#zoom-out').on('click', function(){
    bpmnModeler.get('zoomScroll').stepZoom(-1);
  })

  
  $('#fileInput').on('change', function (){

    var fileName = $(this).val();
    var fileCount = $(this).get(0).files.length;
    if($(this).get(0).files.length == 1){
        $('#file_path').val(fileName);
    }
    else {
        $('#file_path').val('파일 '+fileCount+'개');
    }
  });

  $('#modelinfo').on('click' , function(){
     popupOpen();
  });


  function popupOpen(){
      var url= "/modelPopup";    
      var winWidth = 500;
      var winHeight = 500;
      var popupOption= "width="+winWidth+", height="+winHeight;
      //popupOption += " ,modal=yes";    
      var myWindow = window.open(url,"modelPopup",popupOption);
  }

  $('#btn-download').on('click', function(){
      var url= "/downloadPopup";    
      var winWidth = 800;
      var winHeight = 500;
      var popupOption= "width="+winWidth+", height="+winHeight;
      var myWindow = window.open(url,"downloadPopup",popupOption);
  });

  downloadLink.click(async function(e){
    console.log("download xml...");
    var modelID = $("#modelID");
    console.log(modelID[0].innerText);

    var xml = await bpmnModeler.saveXML({ format: true });
    var xmlData = xml.xml.replace( '<?xml version="1.0" encoding="UTF-8"?>', '');
    var urlLink = '';

    if(common.isEmpty(modelID[0].innerText)){
      urlLink = '/insert';
    }
    else
    {
      urlLink = '/update'
    }

    //var form = $('#fileForm')[0];

    var JSmodeName = $('#modelName').val();
    var modelDetailName = $('#modelDetailName').val();
    var modelType = $('#modelType').val();
    var ProcessID = bpmnModeler._definitions.rootElements[0].id;

    var formData = new FormData();
    formData.append("id", xmlData.replace(/(\r\n|\n|\r)/gm, ""));
    formData.append("modelID", modelID[0].innerText);
    formData.append("type", modelType);
    formData.append("modelName", JSmodeName);
    formData.append("modelDetailName", modelDetailName);
    formData.append("processID", ProcessID);

    //formData.append("files", fileInput.files);
    //var fileCheck = document.getElementById("fileInput").value;
    //if(isNotEmpty(fileCheck)){
      $.each($("input[type='file']")[0].files, function(i, file) {
        formData.append('files', file);
      });
    //}

    $.ajax({
       url: urlLink,
       type:'POST',
       data : formData,
       processData: false,
       contentType: false,
       enctype: 'multipart/form-data',
       async: false,
       success : function(data) {
          alert("저장이 완료 되었습니다.");
          window.location.href = 'home/1';
        },
       error : function(error) {
          alert("Error!");
        }

    });
  });


  /*
  function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);
    link.addClass('active')
    
    if (data) {
      link.addClass('active').attr({
        'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        'download': name
      });


    } else {
      link.removeClass('active');
    }
    
    
  }
  */


  var exportArtifacts = debounce(async function() {
    /*
    try {

      const { svg } = await bpmnModeler.saveSVG();
      //setEncoded(downloadSvgLink, 'diagram.svg', svg);
    } catch (err) {

      console.error('Error happened saving SVG: ', err);
      //setEncoded(downloadSvgLink, 'diagram.svg', null);
    }
    */

    try {

      const { xml } = await bpmnModeler.saveXML({ format: true });
      var today = new Date();
      
      var hours = today.getHours();      // 시
      var minutes = today.getMinutes();  // 분
      var seconds = today.getSeconds();  // 초

      $('#save-time').val(" Autosaved at "+ hours + ":" + minutes + ":" + seconds);




      //setEncoded(downloadLink, 'diagram.bpmn', xml);
    } catch (err) {

      console.error('Error happened saving diagram: ', err);
      //$('#save-time').val(" Error....");
      //setEncoded(downloadLink, 'diagram.bpmn', null);
    }
  }, 500);

  bpmnModeler.on('commandStack.changed', exportArtifacts);
  

  //color picker..
  $.fn.colorPick = function(config) {

        return this.each(function() {
            new $.colorPick(this, config || {});
        });

    };

    $.colorPick = function (element, options) {
        options = options || {};
        this.options = $.extend({}, $.fn.colorPick.defaults, options);
        if(options.str) {
            this.options.str = $.extend({}, $.fn.colorPick.defaults.str, options.str);
        }
        $.fn.colorPick.defaults = this.options;
        this.color   = this.options.initialColor.toUpperCase();
        this.element = $(element);

        var dataInitialColor = this.element.data('initialcolor');
        if (dataInitialColor) {
            this.color = dataInitialColor;
            this.appendToStorage(this.color);
        }

        var uniquePalette = [];
        $.each($.fn.colorPick.defaults.palette.map(function(x){ return x.toUpperCase() }), function(i, el){
            if($.inArray(el, uniquePalette) === -1) uniquePalette.push(el);
        });

        this.palette = uniquePalette;

        return this.element.hasClass(this.options.pickrclass) ? this : this.init();
    };

    $.fn.colorPick.defaults = {
        'initialColor': '#3498db',
        'paletteLabel': 'Default palette:',
        'allowRecent': true,
        'recentMax': 5,
        'allowCustomColor': false,
        'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d"],
        'onColorSelected': function() {
            this.element.css({'backgroundColor': this.color, 'color': this.color});
        }
    };

    $.colorPick.prototype = {

        init : function(){

            var self = this;
            var o = this.options;

            $.proxy($.fn.colorPick.defaults.onColorSelected, this)();

            this.element.click(function(event) {
                var offset = $(self.element).offset();

                event.preventDefault();
                self.show(self.element, event.pageX - offset.left, event.pageY - offset.top);

                $('.customColorHash').val(self.color);

                $('.colorPickButton').click(function(event) {
          self.color = $(event.target).attr('hexValue');
          self.appendToStorage($(event.target).attr('hexValue'));
          self.hide();
          $.proxy(self.options.onColorSelected, self)();
          return false;
              });
                $('.customColorHash').click(function(event) {
                    return false;
                }).keyup(function (event) {
                    var hash = $(this).val();
                    if (hash.indexOf('#') !== 0) {
                        hash = "#"+hash;
                    }
                    if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hash)) {
                        self.color = hash;
                        self.appendToStorage(hash);
                        $.proxy(self.options.onColorSelected, self)();
                        $(this).removeClass('error');
                    } else {
                        $(this).addClass('error');
                    }
                });

                return false;
            }).blur(function() {
                self.element.val(self.color);
                $.proxy(self.options.onColorSelected, self)();
                self.hide();
                return false;
            });

            $(document).on('click', function(event) {
                self.hide();
                return true;
            });

            return this;
        },

        appendToStorage: function(color) {
          if ($.fn.colorPick.defaults.allowRecent === true) {
            var storedColors = JSON.parse(localStorage.getItem("colorPickRecentItems"));
        if (storedColors == null) {
              storedColors = [];
            }
        if ($.inArray(color, storedColors) == -1) {
              storedColors.unshift(color);
          storedColors = storedColors.slice(0, $.fn.colorPick.defaults.recentMax)
          localStorage.setItem("colorPickRecentItems", JSON.stringify(storedColors));
            }
          }
        },

        show: function(element, left, top) {

            $(".colorPickWrapper").remove();

            $(element).prepend('<div class="colorPickWrapper"><div id="colorPick" style="display:none;top:' + top + 'px;left:' + left + 'px"><span>'+$.fn.colorPick.defaults.paletteLabel+'</span></div></div>');

          jQuery.each(this.palette, function (index, item) {
        $("#colorPick").append('<div class="colorPickButton" hexValue="' + item + '" style="background:' + item + '"></div>');
      });
            if ($.fn.colorPick.defaults.allowCustomColor === true) {
                $("#colorPick").append('<input type="text" style="margin-top:5px" class="customColorHash" />');
            }
      if ($.fn.colorPick.defaults.allowRecent === true) {
        $("#colorPick").append('<span style="margin-top:5px">Recent:</span>');
        if (JSON.parse(localStorage.getItem("colorPickRecentItems")) == null || JSON.parse(localStorage.getItem("colorPickRecentItems")) == []) {
          $("#colorPick").append('<div class="colorPickButton colorPickDummy"></div>');
        } else {
          jQuery.each(JSON.parse(localStorage.getItem("colorPickRecentItems")), function (index, item) {
                $("#colorPick").append('<div class="colorPickButton" hexValue="' + item + '" style="background:' + item + '"></div>');
                        if (index == $.fn.colorPick.defaults.recentMax-1) {
                            return false;
                        }
          });
        }
      }
          $("#colorPick").fadeIn(200);
        },

      hide: function() {
        $( ".colorPickWrapper" ).fadeOut(200, function() {
                $(".colorPickWrapper").remove();
          return this;
      });
        },

    };



    $("#picker1").colorPick({
      'initialColor' : 'hsl(0,0%,97%)',
      'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", "#c0392b", "#ecf0f1"],
      'onColorSelected': function() {
        console.log("The user has selected the color: " + this.color)
        this.element.css({'backgroundColor': this.color, 'color': this.color});

        var modeling = bpmnModeler.get('modeling');

        for(var i=0; i < bpmnModeler.get('selection').get().length; i++){

            modeling.setColor(bpmnModeler.get('selection').get()[i] , {
              stroke: 'black',
              fill: this.color
            });
            //elementsToColor.push(bpmnModeler.get('selection').get()[i]);
        }
      }
  });



});



function debounce(fn, timeout) {

  var timer;

  return function() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, timeout);
  };
}

