// La anteúltima línea es la que invoca a la función para llenar el formulario.
// la variable debajo de este texto (requestedData) es el JSON que sirve de datapool.
// Los datos se envían por POST a movies.html... chequear eso!!!!

var requestedData={"Category":
	{
		"category_id":"C00039",
		"original_name":"nombre de la Categoria 22",
		"orden":2,
		"Categorymetadatas":[
							{"Categorymetadata":{
											"language": "es",
											"name": "descripcion 1 español"
											}
							}
						]
	}
}

   



// helper para populateForm(), dependiendo del tipo de tag, llena un valor en un input, un string, select o agrega texto.
    function insertIt(id,valueSent,method){
        switch(method){
                case "html":
                    $(id).html(valueSent);
                break;
                case "val":
                    $(id).val(valueSent);
                break;
                case "append":
                    $(id).append(valueSent);
                break;
                case "select":
                    //id='"'+id+' option[value='+valueSent+']"';
                    //console.log("id"+id);
                    //$(id).attr('selected','selected');
                    $(id).val(valueSent).change();
                break;
                default:
                break;
        }
        
    }

    function insertIdiomas(cant){
        var checkIdvar;
        for(i=0; i<cant; i++){
            var lang=requestedData.Category.Categorymetadatas[i].Categorymetadata.language;
                
            $("#"+lang).prop('checked', true);
            $("#"+lang).change();
            $("#Module_"+lang).show();
            $("#nombre_"+lang).val(requestedData.Category.Categorymetadatas[i].Categorymetadata.name);
           
            //langQ++
            /*$("#date_"+lang).val(makeToday());*/
        }
        
        
    }

    function searchList(theList,val){
        //console.log("estoy buscando esto:"+val+" en:"+theList);
        var theAnswer;
        $(theList).find('li').each(function(){
         //console.log("ahora estoy en:"+$(this).val()+" y busco:"+val)  
            if($(this).val()==val){
                theAnswer=$(this).html();
                console.log("and the winner is:"+theAnswer);
                $(this).remove();//quita de la lista original el valor que viene el JSON
            }
        });
        return(theAnswer);
    }

    function makelist(iddrop,idpick,valuesOf,theObject){
        
        var myArrayOfValues = valuesOf;
        var ArrLngth = myArrayOfValues.length;        
        var htmlContent = "";
        for(i=0; i<ArrLngth; i++){
            if(theObject==".girl_id"){
             var theRealValue = myArrayOfValues[i].girl_id;
            }
            if(theObject==".category_id"){
             var theRealValue = myArrayOfValues[i].category_id;
            }
            console.log("theRealValue"+theRealValue);
            var listVal = searchList(idpick,theRealValue);
            console.log("listVal after function is"+listVal);
            htmlContent+= "<li value='"+theRealValue+"'>"+listVal+"</li>"
        }
        $(iddrop).html(htmlContent);
    }

 
    
    // rellena el formulario con los datos recogidos en la variable requestedData
    function populateForm(){
        
        var qIdiomas = requestedData.Category.Categorymetadatas.length;
        
        //id
        insertIt("#idTit", requestedData.Category.asset_id, "append");
        //name
        insertIt("#orginalName", requestedData.Category.original_name, "val");
        //orden
        insertIt("#order", requestedData.Category.orden, "val");
                        
        //idiomas
        insertIdiomas(qIdiomas)
        //console.log("qIdiomas:"+qIdiomas);
        
    }



