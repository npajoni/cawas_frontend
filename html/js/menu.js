$( document ).ready(function() {
        console.log( "ready!" );
       
    // simular exit con el botó de salir
    $("#exitBtn").click(function(){
           window.location.href = "index.html?logstatus=OFF";
       })
    
    // navega desde el selector de conenidos al value+".html" de cada option
    $( "#content-select" ).change(function() {
        var clickedVal;
        $( "#content-select option:selected" ).each(function() {
          clickedVal= $(this).val();
            if(clickedVal!="")
            {
                console.log( "clickedVal="+clickedVal );
                 window.location.href = clickedVal+".html";
            }
        });
        
    });
    
    // inicializar tooltips para los íconos de HELP
    $('[data-toggle="tooltip"]').tooltip(); 
});