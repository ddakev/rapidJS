/**
 * @file Framework for creating 2D HTML5 Canvas games powered by Javascript
 * @author Daniel Dakev
 * @version 0.0.1
 */

/**
 * @constant Animations
 * @desc Animation constants
 * @prop {number} ANIMATION_PAUSED      - Code for paused animation
 * @prop {number} ANIMATION_RUNNING     - Code for running animation
 */
var Animations = {
  ANIMATION_PAUSED: 0,
  ANIMATION_RUNNING: 1
};

/**
 * @constant Keyboard
 * @desc Key codes for all keys on the keyboard
 */
 var Keyboard = {
   BACK_SPACE: 8,
   TAB: 9,
   ENTER: 13,
   SHIFT: 16,
   CONTROL: 17,
   ALT: 18,
   CAPS_LOCK: 20,
   ESCAPE: 27,
   SPACE: 32,
   PAGE_UP: 33,
   PAGE_DOWN: 34,
   END: 35,
   HOME: 36,
   LEFT: 37,
   UP: 38,
   RIGHT: 39,
   DOWN: 40,
   PRINTSCREEN: 44,
   INSERT: 45,
   DELETE: 46,
   N0: 48,
   N1: 49,
   N2: 50,
   N3: 51,
   N4: 52,
   N5: 53,
   N6: 54,
   N7: 55,
   N8: 56,
   N9: 57,
   SEMICOLON: 59,
   EQUALS: 61,
   A: 65,
   B: 66,
   C: 67,
   D: 68,
   E: 69,
   F: 70,
   G: 71,
   H: 72,
   I: 73,
   J: 74,
   K: 75,
   L: 76,
   M: 77,
   N: 78,
   O: 79,
   P: 80,
   Q: 81,
   R: 82,
   S: 83,
   T: 84,
   U: 85,
   V: 86,
   W: 87,
   X: 88,
   Y: 89,
   Z: 90,
   CONTEXT_MENU: 93,
   NUMPAD0: 96,
   NUMPAD1: 97,
   NUMPAD2: 98,
   NUMPAD3: 99,
   NUMPAD4: 100,
   NUMPAD5: 101,
   NUMPAD6: 102,
   NUMPAD7: 103,
   NUMPAD8: 104,
   NUMPAD9: 105,
   MULTIPLY: 106,
   ADD: 107,
   SEPARATOR: 108,
   SUBTRACT: 109,
   DECIMAL: 110,
   DIVIDE: 111,
   F1: 112,
   F2: 113,
   F3: 114,
   F4: 115,
   F5: 116,
   F6: 117,
   F7: 118,
   F8: 119,
   F9: 120,
   F10: 121,
   F11: 122,
   F12: 123,
   NUM_LOCK: 144,
   SCROLL_LOCK: 145,
   COMMA: 188,
   PERIOD: 190,
   SLASH: 191,
   BACK_QUOTE: 192,
   OPEN_BRACKET: 219,
   BACK_SLASH: 220,
   CLOSE_BRACKET: 221,
   QUOTE: 222
};

/**
 * @constant Mouse
 * @desc Codes for all mouse buttons
 * @prop {number} LEFT                  - Code for left mouse button
 * @prop {number} RIGHT                 - Code for right mouse button
 * @prop {number} MIDDLE                - Code for middle mouse button
 * @prop {number} SCROLL                - Code for scrolling event
 */
var Mouse = {
  LEFT: 0,
  RIGHT: 1,
  MIDDLE: 2,
  SCROLL: 3
};

/**
 * @constant Events
 * @desc Constant codes for events. Used for key bindings initializations
 * @prop {number} MOUSE_DOWN            - Code for mouse button held down
 * @prop {number} MOUSE_UP              - Code for mouse button released
 * @prop {number} MOUSE_PRESSED         - Code for mouse button pressed; executed once between MOUSE_DOWN and MOUSE_UP
 * @prop {number} MOUSE_SCROLL          - Code for scrolling event
 * @prop {number} KEY_DOWN              - Code for key held down
 * @prop {number} KEY_UP                - Code for key released
 * @prop {number} KEY_PRESSED           - Code for key pressed; executed once between KEY_DOWN and KEY_UP
 */
