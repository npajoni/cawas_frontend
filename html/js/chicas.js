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
    $("#chica-select").select2({placeholder: "Despliega la lista"});
    
    // simular exit con el botón de salir
    $("#getOut").click(function(){
           window.location.href = "index.html?logstatus=OFF";
    })
    
    // Toma el ID de la chica seleccionada en la lista
    $( "#chica-select" ).change(function() {
        
        $( "#chica-select option:selected" ).each(function() {
          clickedName= $(this).html();
          clickedVal= $(this).val();
            if(clickedVal!="")
            {
                console.log( "clickedID="+clickedVal ); // debug
                $( "#chicaID" ).val(clickedVal);// Agrega el ID en el hidden field
                $( "#chicaNAME" ).val(clickedName);// Agrega el nombre en el campo visible
                  
            }
        });
        
    });
    
    // interacción del usuario al hacer click en el botón debajo de la lista de selección
    $( "#IDBtn" ).click(function(){ 
        $( "#chica-pickerForm" ).submit();// Envía el formulario con el id de la chica
    })
    
    // interacción del usuario al hacer click en el botón de agregar chicas
    $( "#ADBtn" ).click(function(){ 
         $( "#hidden1" ).show();
    })  
    
    // interacción del usuario al hacer click en el botón cancelar
    $( "#CancelBtn" ).click(function(){ 
         $( "#hidden1" ).hide();
    }) 
    
    
    //preview de imagenes cargadas por el front end
    $( "#ThumbHor" ).change(showPreviewImage_click);
    $( "#ThumbVer" ).change(showPreviewImage_click);
    
     
    function showPreviewImage_click(e) {
            var $input = $(this);
            var inputFiles = this.files;
            if(inputFiles == undefined || inputFiles.length == 0) return;
            var inputFile = inputFiles[0];

            var reader = new FileReader();
            reader.onload = function(event) {
                $input.parent().find('img').attr("src", event.target.result);
            };
            reader.onerror = function(event) {
                alert("ERROR: " + event.target.error.code);
            };
            reader.readAsDataURL(inputFile);
    }
    
    /*---- DATE PICKER ----*/
    $('#birthDate').dcalendarpicker({
     // default: mm/dd/yyyy

      format: 'dd-mm-yyyy'

    });

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
        var asset_Id = $('#movieID').val();
        var original_name = $('#orginalName').val();
        var category_selected = $('#category option:selected');
        var birth_date = $('#birthDate').val().trim();
        var girl_height = $('#height').val();
        var girl_weight = $('#weight').val();
        
        
        // chequea original Name
        if(original_name=="" || original_name==" ")
        {
            errorMe("#orginalName");
            checkVal++;
        }else{
            okMe("#orginalName");
        }
        // chequea thumbnail horizaontal
        if(!$('#ThumbHor').val()){
            errorMe("#ThumbHor");
            checkVal++;
        }else{
            okMe("#ThumbHor");
        }
        
        // chequea thumbnail vertical
        if(!$('#ThumbVer').val()){
            errorMe("#ThumbVer");
            checkVal++;
        }else{
            okMe("#ThumbVer");
        }
        
        // chequea birthDate
        if(birth_date=="" || birth_date==" ")
        {
            errorMe("#birthDate");
            checkVal++;
        }else{
            okMe("#birthDate");
        }
        
        // chequea girl_height
        if(girl_height=="" || girl_height==" ")
        {
            errorMe("#height");
            checkVal++;
        }else{
            okMe("#height");
        }
        
        // chequea girl_weight
        if(girl_weight=="" || girl_weight==" ")
        {
            errorMe("#weight");
            checkVal++;
        }else{
            okMe("#weight");
        }
        
        
        // chequea categoria
        console.log("#category"+$('#category').val());
        if ( $('#category').val()=="0" || $('#category').val()==0)
        {
            errorMe("#category");
            checkVal++;
        }else{
            okMe("#category");
            category_selected=$('#category').val();
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
                    /* check nacionalidad */
                    var titCont = $("#nacionalidad_"+lang).val();
                    if(titCont==""){
                        errorMe("#nacionalidad_"+lang);
                        checkVal++;
                    }else{
                        okMe("#nacionalidad_"+lang);
                    }
                    /* check desc */
                    var descCont = $("#short_desc_"+lang).val().trim();
                    if(descCont.length < 1){
                        errorMe("#short_desc_"+lang);
                        checkVal++;
                    }else{
                        okMe("#short_desc_"+lang);
                    }
                    
                }
            }
        
            function addGirlMetadata(arr){
                var lngth = arr.length;
                var myLangs = "";
                
                for(i=0; i<lngth; i++){
                    var lang=arr[i];
                    var nacion = $("#nacionalidad_"+lang).val().trim()
                    var short = $("#short_desc_"+lang).val().trim();
                    myLangs += '{"Girlmetadata":';
                    myLangs += '{"language": "'+lang+'",';
                    myLangs += '"description": "'+short+'",';
                    myLangs += '"nationality":"'+nacion+'"';
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
                    myJSON+='{"Girl":{';
                    myJSON+='"type_girl":"'+category_selected+'",';
                    myJSON+='"name":"'+original_name+'",';
                    myJSON+='"birth_date":'+birth_date+',';
                    myJSON+='"height":'+girl_height+',';
                    myJSON+='"weight":"'+girl_weight+'",';
                    myJSON+='"Girlmetadatas": [';
                    myJSON+= addGirlMetadata(langDesc);
                    myJSON+=']}}';
                    console.log(myJSON);
                    $("#varsToJSON").val(myJSON);
                    $("#girlForm").submit();
                  }  
            }
        
    }
    
});