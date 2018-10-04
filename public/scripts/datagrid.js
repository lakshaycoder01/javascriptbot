var datagrid = function(){
    this.formstr = "<table><tr><td>S#</td><td>Name</td><td>Descrption</td><td></td></tr><tr><td><input id='t1' type='text' size=2></td><td><input id='t2' type='text' size=10></td><td><input id='t3' type='text' size=15></td><td><input type='button' value='Done!' onclick='dataval();'></td></tr></table>";
}                

datagrid.prototype.loadForm = function (formstr){
    $(".inputpane").append("<div class='dummy'>"+formstr+"</div>");
}

function dataval(){
    var errmsg = '[';
    obj = eval("new JQBot();");
    if($('#t1').val().length < 3){
         errmsg += '{type: "S# should be a 3 digid number. "}]'; 
    }else{
        errmsg += '{type: "Successfully completed!"},{type: "Lets move to the next task..."}]';
        $(".inputpane").empty();
    }
    eval("obj.handleMsg("+errmsg+")");
}
