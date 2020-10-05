var ticket;
var ticketId;
var usuarioId;
$(document).ready(function(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    ticketId=urlParams.get('id');
    usuarioId=urlParams.get('usuarioId');
    getTicket(ticketId);
    document.getElementById("actualizarTicket").addEventListener('click',function(e){
        getTicket(ticketId);
    });
    document.getElementById("editarTicket").addEventListener('click',function(e){
        navigateTicket(ticketId);
    });
});

function navigateTicket(id){
    window.location.assign("./ticket.html?id="+id+"&usuarioId=1");
}

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
                ticket=data.d;
                $('#tId').empty();
                $('#tId').append('<p>'+ticket.Id+'</p>');
                $('#tNombre').empty();
                $('#tNombre').append('<p>'+ticket.Nombre+'</p>');
                $('#tPrioridad').empty();
                $('#tPrioridad').append('<p>'+ticket.Prioridad+'</p>');
                $('#tResponsable').empty();
                $('#tResponsable').append('<p>'+ticket.Responsable+'</p>');
                $('#tEstado').empty();
                $('#tEstado').append('<p>'+ticket.Estado+'</p>');
                var date = new Date(ticket.FechaCreacion.match(/\d+/)[0] * 1)
                var dateFormted=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()
                $('#tFecha').empty();
                $('#tFecha').append('<p>'+dateFormted+'</p>');
                $('#tCategoria').empty();
                $('#tCategoria').append('<p>'+ticket.Categoria+'</p>');
                getTicketHistory(ticketId);
            },
            error: function(xhr){
                console.log(xhr)
            }
        });
}
function getTicketHistory(idTicket){
    $('#info').empty();
    let url = 'http://localhost/TicketsService/wsTickes.asmx/getHistorialTicketList';
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify({
            ticketId: idTicket
        }),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function(data){
                var ticketHistory=data.d;
                console.log(ticketHistory);
                pintarHistorial(ticketHistory)
            },
        error: function(xhr){
            console.log(xhr)
        }
    });
}
function pintarHistorial(lista){
    $('#historialTicket').empty();
    lista.forEach(it=>{
        var tipo= it.TipoAccion;
        tipo = tipo.replace(/\s+/g,'');
        var cambios = it.Cambios;
        cambios = cambios.replace(';','<br>');
        if(tipo=="U"){
            var date = new Date(it.FechaAccion.match(/\d+/)[0] * 1)
            var dateFormted=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()
            $('#historialTicket').append(
                `<div class="media">
                <div class="media-left">
                    <i class="fa fa-user-edit fa-lg float-left ml-10"></i>
                </div>
                <div class="media-body">
                    <p class="media-heading"><strong>El ticket se ha modificado</strong></p>
                    <p>${cambios}</p>
                    <small class="color-gris-letra">${dateFormted} por ${it.Usuario}</small>
                </div>
            </div>`);
        }else{
            var date = new Date(it.FechaCreacion.match(/\d+/)[0] * 1)
            var dateFormted=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()
            $('#historialTicket').append(
                `<div class="media">
                <div class="media-left">
                    <i class="fa fa-certificate fa-lg float-left ml-10"></i>
                </div>
                <div class="media-body">
                    <p class="media-heading"><strong>Se crea el ticket.</strong></p>
                    <small class="color-gris-letra">${dateFormted} por ${it.Usuario}</small>
                </div>
            </div>`);
        }
    });
}

