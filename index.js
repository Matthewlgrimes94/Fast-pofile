const fs = require('fs');
const inquirer = require('inquirer');
const axios = require('axios');
var pdf = require("html-pdf");

//Promt user for info
function prompt() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'profile',
            message: 'Enter a Github username'
        },
        {
            type: 'rawlist',
            name: 'color',
            choices: ['red', 'blue', 'green','orange', 'pink']
        }
       // Get answers and use them to get github info 
    ]).then(function(answers) {
        var name = answers.profile;
        var color = answers.color;
        var user = getUserData(name, color);
    });
}

//API call to hithub for user info
function getUserData(user, color) {
    console.log(user);
    axios.get(`https://api.github.com/users/${user}`)
  .then(function (response) {
    //Using HTML-PDF to create pdf from HTML
    info = response.data
        var generated = generateHTML(info,color);
        var options = {fomat: 'letter'};
        pdf.create(generated, options).toFile('./profile.pdf', function(err, res) {
            if (err) return console.log(err);
            console.log(res);
          });
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
}

//Generate HTML from github response, and pass in color for pdf styling
function generateHTML(user, color) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
        <title>Profile</title>
        <style>
            .red {
                background-color: red !important;
            }
    
            .blue {
                background-color: blue !important;
            }
    
            .green {
                background-color: green !important;
            }
    
            .orange {
                background-color: orange !important;
            }
    
            .pink {
                background-color: pink !important;
            }
        </style>
    </head>
    <body class="${color}">
        <div class="wrapper pt-4 pb-4 ${color}">
            <div class="container align-items-center text-center">
                <div class="row">
                    <div class="col sm-12">
                        <h1>${user.name}</h1>
                        <img src="${user.avatar_url}" class="rounded" alt="profile-pic">
                        <h4>bio</h4>
                    </div>
                </div>
                <div class="row align-items-center text-center mt-4 pl-3 pr-3">
                    <div class="col sm-5 border pt-3 pb-3 mr-1">
                        <h3>Public repositories ${user.public_repos}</h3>
                    </div>
                    <div class="col sm-5 border pt-3 pb-3 ml-1">
                        <h3>Followers ${user.followers}</h3>
                    </div>
                </div>
                <div class="row align-items-center text-center mt-2 pl-3 pr-3">
                    <div class="col sm-5 border pt-3 pb-3 mr-1">
                        <h3>Following ${user.following}</h3>
                    </div>
                    <div class="col sm-5 border pt-3 pb-3 ml-1">
                        <h3>Gists ${user.public_gists}</h3>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`
}

prompt();