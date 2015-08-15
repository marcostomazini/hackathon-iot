'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');
/**
 * Module dependencies.
 */
exports.index = function(req, res) {	
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.limitePesquisa = 20;

exports.tratarPesquisa = function(camposPesquisa) {	
	var pesquisa = {};
    if (_.isArray(camposPesquisa)) {
    	_.forEach(camposPesquisa, function(n, key) {
    		if (n.tipo == 'Integer') {
				pesquisa[n.campo] = parseInt(n.valor);
    		} else if (_.isBoolean(n.valor)) {
    			pesquisa[n.campo] = n.valor;
    		} else {
    			var regex = new RegExp(n.valor, "i")	
    			pesquisa[n.campo] = regex;
    		}
		});		    	
	} else if (_.isObject(camposPesquisa)) {
		if (n.tipo == 'Integer') {
			pesquisa[camposPesquisa.campo] = parseInt(camposPesquisa.valor);
		} else if (_.isBoolean(n.valor)) {
			pesquisa[n.campo] = n.valor;
		} else {
			var regex = new RegExp(camposPesquisa.valor, "i")	
			pesquisa[camposPesquisa.campo] = regex;
		} 
	}

	return pesquisa;
};

exports.language = function(req, res) {	
	res.json(
		{
		    "sEmptyTable": "Nenhum registro encontrado",
		    "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
		    "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
		    "sInfoFiltered": "(Filtrados de _MAX_ registros)",
		    "sInfoPostFix": "",
		    "sInfoThousands": ".",
		    "sLengthMenu": "_MENU_ resultados por página",
		    "sLoadingRecords": "Carregando...",
		    "sProcessing": "Processando...",
		    "sZeroRecords": "Nenhum registro encontrado",
		    "sSearch": "Pesquisar: ",
		    "oPaginate": {
		        "sNext": ">>",
		        "sPrevious": "<<",
		        "sFirst": "Primeiro",
		        "sLast": "Último"
		    },
		    "oAria": {
		        "sSortAscending": ": Ordenar colunas de forma ascendente",
		        "sSortDescending": ": Ordenar colunas de forma descendente"
		    }
		}
	);
};