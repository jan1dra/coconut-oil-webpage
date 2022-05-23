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
    _game.platform = create_platform(0, 360, _game.width, 40);

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

	_player.velocity_x = 0;
_player.velocity_x_delta = 0.8;
    _player.velocity_x_max = 3.5;
	_player.velocity_y = 0;
player.velocity_y_jump = -10;
    _player.velocity_y_max = 10;
}

function create_platform(x, y, width, height) {
    var p = {};
    p.x = x;
    p.y = y;
    p.width = width;
    p.height = height;
    return p;
}

// Erase the canvas and draw all the objects.
function draw() {
	var canvas = document.getElementById("stage");
	var ctx = canvas.getContext("2d");

	erase(ctx);
	draw_platforms(ctx);
	draw_player(ctx);
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


// Draw the player.
function draw_player(ctx) {
	ctx.fillStyle = "blue";
	 ctx.fillRect(_player.x - _player.origin_x, _player.y - _player.origin_y,
                    _player.width, _player.height);
}

// Handle input and move the player.
function update_player() {
	check_input();

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
    check_platform_collisions();
}

function check_platform_collisions() {
    if (_player.y > _game.platform.y) {
        _player.y = _game.platform.y;
        _player.velocity_y = 0;
    }
}

// This is called ~60 times per second to update the world.
function update_world() {
	update_player();
check_collisions();
	draw();

	requestAnimationFrame(update_world);
}

setup();

