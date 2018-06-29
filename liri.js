//REQUIRED PACKAGES AND KEYS

require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require("twitter");
var request = require("request");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//FOLD SPINDLE AND MANIPULATE THE USER INPUT

var cli = process.argv[2];
var input = process.argv;

var responsePhrase = "";
for (var i = 3; i < input.length; i++) {
    responsePhrase = responsePhrase + " " + input[i];
};


//SERIES OF IF ELSE STATEMENTS TO DETERMINE WHICH FUNCTION TO CALL

if (cli === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, dataFromRandom) {
        if (error) {
            return console.log(error);
        } else {
            var datArray= dataFromRandom.split('"');
            responsePhrase = datArray[1];
          //  console.log("randomtext  split  " + responsePhrase);
            music();
        }
    });
} else if (cli === "my-tweets") {
    social();
} else if (cli === "spotify-this-song") {
    if (responsePhrase) {
        music(responsePhrase);
    } else {
        responsePhrase = "Ace of Base";
        music(responsePhrase);
    }
} else if (cli === "movie-this") {
    if (responsePhrase) {
        flicks(responsePhrase);
    } else {
        responsePhrase = "Mr Nobody";
        flicks(responsePhrase)
    };
} else {
    console.log("Please follow the approved homework format")
}

// OMDB TWITTER AND SPOTIFY FUNCTIONS BELOW
// OMDB SECTION
function flicks() {
    //  console.log("test if inside function " + responsePhrase);
    request("http://www.omdbapi.com/?t=" + responsePhrase + "&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Title is :" + JSON.parse(body).Title);
            console.log("Year is :" + JSON.parse(body).Year);
            console.log("IMDB Rating is :" + JSON.parse(body).imdbRating);
            console.log("Language is " + JSON.parse(body).Language);
            console.log("Actors are :" + JSON.parse(body).Actors);
            // console.log("Rotten Tomatoes says :" + JSON.parse(body).Ratings[1].Value);

// Rotten Tomatoes commented out due to excessive errors in console
//it works, but omdb often returns movie without Rotten Tomato Value
            //  console.log("test :" + JSON.stringify(body, null, 4));

        }
    });
}


//TWITTER SECTION
function social() {
    var params = {
        q: 'DogDays39425483',
        count: 21
    }
    client.get('search/tweets', params, function (error, tweets, response) {
        if (error) {
            return console.log("error");
        } else {
            //  console.log(tweets);
            for (i = 0; i < 20; i++) {
                console.log("Tweet  :" + tweets.statuses[i].text);
                console.log("Created at  :" + tweets.statuses[i].created_at);
            }
        }
    });
}
//SPOTIFY SECTION
function music() {
    spotify.search({ type: 'track', query: responsePhrase, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log("got this far");
        //console.log(data); 
        // console.log(JSON.stringify(data, null, 4));
        console.log("Artist name :" + data.tracks.items[0].artists[0].name);
        console.log("Song Title :" + data.tracks.items[0].name);
        console.log("Preview link :" + data.tracks.items[0].preview_url);
        console.log("From the album :" + data.tracks.items[0].album.name);

    });
}