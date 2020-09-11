import $ from 'jquery';

//port bpmnJs from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import minimapModule from 'diagram-js-minimap';
import diagramXML from '../resources/newDiagram.bpmn';
import CliModule from 'bpmn-js-cli';
import customTranslate from './customTranslate/customTranslate';
import BpmnViewer from 'bpmn-js/lib/Viewer';

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
    customTranslateModule
  ],
  cli: {
    bindTo: 'cli'
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


  downloadLink.click(async function(e){
    console.log("download xml...");
    var xml = await bpmnModeler.saveXML({ format: true });
    var xmlData = xml.xml.replace( '<?xml version="1.0" encoding="UTF-8"?>', '');

      $.ajax({
            url:'/insert',
            type:'POST',
            data:{ 
                   id: xmlData.replace(/(\r\n|\n|\r)/gm, "")
                  },
            success:function(result){
                if(result){
                  //alert(result);
                }

                window.location.href = 'home';
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
