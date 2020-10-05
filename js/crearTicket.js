$(document).ready(function(){
    cargarDatos();
    document.getElementById("guardarTicket").addEventListener('click',function(e){
        crearTicket();
    });
});

var url="http://localhost/TicketsService/wsTickes.asmx/"
function cargarDatos(){
    cargarEstados();
    cargarResponsables();
    cargarPrioridades();
    cargarCategorias();
}
function validarDatos(nombre,estado,responsable,categoria,prioridad){
    var validos=true
    if(nombre==''){
        validos=false
        document.getElementById('ayudatNombre').textContent='* necesario!';
    }else{
        document.getElementById('ayudatNombre').textContent='*';
    }
    if(estado==0){
        validos=false
        document.getElementById('ayudatEstado').textContent='* necesario!';
    }else{
        document.getElementById('ayudatEstado').textContent='*';
    }
    if(responsable==0){
        validos=false
        document.getElementById('ayudatResponsable').textContent='* necesario!';
    }else{
        document.getElementById('ayudatResponsable').textContent='*';
    }
    if(categoria==0){
        validos=false
        document.getElementById('ayudatCategoria').textContent='* necesario!';
    }else{
        document.getElementById('ayudatCategoria').textContent='*'
    }
    if(prioridad==0){
        validos=false
        document.getElementById('ayudatPrioridad').textContent='* necesario!';
    }else{
        document.getElementById('ayudatPrioridad').textContent='*';
    }
    return validos
}
function crearTicket(){
    let nombre=$('#tNombre').val();
    let estado=$('#tEstado :selected').val();
    let responsable=$('#tResponsable :selected').val();
    let categoria=$('#tCategoria :selected').val();
    let prioridad=$('#tPrioridad :selected').val();
    if(validarDatos(nombre,estado,responsable,categoria,prioridad)){
        let url = 'http://localhost/TicketsService/wsTickes.asmx/updateTicket';
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify({
                id: 0,
                nombre: nombre,
                estado:estado,
                responsable:responsable,
                categoria:categoria,
                prioridad:prioridad,
                version:0
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function(data){
                console.log("exito")
            },
            error: function(xhr){
                console.log(xhr)
            }
        });
    }
}
function cargarEstados(){
    let url = 'http://localhost/TicketsService/wsTickes.asmx/getEstadosList';
    $.ajax({
        url: url,
        type: 'POST',
        data:null,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function(data){
            data.d.forEach(it => {
                $('#tEstado').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
            });
        },
        error: function(xhr){
            console.log("Error cargando estados")
        }
    });
}
function cargarResponsables(){
    let url = 'http://localhost/TicketsService/wsTickes.asmx/getResponsablesList';
    $.ajax({
        url: url,
        type: 'POST',
        data:null,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function(data){
            data.d.forEach(it => {
                $('#tResponsable').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
            });
        },
        error: function(xhr){
            console.log("Error cargando responsables")
        }
    });
}
function cargarCategorias(){
    let url = 'http://localhost/TicketsService/wsTickes.asmx/getCategoriasList';
    $.ajax({
        url: url,
        type: 'POST',
        data:null,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function(data){
            data.d.forEach(it => {
                $('#tCategoria').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
            });
        },
        error: function(xhr){
            console.log("Error cargando categorias")
        }
    });
}
function cargarPrioridades(){
    let url = 'http://localhost/TicketsService/wsTickes.asmx/getPrioridadesList';
    $.ajax({
        url: url,
        type: 'POST',
        data:null,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function(data){
            data.d.forEach(it => {
                $('#tPrioridad').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
            });
        },
        error: function(xhr){
            console.log("Error cargando prioridades")
        }
    });
}