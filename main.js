var prompt = require('prompt-sync');
const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs');
const { readFileSync, chmod } = require('fs');
const Pdfmake = require('pdfmake');
var colors = require('colors/safe');

const file = 'Roboto-Regular.ttf';
var input = prompt();
let terms = new Array();
let defs = new Array();
let all = new Array();

var fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf'
    }
};

let pdfmake = new Pdfmake(fonts);

console.log(colors.blue("Checking font files..."));




if(fs.existsSync(file)){
    console.log(colors.green('Font files found... '));
    secondRunner();
}
else{
    require('readline')
    .createInterface(process.stdin, process.stdout)
    .question(colors.red("Error downloading files press [Enter] to exit... "), function(){
        process.exit();
    });  
}
async function secondRunner(){
    var number = input(colors.cyan('Press 1 to start '))
    if(number == 1){
        main();
    }
    else{
        require('readline')
        .createInterface(process.stdin, process.stdout)
        .question(colors.red("Press [Enter] to exit... "), function(){
            process.exit();
        });
    }
}
async function main(){
    var link = input(colors.cyan('Enter quizlet link '));
    function getAll(callback){
        fs.createWriteStream('terms.pdf');
        axios.get(link)
            .then(res => {
                var tempTerm = new Array();
                var tempDef = new Array();
                let $ = cheerio.load(res.data)
                $('.SetPageTerm-contentWrapper').each((index, element) => {
                    tempTerm.push($(element).find('.SetPageTerm-wordText').text().replace(/\s\s+/g, ''));
                    tempDef.push($(element).find('.SetPageTerm-definitionText').text().replace(/\s\s+/g, ''));
                });
                callback(tempTerm, tempDef);
            }).catch(err => console.error(err))
        }


    getAll(function(result, result2){
        terms = result
        defs = result2
        var i = 0;
        while(i < terms.length){
            console.log(colors.cyan(`Fetching... ${terms[i]}`));
            all.push(terms[i]);
            all.push(defs[i]);
            all.push(' ');
            i = i + 1;
        }
        let mainDoc = {
            content: [
                all
            ],
            defaultStyle: {
                fontSize: 1
            }
        }
        var p;
        function filer(callback){
            p = 0;
            console.log(colors.green("Done"))
            let pdfDoc = pdfmake.createPdfKitDocument(mainDoc, {});
            pdfDoc.pipe(fs.createWriteStream('terms.pdf'));
            pdfDoc.end();
            p = 1;
            callback(p)
        }
        filer(function(res){
            if(p == 1){
                require('readline')
                .createInterface(process.stdin, process.stdout)
                .question(colors.red("Press [Enter] to exit... "), function(){
                    process.exit();
                });
            }else{
                
            }
        })
    })
}

