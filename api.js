const { Client } = require('elasticsearch')
const fs = require('fs'); 
const express = require('express')
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var data = Date();
app.listen(3333, () => console.log(`Iniciado em ${data}.`));
	const inicio = "Iniciado em: "+data+"\n\n";
	fs.writeFile('C:\\xampp\\htdocs\\log\\log.txt', inicio, {flag: 'a+'}, (err) => { 
	if (err) { 
		throw err; 
	}
	//console.log("Arquivo atualizado."); 
	}); 
app.post('/indexador', async function buscar(req, res) {
    const corpopesquisa = req.body.name;
    const corpologin = req.body.login;
	const corposeletor = req.body.seletor;
	var dataAtual = Date();
	const info = "Data: "+dataAtual+"Index: "+req.body.seletor+"\n Termo pesquisado: "+req.body.name+"\n Quem pesquisou: "+req.body.login+"\n\n";
	fs.writeFile('C:\\xampp\\htdocs\\log\\log.txt', info, {flag: 'a+'}, (err) => { 
	if (err) { 
		throw err; 
	}
	//console.log("Arquivo atualizado."); 
	}); 
    console.log("Data: "+dataAtual,"Index: "+req.body.seletor,'\n',"Termo pesquisado: "+req.body.name,'\n', "Quem pesquisou: "+req.body.login, '\n');
    try {
		switch (corposeletor){
			case 'selecao1':
				var data = await client.search({
				index:'index1, antigo1',
				size: '3000',
				defaultOperator: 'AND',
				q:`${corpopesquisa}` }); 
				break;
			case 'selecao2':
				var data = await client.search({
				index:'index2, antigo2',
				size: '3000',
				defaultOperator: 'AND',
				q:`${corpopesquisa}` }); 
				break;
		}  
    return res.json(data.hits.hits);
    } catch (error) {
    console.log(error); 
    return res.json(error);
}
});
app.post('/ocr', async function buscar(req, res) {
    const corpopesquisa = req.body.name;
    const corpologin = req.body.login;
	const corposeletor = req.body.seletor;
	const nomeArquivo = req.body.nomeArquivo;
	const conteudoArquivo = req.body.conteudoArquivo;
	if(nomeArquivo){
	console.log(nomeArquivo);
	}
	if(conteudoArquivo){
	console.log(conteudoArquivo);
	}	
	//var dataAtual = Date();
	if (nomeArquivo ==true && conteudoArquivo !==true){
		try {
        	var data = await client.search({
        	index:`${corposeletor}`,
        	size: '3000',
			body: {
				query: {
					query_string: {
						query: `${corpopesquisa}` ,
						fields: [
				  			'caminho'
						],
			  		}
				}
			} 
    		})   
    		return res.json(data.hits.hits);
    	} catch (error) {
    		console.log(error); 
    		return res.json(error);
		}
	}

	else if (nomeArquivo !==true && conteudoArquivo ==true){
		try {
        	var data = await client.search({
        	index:`${corposeletor}`,
        	size: '3000',
			body: {
				query: {
					query_string: {
						query: `${corpopesquisa}` ,
						fields: [
				  			'conteudo'
						],
			  		}
				}
			}
    		})   
    		return res.json(data.hits.hits);
    	} catch (error) {
    		console.log(error); 
    		return res.json(error);
		}
	}
	else if (nomeArquivo ==true && conteudoArquivo ==true){
		try {
        	var data = await client.search({
        	index:`${corposeletor}`,
        	size: '3000',
			body: {
				query: {
					query_string: {
						query: `${corpopesquisa}` ,
						fields: [
				  			'caminho', 'conteudo'
						],
			  		}
				}
			}
    		})   
    		return res.json(data.hits.hits);
    	} catch (error) {
    		console.log(error); 
    		return res.json(error);
		}
	}
	else if (nomeArquivo !==true && conteudoArquivo !==true){
		try {
        	var data = await client.search({
        	index:`${corposeletor}`,
        	size: '3000',
			body: {
				query: {
					query_string: {
						query: `${corpopesquisa}` ,
						fields: [
				  			'caminho', 'conteudo'
						],
			  		}
				}
			}
    		})   
    		return res.json(data.hits.hits);
    	} catch (error) {
    		console.log(error); 
    		return res.json(error);
		}
	}
});
const client = new Client({
    node: 'localhost:9200',
    requestTimeout: 60000
})