var Events = {
  MOUSE_DOWN: 4,
  MOUSE_UP: 5,
  MOUSE_PRESSED: 6,
  MOUSE_SCROLL: 3,
  KEY_DOWN: 4,
  KEY_UP: 5,
  KEY_PRESSED: 6
};

/*
 * Array of key bindings. For each key code, there is an array of objects with event type and function.
 */
var bindings = new Array(256);

/*
 * Array showing which keys are being pressed. When pressed, value goes to 2 for 1 iteration, after that transitions to 1 for key-held event. When released, value goes to 3 for 1 iteration, then back to 0 for key not pressed.
 */
var keysPressed = new Array(256);

/*
 * Mouse position
 */
var mouseX;
var mouseY;

/**
 * Constructor with parameters the window where the game is played and the canvas where the game is drawn
 * @class
 * @classdesc Describes a game area by a window and canvas element where the game is played
 * @param {Window} window               - window where game is played
 * @param {DOMObject} canvas            - canvas where game is played
 * @param {number} fps                  - maximum frames per second
 */
function RapidGame(window, canvas, fps) {
  this.window = window;
  this.canvas = canvas;
  this.fps = fps || 60;
  this.scene = null;
  this.ctx = this.canvas.getContext('2d');

  this.init();
}
/**
 * Initializes the game when the RapidGame object is created
 */
RapidGame.prototype.init = function() {
  for(var i = 0; i < keysPressed.length; i++)
    keysPressed[i] = 0;
  for(var i = 0; i < bindings.length; i++)
    bindings[i] = [];
  this.window.addEventListener("keydown", function(e) {
    keysPressed[e.keyCode] = 2;
  });
  this.window.addEventListener("keyup", function(e) {
    keysPressed[e.keyCode] = 3;
  });
  this.window.addEventListener("mousedown", function(e) {
    keysPressed[e.keyCode] = 2;
  });
  this.window.addEventListener("mouseup", function(e) {
    keysPressed[e.keyCode] = 3;
  });
  this.window.addEventListener("scroll", function(e) {
    // scroll event
  });
  this.window.addEventListener("mousemove", function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });


  setInterval(this.advance, 1000/this.fps);
  this.drawLoop();
};
/**
 * Executes the render loop
 */
RapidGame.prototype.drawLoop = function() {
  if(this.scene != null) {
    this.scene.draw(this.ctx);
  }

  this.window.requestAnimationFrame(drawLoop);
};
/**
 * Executes the calculation loop
 */
RapidGame.prototype.advance = function() {
  if(this.scene != null) {
    this.scene.advance();
  }
}
/**
 * Adds a new key binding to the RapidGame object
 * @param {number} key                  - key/mouse code
 * @param {number} eventCode            - event codes
 * @param {function} bind               - binding function to be called when the event fires
 */
GameObject.prototype.addKeyBinding = function(key, eventCode, bind) {
  var flag = false;
  if(eventCode >= Events.KEY_DOWN && eventCode <= Events.KEY_PRESSED) {
    for(var prop in Keyboard) {
      if(!Keyboard.hasOwnProperty(prop)) continue;
      if(Keyboard[prop] == key) {
        flag = true;
        break;
      }
    }
  }
  else if(eventCode >= Events.MOUSE_DOWN && eventCode <= Events.MOUSE_SCROLL) {
    for(var prop in Mouse) {
      if(!Mouse.hasOwnProperty(prop)) continue;
      if(Mouse[prop] == key) {
        flag = true;
        break;
      }
    }
  }
  else return;
  if(flag == false) return;
  bindings[key].add({eventC: eventCode, binding: bind});
};
/**
 *
 */
RapidGame.prototype.handleInput = function() {
  for(var i = 0; i < keysPressed.length; i++) {
    if(keysPressed[i] == 2) {
      for(var j = 0; j < bindings[i].length; j++) {
        if(bindings[j].eventC == Events.KEY_DOWN) {
          bindings[j].binding();
        }
      }
      keysPressed[i] = 1;
    }
    else if(keysPressed[i] == 3) {
      for(var j = 0; j < bindings[i].length; j++) {
        if(bindings[j].eventC == Events.KEY_UP) {
          bindings[j].binding();
        }
      }
      keysPressed[i] = 0;
    }
    else if(keysPressed[i] == 1) {
      for(var j = 0; j < bindings[i].length; j++) {
        if(bindings[j].eventC == Events.KEY_PRESSED) {
          bindings[j].binding();
        }
      }
    }
  }
};
/**
 * Sets a new scene in the game area and starts it.
 */
