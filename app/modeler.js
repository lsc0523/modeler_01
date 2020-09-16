import $ from 'jquery';

//port bpmnJs from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import minimapModule from 'diagram-js-minimap';
import diagramXML from '../resources/newDiagram.bpmn';
import CliModule from 'bpmn-js-cli';
import customTranslate from './customTranslate/customTranslate';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import tooltips from "diagram-js/lib/features/tooltips";

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
  ],
  cli: {
    bindTo: 'cli'
  },
  moddleExtensions: {
    camunda: camundaModdleDescriptor
  }
});

function createNewDiagram(xml) {
  if(xml != "" && xml != undefined && xml != 'undefined'){
    openDiagram(xml);
  }
  else{
    openDiagram(diagramXML);
  }
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

  var downloadLink = $('#js-download-diagram');
  var downloadSvgLink = $('#js-download-svg');

  $('.buttons a').click(function(e) {
    if (!$(this).is('.active')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  $('#fileInput').on('change', function (){
    var form = $('#fileForm')[0];
    var formData = new FormData(form);

    $.ajax({
      type: 'post',
      url: '/upload',
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
         alert("success file upload..");
          //$('#filePath').val(data);
        },
        error: function (err) {
          alert("Fail...");
          console.log(err);
        }
      });
  });


  downloadLink.click(async function(e){
    console.log("download xml...");
    var modelID = $("#modelID");
    console.log(modelID[0].innerText);

    var xml = await bpmnModeler.saveXML({ format: true });
    var xmlData = xml.xml.replace( '<?xml version="1.0" encoding="UTF-8"?>', '');
    var urlLink = '';

    if(modelID[0].innerText == "" || modelID[0].innerText == undefined || modelID[0].innerText == 'undefined'){
      urlLink = '/insert';
    }else{
      urlLink = '/update';
    }

    console.log(urlLink);
    var selectedElements = bpmnModeler.get('selection').get(); 
    console.log(selectedElements);

    $.ajax({
      url: urlLink,
      type:'POST',
      data:{ 
       id: xmlData.replace(/(\r\n|\n|\r)/gm, ""),
       modelID : modelID[0].innerText
     },
     error : function(error) {
      alert("Error!");
    },
    success : function(data) {
      alert("저장이 완료 되었습니다.");
      window.location.href = 'home';
    },
    complete : function() {
                    //window.location.href = 'home';
                    //alert("complete!");    
                  }
                });
  });

  function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);
    link.addClass('active')
    /*
    if (data) {
      link.addClass('active').attr({
        'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        'download': name
      });


    } else {
      link.removeClass('active');
    }
    */
    
  }

  var exportArtifacts = debounce(async function() {
    try {

      const { svg } = await bpmnModeler.saveSVG();
      setEncoded(downloadSvgLink, 'diagram.svg', svg);
    } catch (err) {

      console.error('Error happened saving SVG: ', err);
      setEncoded(downloadSvgLink, 'diagram.svg', null);
    }

    try {

      const { xml } = await bpmnModeler.saveXML({ format: true });
      setEncoded(downloadLink, 'diagram.bpmn', xml);
    } catch (err) {

      console.error('Error happened saving diagram: ', err);
      setEncoded(downloadLink, 'diagram.bpmn', null);
    }
  }, 500);

  bpmnModeler.on('commandStack.changed', exportArtifacts);
});



// helpers //////////////////////

function debounce(fn, timeout) {

  var timer;

  return function() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, timeout);
  };
}
