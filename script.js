//PREJETO LOCALIZAR LATITUDE E LONGITUDE PELO CEP

$(document).ready(function () {

    $('#d').attr('checked', true);

    var Endereco = {};

    $("#e").click(function () {
        $("#num").prop("disabled", true);
        $("#cep").prop("disabled", true);
    });

    $("#d").click(function () {
        $("#num").prop("disabled", false);
        $("#cep").prop("disabled", false);
    });

    //FUNCAO VERIFICA TIPO DE PESQUISA, SE CEP CONSULTA API VIA CEP E ENVIA VALOR PARA FUNÇAO VALORMAP()
    $('#buscar').click(function () {

        if ($("#num").prop("disabled") == true) {
            localAtual();
        } else {
            var cep = $('#cep').val();
            var num = $('#num').val();

            if (cep && num) {
                $.ajax({
                    url: 'https://viacep.com.br/ws/' + cep + '/json/', success: function (result) {
                        Endereco = {
                            rua: result.logradouro,
                            cidade: result.localidade,
                            up: result.uf,
                            bairro: result.bairro,
                            numero: num
                        }
                        valorMap(Endereco);
                    }
                });
            } else {
                alert("Campos e obrigatorio!");
            }
        };
    });

    //FUNCAO RECUPERA LATITUDE E LONGITUDE PELO ENDEREÇO
    function valorMap(Endereco) {
        var rua = Endereco.rua;
        var bairro = Endereco.bairro;
        var numero = Endereco.numero;
        var cidade = Endereco.cidade;

        $.ajax({
            url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + rua + numero + bairro + cidade + " &key=AIzaSyBrsrcw_2q1CrXP5goZHEX3SWvgP6xYJqw", success: function (result) {
                localAtual(result);
            }
        });
    }
});

//FUNÇÃO RENDERIZA MAP NA TELA
function localAtual(result) {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 17
    });
    var infoWindow = new google.maps.InfoWindow({ map: map });

    //HTML5 geolocation.
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            var latitude = result == undefined ? position.coords.latitude : result.results[0].geometry.location.lat;
            var longitude = result == undefined ? position.coords.longitude : result.results[0].geometry.location.lng;

            var pos = {
                lat: latitude,
                lng: longitude
            };

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(pos.lat, pos.lng),
                title: "Seu Titulo",
                map: map
            });

            //infoWindow.setPosition(pos);
            //infoWindow.setContent('Sua Localização!');

            map.setCenter(pos);

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

//CASO ERRO EXIBE MENSAGEM CENTRO TELA
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: Falha ao carregar mapa.' :
        'Error: Sem suporte ao Maps.');
}
