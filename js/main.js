
function parseCSS(string){
    var screenSize = document.getElementById('screenSize').value;
    var allowedProperties = ['font-size', 'top', 'bottom', 'right', 'left', 'height', 'width', 'margin', 'padding', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right'];
    var disallowedUnits = ['em', '%', 'vh', 'ch', 'ex', 'vw'];
    var blacklist = [];
    if(!document.getElementById('includeMargin').checked)  blacklist=blacklist.concat(['margin', 'margin-top','margin-bottom','margin-left','margin-right']);
    if(!document.getElementById('includePadding').checked) blacklist=blacklist.concat(['padding', 'padding-top','padding-bottom','padding-left','padding-right']);
    for(var i=0; i< blacklist.length; i++){
        var index = allowedProperties.indexOf(blacklist[i]);
        if(index != -1) allowedProperties.splice(index, 1);
    }
    var ratios =[];
    var propertyArray = [];
    var valueArray = [];
    var babyArray = [];
    var myString = '';

    for(var i=0; i<string.length; i++){
        var current = string.charAt(i);
        if(current=='{'){
            propertyArray.push(myString);
            myString = '';
        } 
        else if(current== '}'){
            if(valueArray.length>0){
                propertyArray.push(valueArray);
                ratios.push(propertyArray);
            }
            propertyArray = [];
            valueArray = [];
            myString = '';
        }
        else if(current==':'){
            babyArray.push(myString);
            myString = '';
        }
        else if(current==';'){

            if(onTheList(babyArray[0], allowedProperties, true) && !onTheList(myString, disallowedUnits, false) && !isShorthand(myString) ){
                myString = myString.replace('px', '').trim();
                myString = parseInt(myString)/screenSize;
                babyArray.push(myString);
                valueArray.push(babyArray);
            }
            babyArray = [];
            myString = '';
        }
        else{
            myString = myString.concat(current).trim();
        }
    }
    return ratios;
}

function output(){
    theArray = parseCSS(document.getElementById('CSStext').value);
    container = document.getElementById('result');
    var string = 'var ratios = {\n';
    for(var i=0; i<theArray.length; i++){
        string+='\t';
        var selector = theArray[i][0];
        string+='"'+selector+'": {';
        for(var j=0; j<theArray[i][1].length; j++){
            var theStuff = theArray[i][1][j];
            var property = theStuff[0];
            var value = theStuff[1];
            string+='\n\t\t"'+property+'": '+value;
            if(j!=theArray[i][1].length-1) string+=',';
        }
        if(i==theArray.length-1) string+='\n\t}\n';
        else string+='\n\t},\n';
    }
    string+='}';
    container.value=(string);
}

function isShorthand(string){
    count = 0;
    string = string.replace(/px/g, 'Z');
    for(var i=0; i<string.length; i++){
        if(string.charAt(i)=='Z') count++;
        if(count>1) return true;
        if(string.substr(i, i+2)=='Z0') return true;
    }
    return false;
}

function onTheList(string, list, specific){
    for(var i=0; i<list.length; i++){
        if(specific){
            if(list[i] == string) return true;
        } else{
            if(string.search(list[i]) != -1) return true;
        }
    }
    return false;
}

function currentSize(){
    document.getElementById('screenSize').value = window.innerWidth;
}