/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

// These colors are the same as in Camunda Modeler:
// See https://github.com/camunda/camunda-modeler/blob/3e965cf747e66b719622cbe7a1c5139633c537e7/client/lib/app/app.js#L191-L198
import { analyticsService } from 'services';

const COLORS = [
  { fill: undefined, stroke: undefined, label: 'None' }, // default
  { fill: '#BBDEFB', stroke: '#1E88E5', label: 'Blue' },
  { fill: '#FFE0B2', stroke: '#FB8C00', label: 'Orange' },
  { fill: '#C8E6C9', stroke: '#43A047', label: 'Green' },
  { fill: '#FFCDD2', stroke: '#E53935', label: 'Red' },
  { fill: '#E1BEE7', stroke: '#8E24AA', label: 'Purple' }
];

export default function ColorMenuProvider(popupMenu, modeling, translate) {
  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._translate = translate;

  this.register();
}

ColorMenuProvider.prototype.register = function () {
  this._popupMenu.registerProvider('bpmn-colorize', this);
};

ColorMenuProvider.prototype.getEntries = function () {
  return [];
};

ColorMenuProvider.prototype.getHeaderEntries = function (element) {
  const modeling = this._modeling;

  return COLORS.map((color) => {
    return {
      id: `colorize-${color.label.toLowerCase()}`,
      title: color.label,
      className: 'bpmn-colorize',
      action: function () {
        modeling.setColor(element, {
          fill: color.fill,
          stroke: color.stroke
        });

        analyticsService.pushEvent({
          category: 'DIAGRAMS',
          action: 'DIAGRAM_COLOR'
        });
      }
    };
  });
};

ColorMenuProvider.$inject = ['popupMenu', 'modeling', 'translate', 'config.colorMenuProvider'];



// WEBPACK FOOTER //
// ./src/App/Pages/Diagram/BpmnJSExtensions/popupMenu/ColorMenuProvider.js