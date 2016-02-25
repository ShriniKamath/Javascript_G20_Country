/*

My Custom JS
============

Author:  Shrinivas Kamath
Updated: Feb 2016

*/
var fs = require('fs');
continentMap=[];
fs.readFile("../continent.csv","utf-8",function (error, data) {
  var rows=data.split('\r\n');
  for (var i = 1; i < rows.length-2; i++) {
    var coloum=rows[i].split(',');
    continentMap[coloum[0]]=coloum[1];
  }
});
fs.readFile("../input.csv","utf-8",function (error, data) {
  var rows=data.split('\r\n');
  var colo=new Array();
  var heading=new Array();
  heading=rows[0].split(',');
  var jsonObj = [];
  var filterMap=new Map;
  filterMap['Country Name']='key';
  filterMap['Population (Millions) - 2013']='value1';
  filterMap['GDP Billions (US$) - 2013']='value2';
  filterMap['Purchasing Power in Billions ( Current International Dollar) - 2013']='value3';
  for (var i = 1; i < rows.length-1; i++) {
    colo=rows[i].split(',');
    var item = {},subitem={};
    for (var k = 0; k < colo.length; k++) {
      if(heading[k] in filterMap){
        if(heading[k] != colo[k] ){
          subitem[filterMap[heading[k]]] = colo[k];
        }
      }
    }
    if(colo[0]!='European Union' && colo[0]!='World'){
      jsonObj.push(subitem);
    }
  }
  fs.writeFile('../json/output.json',JSON.stringify(jsonObj),  function(err) {
    if (err) {
      return console.error(err);
    }else {
      return console.error("SuccessFully Written File.");
    }
  });


  // This code is for filtering data and writing in inc_popul_purchpow.json
  var rows=data.split('\r\n');
  var colo=new Array();
  var heading=new Array();
  heading=rows[0].split(',');
  var jsonObj = [];

  for(var i=0;i<rows.length-1;i++){
    if(i!=0){
      var obj = {};
      var colo=rows[i].split(',');
      obj["key"]=colo[heading.indexOf("Country Name")];
      obj["value1"]=parseFloat((((colo[heading.indexOf("Population (Millions) - 2013")]-colo[heading.indexOf("Population (Millions) - 2010")])/colo[heading.indexOf("Population (Millions) - 2010")])*100).toFixed(2));
      obj["value2"]=parseFloat((((colo[heading.indexOf("Purchasing Power in Billions ( Current International Dollar) - 2013")]-colo[heading.indexOf("Purchasing Power in Billions ( Current International Dollar) - 2010")])/colo[heading.indexOf("Purchasing Power in Billions ( Current International Dollar) - 2010")])*100).toFixed(2));
      jsonObj.push(obj);
    }
  }
  console.log(jsonObj);
  fs.writeFile('../json/inc_popul_purchpow.json',JSON.stringify(jsonObj),  function(err) {
    if (err) {
      return console.error(err);
    }else {
      return console.error("SuccessFully Written File.");
    }
  });
  // This code is for filtering data and writing in agg_country_continent.json
  var rows=data.split('\r\n');
  var colo=new Array();
  var heading=new Array();
  heading=rows[0].split(',');
  var filterMap=new Map;
  filterMap['Country Name']='key';
  filterMap['Population (Millions) - 2010']='population';
  filterMap['Population (Millions) - 2011']='population';
  filterMap['Population (Millions) - 2012']='population';
  filterMap['Population (Millions) - 2013']='population';
  filterMap['GDP Billions (US$) - 2010']='gdp';
  filterMap['GDP Billions (US$) - 2011']='gdp';
  filterMap['GDP Billions (US$) - 2012']='gdp';
  filterMap['GDP Billions (US$) - 2013']='gdp';

  var pop_total=0,gdp_total=0;
  var tempMap=[];
  for (var i = 1; i < rows.length-2; i++) {
    colo=rows[i].split(',');
    var item = {};
    for (var k = 1; k < colo.length; k++) {
      if(continentMap[colo[0]] in tempMap){
        var contName={};
        contName=tempMap[continentMap[colo[0]]];
        if(heading[k] in filterMap){
          contName["key"]=continentMap[colo[0]];
          if(filterMap[heading[k]]=="population"){
            contName["pop_total"]=parseFloat(contName["pop_total"])+parseFloat(colo[k]);
            contName["popcount"]=parseInt(contName["popcount"])+1;
          }
          if(filterMap[heading[k]]=="gdp"){
            contName["gdp_total"]=parseFloat(contName["gdp_total"])+parseFloat(colo[k]);
            contName["gdpcount"]=parseInt(contName["gdpcount"])+1;
          }
        }
        tempMap[continentMap[colo[0]]]=contName;//check
      }else{
        var contName={};
        contName["pop_total"]=parseFloat(colo[k]);
        contName["popcount"]=0;
        contName["gdp_total"]=parseFloat(colo[k]);
        contName["gdpcount"]=0;
        tempMap[continentMap[colo[0]]]=contName;
      }
    }
  }
  var result=[];
  var keystemp=Object.keys(tempMap);
  for (var i = 0; i < keystemp.length; i++) {
    //console.log(keystemp[i]);
    tempMap[keystemp[i]].pop_total=(tempMap[keystemp[i]].pop_total.toFixed(2)/tempMap[keystemp[i]].popcount).toFixed(2);
    tempMap[keystemp[i]].gdp_total=(tempMap[keystemp[i]].gdp_total.toFixed(2)/tempMap[keystemp[i]].gdpcount).toFixed(2);
    result.push(tempMap[keystemp[i]]);
  }

  fs.writeFile('../json/agg_country_continent.json',JSON.stringify(result),  function(err) {
    if (err) {
      return console.error(err);
    }else {
      return console.error("SuccessFully Written File.");
    }
  });


});
