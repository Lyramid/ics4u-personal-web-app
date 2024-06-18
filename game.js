//Initialize the kaboom library
kaboom({ 
    width: 500, 
    height: 500,
    canvas: document.getElementById("gameCanvas"), 
    background: [243, 255, 162],
    stretch: false,
    letterbox: false,
});

MAXLEVEL = 3;
let username = null;

//Load Assets:
loadSprite("man", "./assets/blank-pfp.png");
loadSprite("mc", "./assets/blue-square.png");
loadSprite("slime", "./assets/blue-slime.png");
loadSprite("adventurer", "./assets/grey-square.png");
loadSprite("adv-talk", "./assets/grey-square-talk.png");

//All Scenes:
//Talking Scene
scene("talk", () =>{

    //loadTalk();
    
        //mc talking head
        add([
            sprite("mc"),
            anchor("botleft"),
            pos(10, height()-10),
            scale(4),
        ])
        //adventurer talking head
        add([
            sprite("adv-talk"),
            anchor("botright"),
            pos(width()-10, height()-10),
            scale(4),
        ])
        //speach bubble triangle
        add([
            pos(width()/2, 250),
            polygon([vec2(0, 0), vec2(50, 0), vec2(80, 60)]),
            outline(4),
            area(),
        ])
        //Speech Bubble
        add([
            rect(width()-50, 200, { radius: 10}),
            anchor("center"),
            outline(4),
            pos(width()/2, 150),
        ])
        //Instructions text
        add([
            pos(width()/2, 20),
            text("Click to Continue"),
            color(0,0,0),
            scale(0.5),
            anchor("top")
        ])

    //Picking Adventurer Sentences based on the currentlvl variable
    let dialogue = [];
    switch (currentlvl){
        case 1:
            dialogue = ["Hello "+username, "I can't believe there is a shop already", "It feels like just yesterday when we entered the dungeon (it was)", "Can I buy a health potion from you?", "5 coins? Who do you think I am?", "Never mind, I'll just take my chances without"];
            break;
        case 2:
            dialogue = ["Hello again", "So about that health potion?", "Yea I encountered a pig right outside the town", "I'm beat up? No you're beat up", "10 GOLD?! You must be joking", "I'll take my buisness else where"];
            break;
        case 3:
            dialogue = ["Hi", "I'm here to tell you my father died yesterday", "Yes, it was due to the pig", "It was his dying wish for me to avenge him", "I require a health potion to grant his wish", "15 COINS!?! You're a sicko", username+" eh, my family will always remember you and your decendents", "We will make you and future generations pay for the crimes of their forefathers"];
            break;
    }

    let i = 0;
    add([
        pos(width()/2, 150),
        text(dialogue[i], {
            width: 400
        }),
        anchor("center"),
        color(0,0,0),
        "dialogue"
    ]);
    i++;

    onClick(()=>{
        if(i < dialogue.length){
            destroyAll("dialogue");
            i++;
        }
        else{
            go("lvlEnd")
        }

    });

    onDestroy("dialogue", ()=>{
        add([
            pos(width()/2, 150),
            text(dialogue[i], {
                width: 400
            }),
            anchor("center"),
            color(0,0,0),
            "dialogue"
        ]);
    })
});//End of talk scene

//End of level scene
scene("lvlEnd", () =>{
    loadShop();
    destroyAll("closedDoor");
    destroyAll("closedDoorKnob");
    addAdvExit();

    onDestroy("adv1", () =>{
        if(currentlvl < MAXLEVEL){
            currentlvl++
            go("lvlStart")
        }
        else{
            go("win")
        }
    })
})//End of level end scene

//Win scene so there is some sort of ending for now
scene("win", () => {
    add([
        text("You Win??? That is the game for now", {
            width: 400
        }),
        pos(width()/2,height()/2),
        anchor("center"),
        color(0, 0, 0)
    ])
    
    addButton("Main Menu", vec2(width()/2, height()-100), () => go("main-page"));
    //for some reason the button above would run the fuction once you get to the page, and seems to get fixed
    //when another button is here (but doesn't work if the win button code line is above the main page one)
    //addButton("Filler", vec2(width()/2, height()+100), go("win"));
})

//Game scenes
scene("lvlStart", () =>{

    while(username==null || username ==""){
        setData(username, prompt("What is your name, adventurer?"));
        username = getData(username);
    }


    loadShop();

    //Open door after a bit
    wait(2, () => {
        //need them to have seperate tags to trigger the npc load only once
        destroyAll("closedDoor"),
        destroyAll("closedDoorKnob")
    });

    onDestroy("closedDoor", () => {
        const adv1 = addAdvEnter()
    });

    onCollide("adv1", "table", () =>{
        wait(1, () => {
            go("talk")
        });

    })

});//End of level 1 scene


//Main page
scene("main-page", ()=>{
    currentlvl = 1;
    //Title container
    add([
        pos(width()/2, height()/3),
        rect(width()*2/3, height()/2),
        area(),
        anchor("center"),
        //color(17,42,70),
        outline(4),
    ]);

    //Title text
    add([
        pos(width()/2, height()/3),
        text("Slime Frontier"),
        anchor("center"),
        //color(17,42,70),
        color(0,0,0),
    ]);

    //Buttons to get to other scenes
    addButton("Play", vec2(width()/2, height()-180), () => go("lvlStart"));
    addButton("Level Select", vec2(width()/2, height()-130), () => go("level-select"));
    addButton("Credits", vec2(width()/2, height()-80), () => go("credits"));
    addButton("Delete Data", vec2(width()/2, height()-30), () =>{localStorage.clear(), debug.log("deleted")});

});//End of main page

