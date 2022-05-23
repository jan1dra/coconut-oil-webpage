// Global variables.
var _game = {};
var _player = {};

function setup() {
    window.addEventListener("load", handle_load, false);
    window.addEventListener("keydown", handle_keydown, false);
    window.addEventListener("keyup", handle_keyup, false);
}

// Handle the load event (which is sent when the page has finished loading).
function handle_load(event) {
    init();
    requestAnimationFrame(update_world);
}

function handle_keydown(event) {
    _game.keymap[event.keyCode] = true;
}

function handle_keyup(event) {
    _game.keymap[event.keyCode] = false;
}

// Initialize the game state.
function init() {
    init_game();
    init_player();
}

// Initialize general game state info.
function init_game() {
     var canvas = document.getElementById("stage");
    canvas.width = 550;
    canvas.height = 400;

    _game.width = canvas.width;
    _game.height = canvas.height;

    // The keymap keeps track of which keys are currently being pressed.
    _game.keymap = {};

	// Game state.
	_game.game_over = false;
    _game.platform = create_platform(0, 360, _game.width, 40);
	 _game.goal = create_goal(500, 360);

	// Global world parameters.
    _game.friction = 0.15;
    _game.gravity = 0.5;

}

// Initialize player data.
function init_player() {
    _player.x = 20;
    _player.y = 360;
    _player.width = 20;
    _player.height = 20;
_player.origin_x = _player.width / 2;
    _player.origin_y = _player.height;
 _player.platform = null;


_player.velocity_x = 0;
    _player.velocity_x_delta = 0.8;
    _player.velocity_x_max = 3.5;
    _player.velocity_y = 0;
_player.velocity_y_jump = -10;
    _player.velocity_y_max = 10;
}

function create_platform(x, y, width, height) {
    var p = {};
    p.x = x;
    p.y = y;
    p.width = width;
    p.height = height;
p.origin_x = 0;
    p.origin_y = 0;
    return p;
}
function create_monster(x, y, width, height) {
    var m = {};
    m.x = x;
    m.y = y;
    m.width = width;
    m.height = height;
    m.origin_x = m.width / 2;
    m.origin_y = m.height;
    return m;
}

function create_goal(x, y) {
    var goal = {};
    goal.x = x;
    goal.y = y;
    goal.width = 20;
    goal.height = 20;
    goal.origin_x = goal.width / 2;
    goal.origin_y = goal.height;
    return goal;
}

// Erase the canvas and draw all the objects.
function draw() {
    var canvas = document.getElementById("stage");
    var ctx = canvas.getContext("2d");

    erase(ctx);
 draw_platforms(ctx);
draw_goal(ctx);
    draw_player(ctx);

if (_game.game_over) {
        // Dim out the stage by drawing a transparent black rectangle over it.
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, _game.width, _game.height);

        ctx.fillStyle = "black";
        ctx.font = "48px Helvetica";
        ctx.fillText("Game Over", 140, 150);
    }
}

// Erase the canvas by filling it with white.
function erase(ctx) {
ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, _game.width, _game.height);
}

// Draw the platforms.
function draw_platforms(ctx) {
    var platform = _game.platform;
    ctx.fillStyle = "rgb(153, 102, 51)";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
}

function draw_goal(ctx) {
    var goal = _game.goal;
    ctx.fillStyle = "green";
    ctx.fillRect(goal.x - goal.origin_x, goal.y - goal.origin_y,
                    goal.width, goal.height);
}
    
// Draw the player.
function draw_player(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(_player.x - _player.origin_x, _player.y - _player.origin_y,
                    _player.width, _player.height);
}

// Handle input and move the player.
function update_player() {
    if (!_game.game_over) {
    check_input();
    }

// Apply the global world effects on the player.
    _player.velocity_x *= (1.0 - _game.friction);
     _player.velocity_y += _game.gravity;
    if (_player.velocity_y > _player.velocity_y_max)
        _player.velocity_y = _player.velocity_y_max;
 

    // Move the player to the new location.
    _player.x += _player.velocity_x;
    _player.y += _player.velocity_y;

if (_player.x < 0) {
        _player.x = 0;
    } else if (_player.x > _game.width) {
        _player.x = _game.width;
    }
}

function check_input() {
   

    // Left arrow or 'a' to move left.
    if (_game.keymap[37] || _game.keymap[65]) {
       _player.velocity_x -= _player.velocity_x_delta;
        if (_player.velocity_x < -_player.velocity_x_max) {
            _player.velocity_x = -_player.velocity_x_max;
        }
    }
    // Right arrow or 'd' to move right.
    if (_game.keymap[39] || _game.keymap[68]) {
        _player.velocity_x += _player.velocity_x_delta;
        if (_player.velocity_x > _player.velocity_x_max) {
            _player.velocity_x = _player.velocity_x_max;
        }
	}
// Up arrow, 'w'  and spacebar to jump.
    if (_game.keymap[38] || _game.keymap[87] || _game.keymap[32]) {
        _player.velocity_y = _player.velocity_y_jump;
    }

}

function check_collisions() {
    check_goal_collisions();
}

function check_goal_collisions() {
    var goal = _game.goal;
    if (collide(goal, _player)) {
        _game.game_over = true;
    }
}

// Return true if the 2 objects overlap.
function collide(obj1, obj2) {
   if ((obj1.x - obj1.origin_x + obj1.width) <= (obj2.x - obj2.origin_x))
        return false;
    if ((obj1.y - obj1.origin_y + obj1.height) <= (obj2.y - obj2.origin_y))
        return false;
    if ((obj2.x - obj2.origin_x + obj2.width) <= (obj1.x - obj1.origin_x))
        return false;
    if ((obj2.y - obj2.origin_y + obj2.height) <= (obj1.y - obj1.origin_y))
        return false;

   return true; 
}
// This is called ~60 times per second to update the world.
function update_world() {
    update_player();
check_collisions();
    draw();

    requestAnimationFrame(update_world);
}

setup();



