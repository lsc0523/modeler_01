export default class CustomContextPad {
  constructor(config, contextPad, create, elementFactory, injector, translate, modeling, popupMenu) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    this.modeling = modeling;
    this.popupMenu = popupMenu;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      autoPlace,
      create,
      elementFactory,
      translate,
      modeling,
      popupMenu
    } = this;

    function appendServiceTask(event, element) {
      if (autoPlace) {
        //const shape = elementFactory.createShape({ type: 'bpmn:TextAnnotation' });
        modeling.setColor(element, {
          stroke: 'black',
          fill: 'black'
        });
        
        /*
        popupMenu.open(
          element,
          'bpmn-colorize'
          //assign(self.getColorMenuPosition(element), {
          //  cursor: { x: event.x, y: event.y }
          // })
        );
          */
        //autoPlace.append(element, shape);
      } else {
        appendServiceTaskStart(event, element);
      }
    }

    function appendServiceTaskStart(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:TextAnnotation' });
      create.start(event, shape, element);
    }

    return {
      'colorlist': {
        group: 'edit',
        className: 'bpmn-icon-color',
        title: translate('Set Color'),
        html : '<div class="entry"><div class="cawemo-icon-colorize">&nbsp;</div></div>',
        action: {
          click: appendServiceTask,
          dragstart: appendServiceTaskStart
        }
      }
    };
  }
}

CustomContextPad.$inject = [
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate',
  'modeling',
  'popupMenu'
];