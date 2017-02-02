$( document ).ready(function() {
    
    console.log( "ready!" );
    
        
    // simular exit con el botó de salir
    $("#getOut").click(function(){
           window.location.href = "index.html?logstatus=OFF";
    })
    
        
    // interacción del usuario al hacer click en el botónde cancelar
    $( "#CancelBtn" ).click(function(){ 
        window.location.href = "chicas.html";
    })
    
     // checkbox idiomas detecta lo que se chequea y muestra el módulo de idioma
    $("input[type=checkbox]").on('change', function () {
        var self = $(this);
        var showDiv = "#Module_"+self.attr("id");
        if (self.is(":checked")) {
            console.log("checkbox  id =" + self.attr("id") + "is checked ");
            $(showDiv).show('slow');
        } else {
            console.log("Id = " + self.attr("id") + "is Unchecked ");
            $(showDiv).hide('fast');
        }
        
    });   
});