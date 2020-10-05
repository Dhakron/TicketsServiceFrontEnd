var usuarioId;
var sTitulo;
var sPrioridad;
var sEstado;
var sResponsable;
var sCategoria;
var sElementosPorPagina;
var sPaginaActual;
var sOrdenamiento;
var sAscendenteDescendente;
var sElementosTotales;
var sPaginasTotales;

var url="http://localhost/TicketsService/wsTickes.asmx/"
$(document).ready(function(){
    cargarDatos();
    cargarBE();
});

$(document).ready(function(){
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    usuarioId=urlParams.get('usuarioId');
    document.getElementById("editarTicket").addEventListener('click',function(e){
        navigateTicket(ticketId);
    });
});

function cargarDatos(){
    cargarEstados();
    cargarResponsables();
    cargarPrioridades();
    cargarCategorias();
}

function cargarBE(){
    sTitulo=$('#tNombre').val();
    if(sTitulo==null)sTitulo=""
    sPrioridad=$('#tPrioridad :selected').val();
    sEstado=$('#tEstado :selected').val();
    sCategoria=$('#tCategoria :selected').val();
    sElementosPorPagina=$('#elementosPorPagina :selected').val();
    sResponsable=$('#tResponsable :selected').val();
    sPaginaActual=1
    sOrdenamiento=$('#ordenamiento :selected').val();
    sAscendenteDescendente=$('#ascendenteDescendente :selected').val();
    getBE();
}

function pintarTickets(lista){
    $('#ticketsContainer').empty();
    lista.forEach(it=>{
        var date = new Date(it.FechaCreacion.match(/\d+/)[0] * 1)
        var dateFormted=date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear()
        $('#ticketsContainer').append(
        `<div class="col-xs-12 h-75" style="display: flex; align-items: center; margin-bottom: 2px;">
            <div class="h-100perCent w-25 float-left p" style="background-color: teal;">
                <i class="fa fa-thumbtack fa-sm" style="color: white; margin: 7.5px;"></i>
            </div>
            <div class="float-left p-10 h-100perCen">
                <p><strong>${it.Nombre}</strong> en estado <strong>${it.Estado}</strong></p>
                <p>
                    <i class="fa fa-user fa-sm"></i>
                    <strong>Responsable: </strong>${it.Responsable}&nbsp;
                    <i class="fa fa-cog fa-sm"></i>
                    <strong>Categoria: </strong>${it.Categoria}&nbsp;
                    <i class="fa fa-eye fa-sm"></i>
                    <strong>Prioridad: </strong>${it.Prioridad}&nbsp;
                    <i class="fa fa-calendar-alt fa-sm"></i>
                    <strong>Fecha de creaci&oacute;n:</strong>${dateFormted}
                </p>
            </div>
            <div class="float-right" style="margin-right: 10px; margin-left: auto;">
                <i class="fa fa-info-circle fa-2x" onclick="navigateVisualizacion(${it.Id})"></i>
            </div>
            <div class="cb"></div>
        </div>`);
    });
}

function getBE(){
    var url="http://localhost/TicketsService/wsTickes.asmx/getBandejaEntrada"
    $.ajax({
        url: url,
        type: 'POST',
        data:JSON.stringify({
            titulo: sTitulo,
            prioridadId:sPrioridad,
            estadoId:sEstado,
            responsableId:sResponsable,
            categoriaId:sCategoria,
            elementosPorPagina:sElementosPorPagina,
            paginaActual:sPaginaActual,
            ordenamiento:sOrdenamiento,
            ascendenteDescendente:sAscendenteDescendente
        }),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function(data){
           pintarTickets(data.d.listaTickets);
           pintarPaginacion(data.d.paginacion);
        },
        error: function(xhr){
            console.log("Error cargando estados")
        }
    });
}

function pintarPaginacion(paginacion){
    $("#paginacion").empty();
    for(var i=1;i<=paginacion.paginasTotales;i++){
        var selected="disable"
        if(i==paginacion.paginaActual)selected="active"
        $("#paginacion").append(
            `<li class="${selected}" onclick="navigatePage(${i})"><a>${i}</a></li>`
        );
    }
}

function navigateTicket(id){
    window.location.assign("./ticket.html?id="+id+"&usuarioId="+usuarioId);
}
function navigateVisualizacion(id){
    window.location.assign("./visualizacion.html?id="+id+"&usuarioId="+usuarioId);
}

function navigatePage(page){
    sPaginaActual=page;
    console.log(page);
    console.log(sPaginaActual);
    getBE();
}

function limpiarFiltro(){
    document.getElementById('tNombre').value=""
    cargarDatos();
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
            $('#tEstado').append('<option value="'+0+'">Seleccionar...</option>')
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
            $('#tResponsable').empty();
            $('#tResponsable').append('<option value="'+0+'">Seleccionar...</option>')
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
            $('#tCategoria').empty();
            $('#tCategoria').append('<option value="'+0+'">Seleccionar...</option>')
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
            $('#tPrioridad').empty();
            $('#tPrioridad').append('<option value="'+0+'">Seleccionar...</option>')
            data.d.forEach(it => {
                $('#tPrioridad').append('<option value="'+it.Id+'">'+it.Nombre+'</option>')
            });
        },
        error: function(xhr){
            console.log("Error cargando prioridades")
        }
    });
}