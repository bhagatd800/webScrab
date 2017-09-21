var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var a=0;
var date;
/* GET home page. */
router.get('/', function(req, res, next) {

  const options = {
    method: 'GET',
    uri: 'http://www.odeonstar.com.au/session-times/',
    headers: { 'User-Agent': 'test' },
    json: true
  }
  
  var datas=[];
    request(options,function(err, response, html){
      //console.log(html);
      if(!err){
        var $ = cheerio.load(html)
        $('.movie-content-column').filter(function(){
          var data = $(this);
          var movieName=data.children('.movie-title').text();
          var table=data.children('.movie-sessions').html();
          var tables=cheerio.load(table);
          tables('.show-on-desktop').filter(function(){
            var newData=$(this).html();
            var newDatas=cheerio.load('<table>'+newData+'</table>');
            newDatas('tr').each(function(){
              var rowData=$(this).html();
              a=1;
              var rowDatas=cheerio.load('<table>'+rowData+'</tables>');
              rowDatas('td').each(function(){
                if(a==1){
                  date=$(this).text();
                  a=0;
                }
                else if(a==0){
                var colData=$(this).text();
                datas.push({'movieName':movieName,
                            'date':date,
                            'time':colData
                            })
                          }
              })
            })
          })

              
        });
        res.json(datas);
      }
    });
});

module.exports = router;



