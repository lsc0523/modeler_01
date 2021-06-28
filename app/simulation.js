import $ from 'jquery';

// import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import customTranslate from './customTranslate/customTranslate';
import TokenSimulationModule from 'bpmn-js-token-simulation';
import fileDrop from 'file-drops';
import exampleXML from '../resources/example.bpmn';

var common = require('./common.js');
var url = new URL(window.location.href);
// var canvas = $('#js-canvas');

var persistent = url.searchParams.has('p');
var active = url.searchParams.has('e');

var initialDiagram = (() => {
  try {
    return persistent && localStorage['diagram-xml'] || exampleXML;
  } catch (err) {
    return exampleXML;
  }
})();

function hideDropMessage() {
  const dropMessage = document.querySelector('.drop-message');

  dropMessage.style.display = 'none';
}

if (persistent) {
  hideDropMessage();
}

// var ExampleModule = {
//   __init__: [
//     [ 'eventBus', 'bpmnjs', 'toggleMode', function(eventBus, bpmnjs, toggleMode) {

//       if (persistent) {
//         eventBus.on('commandStack.changed', function() {
//           bpmnjs.saveXML().then(result => {
//             localStorage['diagram-xml'] = result.xml;
//           });
//         });
//       }

//       if ('history' in window) {
//         eventBus.on('tokenSimulation.toggleMode', event => {

//           if (event.active) {
//             url.searchParams.set('e', '1');
//           } else {
//             url.searchParams.delete('e');
//           }

//           history.replaceState({}, document.title, url.toString());
//         });
//       }

//       eventBus.on('diagram.init', 500, () => {
//         toggleMode.toggleMode(active);
//       });
//     } ]
//   ]
// };

// const modeler = new BpmnModeler({
//   container: '#canvas',
//   keyboard: { bindTo: document },
//   additionalModules: [
//     TokenSimulationModule,
//     ExampleModule
//   ],
//   keyboard: {
//     bindTo: document
//   }
// });

var container = $('#js-drop-zone');
var canvas = $('#canvas');

var customTranslateModule = {
  translate: ['value', customTranslate]
};
// var modeler = new BpmnModeler({
//   container: canvas,
//   keyboard: { bindTo: document },
//   propertiesPanel: {
//     parent: '#js-properties-panel'
//   },
//   additionalModules: [  
//     TokenSimulationModule,
//     ExampleModule
//   ],
//   keyboard: {
//     bindTo: document
//   }
// });


const modeler = new BpmnModeler({
  container: canvas,
  keyboard: { bindTo: document },
  // propertiesPanel: {
  //   parent: '#js-properties-panel'
  // },
  additionalModules: [
    TokenSimulationModule
  ],

  keyboard: {
    bindTo: document
  }
});



function createNewDiagram(xml) {

  if (common.isNotEmpty(xml)) {
    openDiagram(xml);
  }
  else {
    openDiagram(diagramXML);
  }

}

function openDiagram(xml) {

  try {

    modeler.importXML(exampleXML);

    // modeler.openDiagram = function(diagram) {
    //   return this.importXML(diagram)
    //     .then(({ warnings }) => {
    //       if (warnings.length) {
    //         console.warn(warnings);
    //       }
    
    //       if (persistent) {
    //         localStorage['diagram-xml'] = diagram;
    //       }
    
    //       this.get('canvas').zoom('fit-viewport');
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // };

    // console.log('Awesome! Ready to navigate!');

  } catch (err) {

    container
      .removeClass('with-diagram')
      .addClass('with-error');

    container.find('.error pre').text(err.message);

    console.error(err);
  }
}



document.body.addEventListener('dragover', fileDrop('Open BPMN diagram', function(files) {

  // files = [ { name, contents }, ... ]

  if (files.length) {
    hideDropMessage();
    openDiagram(files[0].contents);
  }

}), false);

function registerFileDrop(canvas, callback) {

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;

    var file = files[0];

    var reader = new FileReader();

    reader.onload = function (e) {

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



if (!window.FileList || !window.FileReader) {
  window.alert(
    'Looks like you use an older browser that does not support drag and drop. ' +
    'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
  registerFileDrop(canvas, openDiagram);
}




$(function () { 

  openDiagram(exampleXML)

  // this.get('canvas').zoom('fit-viewport');
  // var data = $("#xmlData");
  //console.log(data);
  // modeler.importXML(exampleXML);
});


