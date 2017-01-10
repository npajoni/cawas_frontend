$( document ).ready(function() {
        console.log( "ready!" );
       
    // simular exit con el botó de salir
    $("#exitBtn").click(function(){
           window.location.href = "index.html?logstatus=OFF";
       })
    
    // navega desde el selector de conenidos al value+".html" de cada option
    $( "#movie-select" ).change(function() {
        var clickedVal;
        $( "#movie-select option:selected" ).each(function() {
          clickedVal= $(this).val();
            if(clickedVal!="")
            {
                console.log( "clickedVal="+clickedVal );
                $( "#movieID" ).val(clickedVal);
            }
        });
        
    });
    
    // inicializar tooltips para los íconos de HELP
    $('[data-toggle="tooltip"]').tooltip(); 
});