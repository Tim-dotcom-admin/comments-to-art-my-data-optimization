# Comments-To-Art data optimization
***
Here is my implementation of optimizing the loading of data from your server.

Note: To use the commands in a special environment(not Windows) use **Google**.

## Table of Contents
1. [General Info](#general-info)
2. [Installation](#installation)
3. [Quick start](#quickstart)
4. [Using on client](#usingonclient)
5. [Collaboration](#collaboration)

## General Info
***
This is a project to optimize the data on https://commentstoart.com/days/instagram/instagram_comments_edited.json to load it quickly on the client. 

## Installation
***
1. First you need to install Node.js(LTS) and GIT from the official sites. 
2. Then create a folder and open it in the terminal.
3. Use this command in the terminal(if there are any errors, Google it):
```
$ git clone https://example.com/
```
4. To install Node files, use the command:
```
$ npm install
```

## Quick start
***
0. First [Installation](#installation).
1. Upload a file ```./old-data.json``` with old data (if not uploaded, it will be automatically downloaded from the site) **(optional)**.
2. Use this command:
```
$ npm start
```
3. Automatically created dir ```./public-result```, where ```./public-result/index.json``` is an array with the id of the day and the Instagram post, and sorted by day ```data[0] = first day; data[1] = second day ```.
4. Upload this dir(```./public-result```) to your project.
5. [Using on client](#usingonclient).

## Using on client
***
1. Here is an example of a client-side use case:
```
async function start() {
    let files = await (await fetch("/public-result/index.json")).json().reverse();
    for (const file of files) {
        let data = await (await fetch(`/public-result/${file}.json`)).json();
        await yourRenderFunction(data);
    }
}

start();
```
2. This is only a recommendation, it can be optimized even better, but for that I need to know the client side work.

## Collaboration
***
If you need help, text me.