var ticket;
var ticketId;
var usuarioId;
$(document).ready(function(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    ticketId=urlParams.get('id');
    usuarioId=urlParams.get('usuarioId');
    if(ticketId==0){
        document.getElementById("tittlePage").textContent="Crear ticket";
        document.getElementById("actualizarTicket").remove();
        getTicket(ticketId);
        document.getElementById("guardarTicket").addEventListener('click',function(e){
            crearTicket();
        });
    }else{
        document.getElementById("tittlePage").textContent="Editar ticket";
        getTicket(ticketId);
        document.getElementById("guardarTicket").addEventListener('click',function(e){
            editarTicket(ticketId);
        });
        document.getElementById("actualizarTicket").addEventListener('click',function(e){
            getTicket(ticketId);
        });
    }
});

function editarTicket(ticketId){
    $('#info').empty();
    let id=ticketId
    let nombre=$('#tNombre').val();
    let estado=$('#tEstado :selected').val();
    let responsable=$('#tResponsable :selected').val();
    let categoria=$('#tCategoria :selected').val();
    let prioridad=$('#tPrioridad :selected').val();
    let version=ticket.Version
    let url = 'http://localhost/TicketsService/wsTickes.asmx/updateTicket';
    if(validarDatos(nombre,estado,responsable,categoria,prioridad)){
    $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify({
                id: id,
                nombre:nombre,
                estado:estado,
                responsable:responsable,
                categoria:categoria,
                prioridad:prioridad,
                version:version,
                usuarioId:usuarioId
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function(data){
                if(data.d!=null){
                    $('#info').append('<div class="alert alert-success" role="alert">Ticket modificado con exito!</div>');
                    ticket=data.d;
                }else{
                    $('#info').append('<div class="alert alert-danger" role="alert"><strong>Error: </strong> este ticket es invalido, actualice el ticket.</div>');
                }
            },
            error: function(xhr){
                console.log(xhr)
            }
        });
    }
}

function getTicket(idTicket){
        $('#info').empty();
        let url = 'http://localhost/TicketsService/wsTickes.asmx/getTicket';
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify({
                id: idTicket
            }),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function(data){
                ticket=data.d
                if(idTicket!=0){
                    document.getElementById('tNombre').value=ticket.Nombre
                }
                cargarDatos()
            },
            error: function(xhr){
                console.log(xhr)
            }
        });
}

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
                estado: estado,
                responsable: responsable,
                categoria: categoria,
                prioridad: prioridad,
                version: 0,
                usuarioId: usuarioId
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
            $('#tEstado').empty();
            if(ticketId==0)$('#tEstado').append('<option value="'+0+'">Seleccionar...</option>')
            data.d.forEach(it => {
                if(ticketId==0){
                    $('#tEstado').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
                }else if(it.Nombre==ticket.Estado){
                    $('#tEstado').append('<option selected value="'+it.Id+'">'+it.Nombre+'</option>')
                }else{
                    $('#tEstado').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
                }
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
            $('#tResponsable').empty();
            if(ticketId==0)$('#tResponsable').append('<option value="'+0+'">Seleccionar...</option>')
            data.d.forEach(it => {
                if(ticketId==0){
                    $('#tResponsable').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
                }else if(it.Nombre==ticket.Responsable){
                    $('#tResponsable').append('<option selected value="'+it.Id+'">'+it.Nombre+'</option>')
                }else{
                    $('#tResponsable').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
                }
                
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
            $('#tCategoria').empty();
            if(ticketId==0)$('#tCategoria').append('<option value="'+0+'">Seleccionar...</option>')
            data.d.forEach(it => {
                if(ticketId==0){
                    $('#tCategoria').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
                }else if(it.Nombre==ticket.Categoria){
                    $('#tCategoria').append('<option selected value="'+it.Id+'">'+it.Nombre+'</option>')
                }else{
                    $('#tCategoria').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
                }
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
            $('#tPrioridad').empty();
            if(ticketId==0)$('#tPrioridad').append('<option value="'+0+'">Seleccionar...</option>')
            data.d.forEach(it => {
                if(ticketId==0){
                    $('#tPrioridad').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
                }else if(it.Nombre==ticket.Prioridad){
                    $('#tPrioridad').append('<option selected value="'+it.Id+'">'+it.Nombre+'</option>')
                }else{
                    $('#tPrioridad').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
                }
            });
        },
        error: function(xhr){
            console.log("Error cargando prioridades")
        }
    });
}