RapidGame.prototype.setScene = function(scene) {
  this.scene=scene;
  this.scene.rapidGame = this;
  this.scene.start();
};

/**
 * Constructor with parameters for position, size and collider of the game object
 * @class
 * @classdesc Describes a generic game object
 * @param {number} x                    - x coordinate of position
 * @param {number} y                    - y coordinate of position
 * @param {number} width                - width of game object
 * @param {number} height               - height of game object
 * @param {Collider} collider           - collider of game object
 */
function GameObject(x, y, width, height, collider) {
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 0;
  this.height = height || 0;
  this.collider = collider || null;
  this.collisionListeners = [];
  this.animations = [];
  this.currentAnimation = null;
  this.image = null;
}
/**
 * Set new coordinates
 * @param {number} x                    - new x coordinate
 * @param {number} y                    - new y coordinate
 */
GameObject.prototype.moveTo = function(x, y) {
  this.x = x;
  this.y = y;
};
/**
 * Moves the coordinates by set amount
 * @param {number} dx                   - distance to move in x direction
 * @param {number} dy                   - distance to move in y direction
 */
GameObject.prototype.moveBy = function(dx, dy) {
  this.x += dx;
  this.y += dy;
};
/**
 * Sets the size of the game object
 * @param {number} w                    - new width
 * @param {number} h                    - new height
 */
GameObject.prototype.setSize = function(w, h) {
  this.width = w;
  this.height = h;
};
/**
 * Sets the collider for the game object
 * @param {Collider} c                  - new collider
 */
GameObject.prototype.setCollider = function(c) {
  this.collider = c;
};
/**
 * Adds a collision event listener
 * @param {GameObject} gameObject       - another game object that would collide with the current one
 * @param {function} collisionFunction  - function to be called on collision with gameObject
 */
GameObject.prototype.onCollisionWith = function(gameObject, collisionFunction) {
  this.collisionListeners[gameObject] = collisionFunction;
};
/**
 * Adds a new animation to the collection of animations for the current object.
 * @param {Animation} anim              - new animation
 */
GameObject.prototype.addAnimation = function(anim) {
  this.animations.add(anim);
};
/**
 * Plays the animation with name animName
 * @param {string} animName             - animation Name of the animation to play
 */
GameObject.prototype.playAnimation = function(animName) {
  if(this.currentAnimation != null) {
    this.currentAnimation.pause();
    this.currentAnimation.restart();
  }
  this.animations.forEach(function(animation) {
    if(animation.name == animName) {
      this.currentAnimation = animation;
    }
  });
};
/**
 * Pauses the currently playing animation
 */
GameObject.prototype.pauseAnimation = function() {
  this.currentAnimation.pause();
};
/**
 * Restarts the currently playing animation
 */
GameObject.prototype.restartAnimation = function() {
  this.currentAnimation.restart();
};
/**
 * Disables any animation currently attached to object and displays its default image
 */
GameObject.prototype.stopAnimation = function() {
  this.currentAnimation.pause();
  this.currentAnimation.restart();
  this.currentAnimation = null;
};
/**
 * Sets the image of the game object
 * @param {Image} image                 - new image for the game object
 */
GameObject.prototype.setImage = function(image) {
  this.image = image;
};
/**
 * Draws the game object to the screenWidth
 * @param {Context} ctx                 - drawing context
 */
GameObject.prototype.draw = function(ctx) {
  if(this.currentAnimation == null)
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, this.width, this.height);
  else
    this.currentAnimation.draw(this.x, this.y, this.width, this.height);
};
/**
 * Advances the game object's properties by one frame
 */
GameObject.prototype.advance = function() {
  if(this.currentAnimation != null)
    this.currentAnimation.advance();
};

/**
 * Constructor with parameter a polygon to be used as collider
 * @class
 * @classdesc Describes a polygon collider
 * @param {Array} polygon               - array of value pairs representing the vertices of the polygon collider relative to top-left corner of object
 */
