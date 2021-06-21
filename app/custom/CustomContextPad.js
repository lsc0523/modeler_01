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
       // const shape = elementFactory.createShape({ type: 'bpmn:TextAnnotation' });
        modeling.setColor(element, {
          stroke: 'black',
          fill: 'black'
        });
        
        
        popupMenu.open(
          element,
          'bpmn-colorize'
          //assign(self.getColorMenuPosition(element), {
          //  cursor: { x: event.x, y: event.y }
          // })
        );
        
        autoPlace.append(element, shape);
      } else {
        appendServiceTaskStart(event, element);
      }
    }

    function appendTestTask(event, element) {
      if (autoPlace) {
       // const shape = elementFactory.createShape({ type: 'bpmn:TextAnnotation' });


        openColorPicker(element);
        
        // shape.colorPick({
        //   'initialColor': 'hsl(0,0%,97%)',
        //   'palette': ["#1abc9c", "#16a085", "#2ecc71",
        //               "#2980b9", "#9b59b6", "#8e44ad",
        //               "#f1c40f", "#f39c12", "#e67e22",
        //               "#c0392b", "#ecf0f1", "#00ff0000"],
        //   'onColorSelected': function () {
        //     console.log("The user has selected the color: " + this.color)
        //     element.css({ 'backgroundColor': this.color, 'color': this.color });  
           
        //     // modeling.setColor(element{
        //     // stroke: 'black',
        //     // fill: this.color
        //     //  });

        //   }
        // });

        // return false;

        //color picker open

        //model color
        // modeling.setColor(element, {
        //   stroke: 'black',
        //   fill: 'black'
        // });        
        
        // popupMenu.open(
        //   element,
        //   'bpmn-colorize'
        //   // assign(self.getColorMenuPosition(element), {
        //   //   cursor: { x: event.x, y: event.y },
        //   //  })
        // );
        
        autoPlace.append(element, shape);
      } else {
        appendServiceTaskStart(event, element);
      }
    }

    function appendServiceTaskStart(event) {
      const shape = elementFactory.createShape({ type: 'bpmn:TextAnnotation' });
      create.start(event, shape, element);
       }

    function appendTestTaskStart(event) {
      const Testshape = elementFactory.createShape({ type: 'bpmn:ServiceTask' });  
      create.start(event, Testshape, element);
    }

