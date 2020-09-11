import $ from 'jquery';
import BpmnViewer from 'bpmn-js/lib/Viewer';
import diagramXML from '../resources/newDiagram.bpmn';
import minimapModule from 'diagram-js-minimap';

var container = $('#js-drop-zone');

var canvas = $('#js-canvas');

var viewer = new BpmnViewer({
  container: canvas,
  keyboard: { bindTo: document }
 // additionalModules: [ minimapModule ]
});

$(function() {
	var data = $("#xmlData");
	console.log(data);

	var xmlData = "";

	if(data == null || data == undefined || data == 'undefined'){
		xmlData = diagramXML;
	}else
	{
		xmlData = data[0].innerText;
	}
  
	viewer.importXML(xmlData, function(err) {
		if (err) {
	    	console.log('error rendering', err);
	  	} else {
	  		viewer.get('minimap').open();
	    	console.log('rendered');
	 	}
	});
})