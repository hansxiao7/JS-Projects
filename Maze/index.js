const {
    Engine, 
    Render, 
    Runner, 
    World, 
    Bodies, 
    Body, // velocity etc.
    Events
    // MouseConstraint, Mouse
} = Matter;

// the matter-js has a global variable Matter. 
const engine = Engine.create();
// disable gravity
engine.world.gravity.y = 0;

const {world} = engine;

// render: show object
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const render = Render.create({
    element: document.body,
    engine: engine,
    // canvas size
    options: {
        width: canvasWidth,
        height: canvasHeight,
        // solid or only wireframes for shapes
        wireframes: false
    }
});

// draw the canvas
Render.run(render);
Runner.run(Runner.create(), engine);

// // add mouse property to drag shapes
// World.add(world, MouseConstraint.create(engine, {
//     mouse: Mouse.create(render.canvas)
// }));

// // draw the shape
// // parameters: centerPosX, centerPosY, xwidth (x), height (y)
// const shape = Bodies.rectangle(200, 200, 50, 50, {
//     // isStatic: no gravity
//     isStatic: false
// });

// World.add(world, shape);

// Walls
const walls = [
    Bodies.rectangle(canvasWidth / 2.0, 0, canvasWidth, 10,{
        isStatic: true,
        render:{
            fillStyle: 'red'
        }
    }),
    Bodies.rectangle(0, canvasHeight / 2.0, 10, canvasHeight,{
        isStatic: true,
        render:{
            fillStyle: 'red'
        }
    }),
    Bodies.rectangle(canvasWidth / 2.0, canvasHeight, canvasWidth, 10,{
        isStatic: true,
        render:{
            fillStyle: 'red'
        }
    }),
    Bodies.rectangle(canvasWidth, canvasHeight / 2.0, 10, canvasHeight,{
        isStatic: true,
        render:{
            fillStyle: 'red'
        }
    })
]

World.add(world, walls);

// // random shapes
// for (let i=0;i< 20; i++){
//     const randX = Math.random() * width;
//     const randY = Math.random() * height;
//     if (Math.random() > 0.5){
//         World.add(world, Bodies.rectangle(randX, randY, 50,50));
//     } else {
//         // posX, posY, radius
//         World.add(world, Bodies.circle(randX, randY, 25,{
//             render:{
//                 fillStyle: 'red'
//             }
//         }));
//     }
// };


// shuffle the visitng sequence for maze
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// maze generation
const row = 5;
const col = 5;
const grid = Array(row).fill(null).map(() => Array(col).fill(false));

// flag for vertical walls
const verticals = Array(col-1).fill(null).map(() => Array(row).fill(false));
const horizontals = Array(row-1).fill(null).map(() => Array(col).fill(false));

// go left,  x, y - 1
// go right, x, y + 1
// go up, x + 1, y
// go down, x - 1, y
const moves = [[-1, 0], [1, 0], [0, 1], [0, -1]]

function dfs(x, y){
    if (x < 0 || x >= row || y < 0 || y >= col || grid[x][y]) return;

    grid[x][y] = true;

    shuffle(moves);
    const newMoves = [...moves]

    for (let move of newMoves){
        dx = move[0];
        dy = move[1];

        const newX = x + dx;
        const newY = y + dy;

        if (newX < 0 || newX >= row || newY < 0 || newY >= col) continue;

        if (grid[newX][newY]) continue;
 
        if (dx === 0){
            verticals[Math.min(y, newY)][x] = true;
        } else if (dy === 0){
            horizontals[Math.min(x, newX)][y] = true;
        };

        dfs(newX, newY);
    };
};

const startPos = [Math.floor(Math.random() * row), Math.floor(Math.random() * col)]
dfs(...startPos)

// draw the vertical and horizontal walls
const wallHeight = 10;
const boundaries = (wallWidth, wallHeight, arr, vertical) => {
    const result = []; 
    if (vertical){
        for (let i=0; i< col-1; i++){
            for (let j=0; j< row; j++){
                let x = (i + 1) * canvasWidth / col;
                let y = (j + 0.5) * wallWidth;
                if (!arr[i][j]) result.push(Bodies.rectangle(x, y, wallHeight, wallWidth,{
                    label: 'wall',
                    isStatic: true, 
                    render: {
                        fillStyle: 'red'
                    }
                }))
            }
        };
    } else {
        for (let i=0; i< row-1; i++){
            for (let j=0; j< col; j++){
                let x = (j + 0.5) * wallWidth;
                let y = (i + 1) * canvasHeight / row;
                if (!arr[i][j]) result.push(Bodies.rectangle(x, y, wallWidth, wallHeight,{
                    isStatic: true, 
                    label: 'wall',
                    render: {
                        fillStyle: 'red'
                    }
                }))
            }
        };
    };

    return result;
}

const verticalWallWidth = canvasHeight / row;
const horizontalWallWidth = canvasWidth / col;

const verticalBoundaries = boundaries(verticalWallWidth, wallHeight, verticals, true);
World.add(world, verticalBoundaries, {
    render:{
        fillStyle: 'white'
    }
});

const horizontalBoundaries = boundaries(horizontalWallWidth, wallHeight, horizontals, false);
World.add(world, horizontalBoundaries);


// add the ball to the original location
const ballX = (startPos[1] + 0.5) * canvasWidth / col;
const ballY = (startPos[0] + 0.5) * canvasHeight / row;
const ballR = Math.min(canvasWidth / col, canvasHeight / row) / 4.0;

const ball = Bodies.circle(ballX, ballY, ballR, {
    // isStatic: true,
    label: 'ball',
    render:{
        fillStyle: 'green'
    }
});

World.add(world, ball);



// add goal
const goal = Bodies.rectangle(
    canvasWidth - canvasWidth / col / 2,
    canvasHeight - canvasHeight / row / 2,
    canvasWidth / col * 0.7,
    canvasHeight / row * 0.7,
    {
        label: 'goal',
        isStatic: true,
        render:{
            fillStyle: 'yellow'
        }
    }

);
World.add(world, goal);


document.addEventListener('keydown', (e) => {
    const {x, y} = ball.velocity;
    if (e.key === 'ArrowUp'){
        Body.setVelocity(ball, {x, y:y-5});
    } else if (e.key === 'ArrowDown'){
        Body.setVelocity(ball, {x, y:y+5});
    } else if (e.key === 'ArrowLeft'){
        Body.setVelocity(ball, {x:x - 5, y});
    } else if (e.key === 'ArrowRight'){
        Body.setVelocity(ball, {x:x + 5, y});
    }
});

// win condition
Events.on(engine, 'collisionStart', event =>{
    event.pairs.forEach(collision =>{
        const labels = ['ball', 'goal'];

        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)){
            const h1 = document.querySelector('.winner');
            h1.classList.remove('hidden');
            
            // win, restore gravity to the game
            world.gravity.y = 1;
            world.bodies.forEach(body =>{
                if (body.label === 'wall'){
                    Body.setStatic(body, false);
                }
            })
        };
    });
});