function openColorPicker (element)
{

  var offset = $(self.element).offset();

  event.preventDefault();
  self.show(self.element, event.pageX - 1236, event.pageY -70);

  $('.customColorHash').val(self.color);

  $('.colorPickButton').click(function (event) {
    self.color = $(event.target).attr('hexValue');
    self.appendToStorage($(event.target).attr('hexValue'));
    self.hide();
    $.proxy(self.options.onColorSelected, self)();
    return false;
  });
  $('.customColorHash').click(function (event) {
    return false;
  }).keyup(function (event) {
    var hash = $(this).val();
    if (hash.indexOf('#') !== 0) {
      hash = "#" + hash;
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



    // element.click(function (event) {
    //   var offset = $(self.element).offset();

    //   event.preventDefault();
    //   self.show(self.element, event.pageX - offset.left, event.pageY - offset.top);

    //   $('.customColorHash').val(self.color);

    //   $('.colorPickButton').click(function (event) {
    //     self.color = $(event.target).attr('hexValue');
    //     self.appendToStorage($(event.target).attr('hexValue'));
    //     self.hide();
    //     $.proxy(self.options.onColorSelected, self)();
    //     return false;
    //   });
    //   $('.customColorHash').click(function (event) {
    //     return false;
    //   }).keyup(function (event) {
    //     var hash = $(this).val();
    //     if (hash.indexOf('#') !== 0) {
    //       hash = "#" + hash;
    //     }
    //     if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hash)) {
    //       self.color = hash;
    //       self.appendToStorage(hash);
    //       $.proxy(self.options.onColorSelected, self)();
    //       $(this).removeClass('error');
    //     } else {
    //       $(this).addClass('error');
    //     }
    //   });

    //   return false;
    // }).blur(function () {
    //   self.element.val(self.color);
    //   $.proxy(self.options.onColorSelected, self)();
    //   self.hide();
    //   return false;
    // });
  }


  //color picker..
  $.fn.colorPick = function (config) {

    return this.each(function () {
      new $.colorPick(this, config || {});
    });

  };

  $.colorPick = function (element, options) {
    options = options || {};
    this.options = $.extend({}, $.fn.colorPick.defaults, options);
    if (options.str) {
      this.options.str = $.extend({}, $.fn.colorPick.defaults.str, options.str);
    }
    $.fn.colorPick.defaults = this.options;
    this.color = this.options.initialColor.toUpperCase();
    this.element = $(element);

    var dataInitialColor = this.element.data('initialcolor');
    if (dataInitialColor) {
      this.color = dataInitialColor;
      this.appendToStorage(this.color);
    }

    var uniquePalette = [];
    $.each($.fn.colorPick.defaults.palette.map(function (x) { return x.toUpperCase() }), function (i, el) {
      if ($.inArray(el, uniquePalette) === -1) uniquePalette.push(el);
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
    'palette': ["#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", 
                "#2980b9", "#9b59b6", "#8e44ad", "#34495e", "#2c3e50", 
                "#f1c40f", "#f39c12", "#e67e22", "#d35400", "#e74c3c", 
                "#c0392b", "#ecf0f1", "#bdc3c7", "#95a5a6", "#7f8c8d"],
    'onColorSelected': function () {
      this.element.css({ 'backgroundColor': this.color, 'color': this.color });
    }
  };

  $.colorPick.prototype = {

    init: function () {

      var self = this;
      var o = this.options;

      $.proxy($.fn.colorPick.defaults.onColorSelected, this)();

      this.element.click(function (event) {
        var offset = $(self.element).offset();

        event.preventDefault();
        self.show(self.element, event.pageX - offset.left, event.pageY - offset.top);

        $('.customColorHash').val(self.color);

        $('.colorPickButton').click(function (event) {
          self.color = $(event.target).attr('hexValue');
          self.appendToStorage($(event.target).attr('hexValue'));
          self.hide();
          $.proxy(self.options.onColorSelected, self)();
          return false;
        });
        $('.customColorHash').click(function (event) {
          return false;
        }).keyup(function (event) {
          var hash = $(this).val();
          if (hash.indexOf('#') !== 0) {
            hash = "#" + hash;
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
      }).blur(function () {
        self.element.val(self.color);
        $.proxy(self.options.onColorSelected, self)();
        self.hide();
        return false;
      });

      $(document).on('click', function (event) {
        self.hide();
        return true;
      });

      return this;
    },

    appendToStorage: function (color) {
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

    show: function (element, left, top) {

      $(".colorPickWrapper").remove();

      $(element).prepend('<div class="colorPickWrapper"><div id="colorPick" style="display:none;top:' + top + 'px;left:' + left + 'px"><span>' + $.fn.colorPick.defaults.paletteLabel + '</span></div></div>');

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
            if (index == $.fn.colorPick.defaults.recentMax - 1) {
              return false;
            }
          });
        }
      }
      $("#colorPick").fadeIn(200);
    },

    hide: function () {
      $(".colorPickWrapper").fadeOut(200, function () {
        $(".colorPickWrapper").remove();
        return this;
      });
    },

  };

  $("#picker1").colorPick({
    'initialColor': 'hsl(0,0%,97%)',
    'palette': ["#1abc9c", "#16a085", "#2ecc71",
                "#2980b9", "#9b59b6", "#8e44ad",
                "#f1c40f", "#f39c12", "#e67e22",
                "#c0392b", "#ecf0f1", "#00ff0000"],
    'onColorSelected': function () {
      console.log("The user has selected the color: " + this.color)
      this.element.css({ 'backgroundColor': this.color, 'color': this.color });

      // var modeling = bpmnModeler.get('modeling');
      
      // for (var i = 0; i < bpmnModeler.get('selection').get().length; i++) {

      //  modeling.setColor(bpmnModeler.get('selection').get()[i], {
      //    stroke: 'black',
      //    fill: this.color
      //  });
      //   elementsToColor.push(bpmnModeler.get('selection').get()[i]);
      }
    });
  


    return {
      // 'create.service-task': {
      //   group: 'activity',
      //   className: 'bpmn-icon-service-task',
      //   title: translate('Create ServiceTask'),
      //   action: {
      //     dragstart: createServiceTask,
      //     click: createServiceTask
      //   }
      // },

      'expand.SubProcess': {
        group: 'edit',
        className: 'ex-SubProcessr',
        title: translate('Expand SubProcess'),
//        html : '<div class="entry"><div class="cawemo-icon-colorize">&nbsp;</div></div>',
        action: {
          click: appendServiceTask,
          dragstart: appendServiceTaskStart
        }
      },

      'append.test-task': {
        group: 'model',
        className: 'Color-Piker',
        title: translate('Color Piker'),
//         html : '<div class="entry"><div class="cawemo-icon-colorize">&nbsp;</div></div>',
        action: {
          click: appendTestTask,
          dragstart: appendTestTaskStart
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