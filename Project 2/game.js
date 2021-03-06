$(function() {

    function startGame(){
        log("Handler for start .click() called.");

        var gameValues = new PlayerSelectedValues();
        log("Game Values Created");
//here is were i changed it
        var flower = new Flower(gameValues.name()); 
        log("Flower Created");
        log("# of Flower Petals " + flower.petals());

        RemoveIntro();

        //setup petals and click event handlers
        FlowerView(flower, gameValues);
    };

    // setup click event for submit
    $("#start").click(function(event) {
        event.preventDefault();
        startGame();
	});

     $("#name").keypress(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);

        if (code == 13) {
            startGame();
            return false;
        }
    });
});

function FlowerView(flowerData, gameValues){

    var debug = false;

    var loveOrNot$ = $("#loveOrNot");

    if (typeof (Raphael) !== "function") {
        // no Raphael!
        throw "Please ensure Raphael.js is referenced.";
    }

    this.paper = Raphael(flower, 350, 650);

    var stem = this.paper.path("M 150 150, Q 210 227 150 300 Q 70 400 150 450")
    stem.attr({stroke:'#2D0505',"stroke-width":5});

    stem.attr("width", 5);
    for(var i = 0; i < flowerData.petals(); i++){
        log("creating petal");

        // Creates circle Polar coordinate system

        var radius = 83;
        var centerX = 170;
        var centerY = 160;

        var xPosition = radius * Math.cos(2 * Math.PI * i / flowerData.petals()) + centerX;
        var yPosition = radius * Math.sin(2 * Math.PI * i / flowerData.petals()) + centerY;

        var ellipseHeight = 70;
        var petalEllipse = this.paper.ellipse(xPosition, yPosition, 30, ellipseHeight);

        var angle = null;

        if(xPosition !== centerX){

            var triangle = new TrianglePointsToDegrees(xPosition, yPosition, centerX, centerY, xPosition, yPosition + ellipseHeight)
        
            if(xPosition > centerX){
                angle = triangle.cDegree();
            }
            else{
                angle = -triangle.cDegree();
            }
        }

        //rotate ellipse around center
        if(angle){
            petalEllipse.transform("r" + angle);
        }

        // Sets the fill attribute of the circle to red (#f00)
        var color = Raphael.getColor(0.82);
        petalEllipse.attr("fill", "#2D0505");
        petalEllipse.node.setAttribute("class","petals");
        
        // Sets the stroke attribute of the circle to white
        petalEllipse.attr("stroke", "#00FF00");
        petalEllipse.attr("stroke-opacity", 1.5);

        petalEllipse.click( function(){ 
            flowerData.removePetal();
            this.remove();
            log("removed petal, now only " + flowerData.petals() + " left");

            //show love message
            loveOrNot$.html(flowerData.result());

            if(flowerData.petals() == 0)
            {
                GameOver(flowerData, gameValues);
            }
        });
    }

    var flowerCenter = this.paper.circle(centerX, centerY, 25);


    // Sets the fill attribute of the center circle 

   


    // Sets the stroke attribute of the circle to white
    flowerCenter.attr("stroke", "#00FF00");
    
    //debug code
    if(debug){
        //draw the circle used to position petals
        var debugCircle = this.paper.circle(centerX, centerY, radius);
        debugCircle.attr("stroke", "#aba");

        //draw x, y grid
        var vLine = paper.path("M" + centerX + " 500 L" + centerX +" 0");
        vLine.attr("stroke", "#aba");

        var hLine = paper.path("M0 " + centerY + " 350 " + centerY);
        hLine.attr("stroke", "#aba");

        var debugCircle = this.paper.circle(centerX, centerY, radius);
        debugCircle.attr("stroke", "#aba");

        for(var i = 0; i < flowerData.petals(); i++){
            
            var xPosition = radius * Math.cos(2 * Math.PI * i / flowerData.petals()) + centerX;
            var yPosition = radius * Math.sin(2 * Math.PI * i / flowerData.petals()) + centerY;

            var t = paper.text(xPosition, yPosition, "(" + xPosition.toFixed(0) + "," + yPosition.toFixed(0) + ")");

            var debugRadians = this.paper.circle(xPosition, yPosition, 1);
            debugRadians.attr("fill", "#aba");

            var petalTransformDebug = this.paper.path("M" + xPosition + ", " + yPosition + "," + centerX + "," + centerY + "," + xPosition + "," + (yPosition + ellipseHeight) + "z");
            petalTransformDebug.attr("stroke", "#aba");
         }
    }
};

function GameOver(flowerData, gameValues){
    log("game over");

        var finalWords = "Error; Love not found";
        confirm("You won't ever find love here");

    if(!flowerData.isItLove())
    {
        finalWords = "Error; Love not found";
        confirm("01101100 01101111 01110110 01100101");
    }

    $("#loveNote").append("<h1>" + finalWords + "</H1>");
    $("#loveNote").append("<div id='loveGPlusOne'><div class='g-plusone' data-annotation='none'></div><div class='fb-like' data-href='http://theelove.me/' data-width='100' data-layout='button_count' data-show-faces='false' data-send='false'></div></div>");

	//Google+
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);

    (function (d, s, id) {
    	var js, fjs = d.getElementsByTagName(s)[0];
    	if (d.getElementById(id)) return;
    	js = d.createElement(s); js.id = id;
    	js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=1410285219184724";
    	fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
};

function RemoveIntro(){
    $("#intro").hide();
}

function PlayerSelectedValues() {
    var sex = $('input[name=sex]:radio:checked').val();

    log("selected sex was " + sex);

    var name$ = $('#name');

    //set a default value for name
    var name = "someone";

     if(name$)
     {
        var nameValue = name$.val();

        if(nameValue)
        {
            name = name$.val();
        }

        log("selected name was " + name);
    }

    this.name = function()
    {
        return name;
    };

    this.sex = function()
    {
        return sex;
    };
}
