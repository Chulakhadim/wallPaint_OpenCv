let imageData;

let fills = [];

function loop()
{
    animatePixels();
    
    if (mouseIsPressed)
    {
        line(floor(pmouseX), floor(pmouseY), floor(mouseX), floor(mouseY));
    }
}

function animatePixels()
{
    for(let f of fills)
    {
        if (f.pi < f.pixels.length)
        {
            push();
            stroke(255, 0, 0, 255);
            let [x, y] = f.pixels[f.pi++];
            point(x, y);
            pop();
        }
    }
}

function keyPressed()
{
    fills.push({
        pixels : [],
        pi : 0
    });
    
    imageData = drawingContext.getImageData(0, 0, 800, 600);
    fill(floor(mouseX), floor(mouseY), key === "1");
    drawingContext.putImageData(imageData, 0, 0);
}

// dfs = selects the fill algorithm
function fill(x, y, dfs)
{
    let fillStack = [];
    
    fillStack.push([x, y]);
    
    while(fillStack.length > 0)
    {
        let [x, y] = dfs ? fillStack.pop() : fillStack.shift();
        
        if (!valid(x, y))
            continue;
            
        if (isPixel(x, y))
            continue;
            
        setPixel(x, y);
        
        fillStack.push([x, y + 1]);
        fillStack.push([x, y - 1]);
        fillStack.push([x - 1, y]);
        fillStack.push([x + 1, y]);
    }
}


function fillRecursive(x, y)
{
    if (!valid(x, y))
        return;
        
    if (isPixel(x, y))
        return;
        
    setPixel(x, y);
    
    fillRecursive(x + 1, y);
    fillRecursive(x - 1, y);
    fillRecursive(x, y - 1);
    fillRecursive(x, y + 1);
}

function setPixel(x, y)
{
    let pixels = imageData.data;
    
    let i = (y * width + x) * 4;
    
    pixels[i] = 255;    // R
    pixels[i + 1] = 0;  // G
    pixels[i + 2] = 0;  // B
    pixels[i + 3] = 20; // A
    
    // Store the set pixel in an array
    // that will be used later on for animation
    let fillPixels = fills.peek().pixels;
    fillPixels.push([x, y]);
}

function isPixel(x, y)
{
    let pixels = imageData.data;
    
    let i = (y * width + x) * 4;
    
    return pixels[i + 3] > 0;
}

function valid(x, y)
{
    return x >= 0 && x <= width - 1 && 
            y >= 0 && y <= height - 1;
}


// function setPixel_(x, y)
// {
//     push();
//     stroke(255, 0, 0);
//     point(x, y);
//     pop();
// }

// function isPixel_(x, y)
// {
//     // [R, G, B, A]
//     let ar = get(x, y);
    
//     return ar[3] > 0;
// }

