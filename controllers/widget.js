var Drawer = require('guy.mcdooooo.tibezier'),
    POP = require('guy.mcdooooo.tipop'),
    
    LTAG = '[HamburgerButtonWidget]',
    M_PI = 180,
    M_PI_2 = 90,
    M_PI_4 = 45,
    
    _showsArrow = false,
    _width = 18,
    _height = 2,
    _topYPosition = 7,
    _middleYPosition = 12,
    _bottomYPosition = 17,
    _verticalOffsetInRotatedState = 1.25,
    _duration = 400,
    
    STATE_ARROW = 'ARROW',
    STATE_HAMBURGER = 'BURGER',
    
    _topStroke, _middleStroke, _bottomStroke;


/**
 * SEF to organize otherwise inline code
 *
 * @private
 * @param {Object} args arguments passed to the controller
 * @returns void
 */
(function constructor(args) {
    
    // use strict mode for this function scope
    'use strict';
    
    
    // set defaults
    _.defaults(args, {
        
        color: '#ffffff',
        duration: 400,
        state: null
    });
    
    
    // init vars
    $.showsArrow = _showsArrow;
    _duration = args.duration;
    
    
    // create hamburger layers
    _topStroke = Drawer.createView({
        
        width: _width,
        height: _height,
        top: _topYPosition,
        
        backgroundColor: 'transparent',
        touchEnabled: false,
        
        bezier: {
            
            lineWidth: _height,
            miterLimit: 4,
            
            strokeColor: args.color,
            strokeEnd: 1.0,
            
            fill: true,
            fillColor: args.color,
            
            paths: [
                {
                    draw: 'moveToPoint',
                    point: [0, 0]
                }, {
                    draw: 'addLineToPoint',
                    point: [_width, 0]
                }
            ]
        }
    });
    
    
    _middleStroke = Drawer.createView({
        
        width: _width,
        height: _height,
        top: _middleYPosition,
        
        backgroundColor: 'transparent',
        touchEnabled: false,
        
        bezier: {
            
            lineWidth: _height,
            miterLimit: 4,
            
            strokeColor: args.color,
            strokeEnd: 1.0,
            
            fill: true,
            fillColor: args.color,
            
            paths: [
                {
                    draw: 'moveToPoint',
                    point: [0, 0]
                }, {
                    draw: 'addLineToPoint',
                    point: [_width, 0]
                }
            ]
        }
    });
    
    
    _bottomStroke = Drawer.createView({
        
        width: _width,
        height: _height,
        top: _bottomYPosition,
        
        backgroundColor: 'transparent',
        touchEnabled: false,
        
        bezier: {
            
            lineWidth: _height,
            miterLimit: 4,
            
            strokeColor: args.color,
            strokeEnd: 1.0,
            
            fill: true,
            fillColor: args.color,
            
            paths: [
                {
                    draw: 'moveToPoint',
                    point: [0, 0]
                }, {
                    draw: 'addLineToPoint',
                    point: [_width, 0]
                }
            ]
        }
    });
    
    
    // add layers to wrapper view
    $.wrapper.add(_topStroke);
    $.wrapper.add(_middleStroke);
    $.wrapper.add(_bottomStroke);
    
    
    // set init state
    if (_.isString(args.state)) {
        
        switch (args.state) {
            
            case STATE_ARROW:
                
                _showArrow(0);
                
                break;
            
            
            case STATE_HAMBURGER:
                
                _showBurger(0);
                
                break;
        }
    }
    
    
    return;

// execute constructor with optional arguments passed to controller
})($.args);


/**
 * Cleans up the controller and view
 *
 * @public
 * @method cleanup
 * @returns void
 */
$.cleanup = function() {
    
    Ti.API.debug(LTAG, 'Cleaning up...');
    
    
    // let Alloy clean up listeners to global collections for data-binding
    // always call it since it'll just be empty if there are none
    $.destroy();
    $.off();
    $.removeListener();
    
    
    return;
    
}; // END cleanup()


