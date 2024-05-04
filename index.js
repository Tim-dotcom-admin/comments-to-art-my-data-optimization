require('dotenv').config();

const axios = require('axios');
const fs = require('fs');
const fsPromises = require('fs').promises;

const OldDataPath = process.env.OLD_DATA_PATH;

const optimizeCommentsToArt = async () => {
    
    if (!fs.existsSync(OldDataPath)) {
        // download your pixels data from your website
        try {
            let r = await (await axios.get(`https://commentstoart.com/days/instagram/instagram_comments_edited.json`)).data;
            await fsPromises.writeFile(OldDataPath, JSON.stringify(r, null, 2));
            console.log("website data has downloaded");
        } catch (error) {
            console.error(error);
            return;
        }
    }

    let days = [];

    let dataForOptimization = JSON.parse(await fsPromises.readFile(OldDataPath));
    if (!Object.keys(dataForOptimization).length) {
        console.log(`${OldDataPath} is empty`);
        return;
    }

    Object.keys(dataForOptimization).forEach(postId => {
        days.push({
            id: postId,
            time: dataForOptimization[postId].postDate,
        })
    });
    days = days.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()).map(obj => obj.id);

    dataForOptimization = Object.keys(dataForOptimization).reduce((acc, cur) => [...acc, ...dataForOptimization[cur].comments.map(comment => ({ ...comment, day: days.indexOf(cur) + 1 }))], []);
    dataForOptimization = dataForOptimization.filter(comment => comment.color);
    dataForOptimization = dataForOptimization.map(comment => {

        comment.postId = comment.postId.replace("https://www.instagram.com/reel/", "").replace("/", "");
        comment.colorsSelect = [
            {
                from: comment.colorMatchIndex,
                to: comment.colorMatchIndex + comment.colorMatchLength,
            }
        ];
        comment.positionsSelect = [
            {
                from: 0,
                to: 0,
            }
        ];

        delete comment.likes;
        delete comment.position;
        delete comment.random;
        delete comment.firstOnPosition;
        delete comment.firstOnPositions;
        delete comment.colorMatchIndex;
        delete comment.colorMatchLength;

        return comment
    })

    days = days.map(url => url.replace("https://www.instagram.com/reel/", "").replace("/", ""))

    if (fs.existsSync("./public-result")) {
        let targetDir = './public-result';
        console.log(`start deleting files(in ./public-result)`);
        await deleteFiles(targetDir);
        console.log("'./public-result' has been cleared");
    } else {
        console.log(`'./public-result' creation start`);
        await fsPromises.mkdir("./public-result");
        console.log("'./public-result' has been created");
    }

    await fsPromises.writeFile("./public-result/index.json", JSON.stringify(days, null, 2));
    console.log(`'./public-result/index.json' has been created`);

    dataForOptimization = dataForOptimization.reduce((acc, cur) => {
        let id = cur.postId;
        delete cur.postId;

        if (acc[id]) {
            acc[id].push(cur);
        } else {
            acc[id] = [cur];
        }

        return acc;
    }, {});
    
    console.log(`data has been optimized`);

    console.log(`file creation start`);
    for (const fileName of Object.keys(dataForOptimization)) {
        await fsPromises.writeFile(`./public-result/${fileName}.json`, JSON.stringify(dataForOptimization[fileName], null, 2));
        console.log(`'./public-result/${fileName}.json' has been created`);
    }

    console.log(`finish! visit "./public-result"`);
}
async function deleteFiles(targetDir) {
    try {
        const files = await fsPromises.readdir(targetDir);
        for (const fileName of files) {
            // const filePath = path.join(targetDir, fileName);
            const filePath = `${targetDir}/${fileName}`;
            const stats = await fsPromises.stat(filePath);
            if (stats.isFile()) {
                await fsPromises.unlink(filePath);
                console.log(`File ${fileName} successfully deleted.`);
            }
        }
    } catch (err) {
        console.error(`Error during file deletion: ${err}`);
    }
}

optimizeCommentsToArt();

// async function start() {
//     let files = await (await fetch("/public-result/index.json")).json;
// }

// start()