//Credits page
scene("credits", () =>{
    add([
        pos(width()/2,height()/4),
        text("Leo Lao 2024", {
            //width:500,
            size:50,
        }),
        anchor("center"),
        outline(4),
        color(0,0,0),
    ])

    //addButton("Delete Data", vec2(width()/2, height()-150), () =>{localStorage.clear(), debug.log("deleted")});
    addButton("Back", vec2(width()/2, height()-100), () => go("main-page"));
});//End of credits page

//Level Select page
scene("level-select", () => {
    addButton("Level 1", vec2(width()/2, height() - 400), () =>{go("lvlStart"), currentlvl =1})
    addButton("Level 2", vec2(width()/2, height()-350), () => {go("lvlStart"), currentlvl=2})
    addButton("Level 3", vec2(width()/2, height()-300), () => {go("lvlStart"), currentlvl=3})
    addButton("Back", vec2(width()/2, height()-100), () => go("main-page"));
});//End of Level Select page

//Inital page load and tasks
go("main-page");



//Functions:
//Adds a button with parameter of text contained, position, function that happens when clicked
function addButton(txt, p, f) {
    // add a parent background object
    const btn = add([
        rect(240, 40, { radius: 8 }),
        pos(p),
        area(),
        scale(1),
        anchor("center"),
        outline(4),
    ])
    // add a child object that displays the text
    btn.add([
        text(txt),
        anchor("center"),
        color(0, 0, 0),
    ])
    // onHoverUpdate() comes from area() component
    // it runs every frame when the object is being hovered
    btn.onHoverUpdate(() => {
        btn.color = hsl2rgb(0.6, 0.7, 0.8)
        btn.scale = vec2(1.2)
        setCursor("pointer")
    })
    // onHoverEnd() comes from area() component
    // it runs once when the object stopped being hovered
    btn.onHoverEnd(() => {
        btn.scale = vec2(1)
        btn.color = rgb()
    })
    // onClick() comes from area() component
    // it runs once when the object is clicked
    btn.onClick(f);

    return btn
}//End of make button function

//Loads the shop with the shelves, door, counter, and mc
function loadShop(){
    // the playable character
    const mc = add([
        sprite("mc"),
        pos(width()/2, height()-25),
        anchor("center"),
        area(),
        body(),
    ])
    //left shelf outer part
    add([
        rect(50,height()-200),
        pos(0,100),
        color(205, 138, 45),
        area(),
        body({isStatic: true}),
        "shelf",
    ]);
    //left shelf inner part
    add([
        rect(30,height()-220),
        pos(10,110),
        color(117, 79, 26),
        area(),
        body({isStatic: true}),
        "shelf",
    ]);
    //right shelf outer part
    add([
        rect(50,height()-200),
        anchor("topright"),
        pos(width(),100),
        color(205, 138, 45),
        area(),
        body({isStatic: true}),
        "shelf",
    ]);
    //right shelf inner part
    add([
        rect(30,height()-220),
        anchor("topright"),
        pos(width()-10,110),
        color(117, 79, 26),
        area(),
        body({isStatic: true}),
        "shelf",
    ]);
    //open door 
    add([
        rect(100, 50),
        anchor("top"),
        pos(width()/2,0),
        color(128, 211, 214),
        "openDoor",
    ]);
    //closed door
    add([
        rect(100, 50),
        anchor("top"),
        pos(width()/2,0),
        color(135, 13, 13),
        "closedDoor",
    ]);
    //door knob
    add([
        circle(6),
        color(0,0,0),
        pos(width()/2 +30, 25),
        "closedDoorKnob",
    ]);
    //store counter or table
    add([
        rect(width()/2, 40),
        anchor("center"),
        pos(width()/2, height()-70),
        color(132, 104, 57),
        area(),
        body({ isStatic: true}),
        "table",
    ]);
}//End of loadShop function

//Load talking heads drawings
function loadTalk(){
    //mc talking head
    add([
        sprite("mc"),
        anchor("botleft"),
        pos(10, height()-10),
        scale(4),
    ])
    //adventurer talking head
    add([
        sprite("adv-talk"),
        anchor("botright"),
        pos(width()-10, height()-10),
        scale(4),
    ])
    //speach bubble triangle
    add([
        pos(width()/2, 250),
        polygon([vec2(0, 0), vec2(50, 0), vec2(80, 60)]),
        outline(4),
        area(),
    ])
    //Speech Bubble
    add([
        rect(width()-50, 200, { radius: 10}),
        anchor("center"),
        outline(4),
        pos(width()/2, 150),
    ])
    //Instructions text
    add([
        pos(width()/2, 20),
        text("Click to Continue"),
        color(0,0,0),
        scale(0.5),
        anchor("top")
    ])
}//End of loadTalk function

//Loads an adventurer at the door
function addAdvEnter(){
    add([
        sprite("adventurer"),
        pos(width()/2, 16),
        anchor("center"),
        area(),
        body(),
        "adv1",
        z(-1),
        move(DOWN, 100)
    ]);
}//End of addAdv function

//Loads an adventurer at the door
function addAdvExit(){
    add([
        sprite("adventurer"),
        pos(width()/2, height()-90),
        anchor("bot"),
        area(),
        body(),
        "adv1",
        z(-1),
        move(UP, 100),
        offscreen({ destroy: true})
    ]);
}//End of addAdv function