function Collider(polygon) {
  this.polygon = polygon;
}
/**
 * Sets a new polygon for the collider
 * @param {Array} polygon               - array of value pairs representing the vertices of the polygon collider relative to top-left corner of object
 */
Collider.prototype.setCollider = function(polygon) {
  this.polygon = polygon;
};

/**
 * Constructor with parameters name, spritesheet, number of rows and columns, duration, and whether to repeat
 * @class
 * @classdesc Describes an animation for a game object
 * @param {string} name                 - name of animation
 * @param {Image} image                 - sprite sheet for animation
 * @param {number} rows                 - number of rows in the spritesheet (defaults to 1)
 * @param {number} cols                 - number of cols in the spritesheet (defaults to 1)
 * @param {number} duration             - duration of animation in milliseconds
 * @param {boolean} repeat              - whether the animation should repeat after it ends
 */
function Animation(name, image, rows, cols, duration, repeat) {
  this.name = name;
  this.currentFrame = -1;
  this.image = image;
  this.rows = rows || 1;
  this.columns = cols || 1;
  this.duration = duration || 1000;
  this.status = Animations.ANIMATION_PAUSED;
  this.repeat = repeat || false;
}
/**
 * Starts the current animation
 */
Animation.prototype.start = function() {
  this.status = Animations.ANIMATION_RUNNING;
};
/**
 * Pauses the current animation
 */
Animation.prototype.pause = function() {
  this.status = Animations.ANIMATION_PAUSED;
};
/**
 * Rewinds the current animation back to its startY
 */
Animation.prototype.restart = function() {
  this.currentFrame = -1;
};
/**
 * Sets a new sprite sheet for the animation
 * @param {Image} image                 - an animated spritesheet
 */
Animation.prototype.setImage = function(image) {
  this.image = image;
};
/**
 * Sets a new duration for the animation
 * @param {number} duration             - new duration for the animation in milliseconds
 */
Animation.prototype.setDuration = function(duration) {
  this.duration = duration;
};
/**
 * Draws the current frame of the animation at the specified position and box size
 * @param {Context} ctx                 - drawing Context
 * @param {number} x                    - x coordinate of position where to draw the animation frame
 * @param {number} y                    - y coordinate of position where to draw the animation frame
 * @param {number} width                - width of the displayed frame
 * @param {number} height               - height of the displayed frame
 */
Animation.prototype.draw = function(ctx, x, y, width, height) {
  var row = this.currentFrame / this.columns;
  var col = this.currentFrame % this.columns;
  ctx.drawImage(this.image, col*this.image.width/this.columns, row*this.image.height/this.rows, this.image.width/this.columns, this.image.height/this.rows, x, y, width, height);
};
/**
 * Advances the animation by one frame; If animation is completed, either restart animation or stop it, depending on the repeat value
 */
Animation.prototype.advance = function() {
  if(this.status == Animations.ANIMATION_RUNNING) {
    this.currentFrame ++;
    if(this.currentFrame > this.rows * this.cols - 1) {
      if(this.repeat) this.currentFrame = 0;
      else {
        this.status = Animations.ANIMATION_PAUSED;
        this.currentFrame = -1;
      }
    }
  }
};

/**
 * Scene constructor with a background as an optional parameter
 * @class
 * @classdesc Describes a game Scene
 * @param {function} stopCallback       - callback function that is called when the scene is stopped
 */

function Scene(stopCallback) {
  this.rapidGame = null;
  this.stopCallback = stopCallback;
  this.gameObjects = [];
  this.ctx = null;
}
/**
 * Adds a GameObject to the Scene
 * @param {GameObject} gameObject       - GameObject to be added to the scene
 */
Scene.prototype.addGameObject = function(gameObject) {
  this.gameObjects.add(gameObject);
};
/**
 * Advances all objects and the background in the scene
 */
Scene.prototype.advance = function() {
  this.rapidGame.handleInput();


};
/**
 * Draws the background and all objects in the scene
 * @param {Context} ctx                 - drawing context
 */
Scene.prototype.draw = function(ctx) {

};
/**
 * Starts the scene
 */
Scene.prototype.start = function() {

};
/**
 * Stops the scene
 */
Scene.prototype.stop = function() {


  this.stopCallback();
};