/**
 * Handles container click
 *
 * @private
 * @param {Object} event
 * @returns void
 */
function handleClick(event) {
    
    $.trigger('click', event);
    
    $.toggle()
    
     .then(function(showsArrow) {
        
         $.trigger('stateChanged', {
            
             showsArrow: showsArrow
         });
     });
    
    
    return;
    
} // END handleClick()


/**
 * Animate to arrow icon
 *
 * @private
 * @param {Number} duration
 * @returns {Promise}
 */
function _showArrow(duration) {
    
    var Promise = require(WPATH('/vendor/q')),
        deferred = Promise.defer(),
        
        strokeStartTop = 0.3,
        strokeStartBottom = 0.4;
    
    
    // if already shows arrow icon, abort
    if (_showsArrow) {
        
        return Promise(_showsArrow);
    }
    
    
    POP.basic(_topStroke, {
        
        top: (_bottomYPosition + _verticalOffsetInRotatedState),
        rotate: {
            z: (M_PI + M_PI_4)
        },
        
        strokeStart: strokeStartTop,
        
        easing: 'easeOutQuad',
        duration: duration
    });
    
    
    POP.basic(_middleStroke, {
        
        rotate: {
            z: M_PI
        },
        
        strokeEnd: 0.85,
        
        easing: 'easeOutQuad',
        duration: duration
    });
    
    
    POP.basic(_bottomStroke, {
        
        top: (_topYPosition - _verticalOffsetInRotatedState),
        rotate: {
            z: (M_PI_2 + M_PI_4)
        },
        
        strokeStart: strokeStartBottom,
        
        easing: 'easeOutQuad',
        duration: duration
        
    }, function() {
        
        deferred.resolve(_showsArrow);
    });
    
    
    _showsArrow = true;
    $.showsArrow = true;
    
    
    return deferred.promise;
    
} // END _showArrow()


/**
 * Animate to burger icon
 *
 * @private
 * @param {Number} duration
 * @returns {Promise}
 */
function _showBurger(duration) {
    
    var Promise = require(WPATH('/vendor/q')),
        deferred = Promise.defer(),
        
        strokeStartTop = 0.0,
        strokeStartBottom = 0.0;
    
    
    // if already shows burger icon, abort
    if (!_showsArrow) {
        
        return Promise(_showsArrow);
    }
    
    
    POP.basic(_topStroke, {
        
        top: _topYPosition,
        rotate: {
            z: 0
        },
        
        strokeStart: strokeStartTop,
        
        easing: 'easeOutQuad',
        duration: duration
    });
    
    
    POP.basic(_middleStroke, {
        
        rotate: {
            z: 0
        },
        
        strokeEnd: 1.0,
        
        easing: 'easeOutQuad',
        duration: duration
    });
    
    
    POP.basic(_bottomStroke, {
        
        top: _bottomYPosition,
        rotate: {
            z: 0
        },
        
        strokeStart: strokeStartBottom,
        
        easing: 'easeOutQuad',
        duration: duration
        
    }, function() {
        
        deferred.resolve(_showsArrow);
    });
    
    
    _showsArrow = false;
    $.showsArrow = false;
    
    
    return deferred.promise;
    
} // END _showBurger()


exports.STATE_ARROW = STATE_ARROW;
exports.STATE_HAMBURGER = STATE_HAMBURGER;


/**
 * Toggles button state
 *
 * @public
 * @returns {Promise}
 */
exports.toggle = function() {
    
    return (_showsArrow ? _showBurger(_duration) : _showArrow(_duration));
    
}; // END toggle()


/**
 * Changes button state, statically
 *
 * @public
 * @param {String} state
 * @returns void
 */
exports.changeStateTo = function(state) {
    
    if (_.isString(state)) {
        
        switch (state.toUpperCase()) {
            
            case STATE_ARROW:
                
                _showArrow(0);
                break;
            
            
            case STATE_HAMBURGER:
                
                _showBurger(0);
                break;
        }
    }
    
    
    return;
    
}; // END changeState()