$( document ).ready(function() {
    
    console.log( "ready!" );
    // inicializar tooltips para los íconos de HELP
    $('[data-toggle="tooltip"]').tooltip(); 
    
    var checkedOnce = 0; //chequea si el formulario se ha intentado enviar alguna vez
    var checkVal=0; //chequea la cantidad de errores en el formulario
    var clickedToSubmit = 0; //chequea si el botón de submit se ha presionado
    var checkText="";
    var display_runtimeJSON; //necesaria para armar el valor final que debe ir en el JSON
    var langQ = 0; //Cuenta la cantidad de idiomas elegidos por el usuario
    var langDesc = [] // recoge qué idiomas son los que se seleccionaron
    var clickedVal; // recoge el valor del ID seleccionado en la lista de chcas;
    var clickedName; // recoge el valor del Nombre seleccionado en la lista de chcas;
    
    // activar los selects con filtro
    $("#categoria-select").select2({placeholder: "Despliega la lista"});
    
    // simular exit con el botón de salir
    $("#getOut").click(function(){
           window.location.href = "index.html?logstatus=OFF";
    })
    
    
    
    // interacción del usuario al hacer click en el botón debajo de la lista de selección
    $( "#IDBtn" ).click(function(){ 
        $( "#categoria-pickerForm" ).submit();// Envía el formulario con el id de la chica
    })
    
    
    
    // interacción del usuario al hacer click en el botón cancelar
    $( "#CancelBtn" ).click(function(){ 
         window.location.href = "categorias.html";
    }) 
    
    
    
    
   
    // checkbox idiomas detecta lo que se chequea y muestra el módulo de idioma
    $("input[type=checkbox]").on('change', function () {
        var self = $(this);
        var showDiv = "#Module_"+self.attr("id");
        if (self.is(":checked")) {
            console.log("checkbox  id =" + self.attr("id") + "is checked ");
            $(showDiv).show('slow');
            langQ++;
            langDesc.push(self.attr("id"));
            
        } else {
            console.log("Id = " + self.attr("id") + "is Unchecked ");
            $(showDiv).hide('fast');
            langQ--;
            langDesc.pop();
        }
        console.log("idiomas tildados:"+langQ+", y son:"+langDesc);// cantidad de idiomas
        if(checkedOnce>0){
            checkAll();
        }
    });
    
    
    /* triggers for checkALL function */
    $("#sendBut").click(function(){
        clickedToSubmit=1;
        checkAll();
    })
    
    $("body").mouseup(function(){
        if(checkedOnce>0 && checkVal>0 ){
            clickedToSubmit=0;
            checkAll();      
        }
    })
    
    
    function checkAll(){
        // this function checks for all form values and makes json string to post or alerts user to complete fields.
        console.log("checking form...");
        checkVal = 0;
        var asset_Id = $('#newID').val();
        var original_name = $('#orginalName').val();
        var orden = $('#order').val().trim();
       
        
        
        // chequea original Name
        if(original_name=="" || original_name==" ")
        {
            errorMe("#orginalName");
            checkVal++;
        }else{
            okMe("#orginalName");
        }
        
        
        // chequea orden
        if(orden=="" || orden==" ")
        {
            errorMe("#order");
            checkVal++;
        }else{
            okMe("#order");
        }
        
                
        // chequeo de idiomas (tit_; desc_; date_)
        if(langQ==0){
            errorMe("#pickLang");
            checkVal++;
        }else{
            okMe("#pickLang");
            checkLangs(langDesc);
        }
                
        /* -----------  Sending Routine -----------*/
        
        if(checkVal>0){
            if(checkedOnce<1){// envía por primera vez y tiene error
                $("#myModal2").modal();
            }
            console.log("checkVal:"+checkVal);
        }else{
            if(checkedOnce<1){// envía por primera vez y NO tiene error
                submitJson();
            }else{// se ha verificado más de una vez y ahora no tiene error
                if(clickedToSubmit==1)// sólo se envía si se ha oprimido el botón de submit;
                    {
                        submitJson();
                    }
            }
        }
        
        checkedOnce++;
        
                
        
        
        // helper subfunctions
        
        
            function errorMe(theField){
                if ($(theField).parent().hasClass('has-success')){
                    $(theField).parent().removeClass('has-success');
                }
                
                if($(theField).next(".glyphicon").hasClass('glyphicon-ok')){
                    $(theField).next(".glyphicon").removeClass('glyphicon-ok');
                }
                $(theField).parent().addClass('has-error');
                $(theField).next(".glyphicon").addClass('glyphicon-remove');
                if(theField=="#canalSelect"){
                    console.log("canalSelect selected");
                    $("#channelSelect").children(".select2-selection--single").css("display","none");
                        //.css("border","1px #ff0000 solid!important");
                }
                
            }
        
            function okMe(theField){
                if ($(theField).parent().hasClass('has-error')){
                    $(theField).parent().removeClass('has-error');
                }
                
                if($(theField).next(".glyphicon").hasClass('glyphicon-remove')){
                    $(theField).next(".glyphicon").removeClass('glyphicon-remove');
                }
                $(theField).parent().addClass("has-success");
                $(theField).next(".glyphicon").addClass("glyphicon-ok");
                
            }
        
            function explodeArray(arr, indexname){
                var lngth = arr.length;
                var stringIt = '[';
                for(i=0; i<lngth; i++){
                    stringIt +='{"'+indexname+'":"'+arr[i]+'"}';
                    if(i<lngth-1){
                        stringIt += ',';
                    }
                }
                stringIt += ']';
                return(stringIt);
            }
        
            function checkLangs(arr){ // itera sobre los lenguajes seleccionados buscando errores
                var lngth = arr.length;
                for(i=0; i<lngth; i++){
                    var lang=arr[i];
                    /* check nombre */
                    var titCont = $("#nombre_"+lang).val();
                    if(titCont==""){
                        errorMe("#nombre_"+lang);
                        checkVal++;
                    }else{
                        okMe("#nombre_"+lang);
                    }
                    
                    
                }
            }
        
            function addCatMetadata(arr){
                var lngth = arr.length;
                var myLangs = "";
                
                for(i=0; i<lngth; i++){
                    var lang=arr[i];
                    var nombre = $("#nombre_"+lang).val().trim()
                    myLangs += '{"Categorymetadata":';
                    myLangs += '{"language": "'+lang+'",';
                    myLangs += '"name": "'+nombre+'"';
                    myLangs += '}}';
                    if(i<lngth-1){
                        myLangs += ',';
                    }
                }
                return(myLangs);
            };
        
        
            function submitJson(){
                if(checkVal==0){
                    
                    var myJSON = '';
                    myJSON+='{"Category":{';
                    myJSON+='"category_id":"'+asset_Id+'",';
                    myJSON+='"original_name":"'+original_name+'",';
                    myJSON+='"orden":'+orden+',';
                    myJSON+='"Categorymetadatas": [';
                    myJSON+= addCatMetadata(langDesc);
                    myJSON+=']}}';
                    console.log(myJSON);
                    $("#varsToJSON").val(myJSON);
                    $("#categoriaForm").submit();
                  }  
            }
        
    }
    populateForm();
});