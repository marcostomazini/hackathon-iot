## H2Okay	
    Projeto de automação criado para gerar indicadores com relação ao consumo de água, com intuito de conscientização e incentivar o controle residencial de gasto.

## Apresentação
	https://www.youtube.com/watch?v=Zf18tyXMuUg

## Resumo
	Projeto de automação criado para gerar indicadores de nascentes, fundos de vale e gerar indicadores de consumo de água para controle e conscientização da população.
	Através de sensores conseguimos saber em tempo real volume de chuva, umidade do solo ao redor das nascentes, fundos de vale e o nível de água das nascentes, com esses dados é possível prever se o nível de água irá aumentar ou diminuir nos próximos dias.
	Sensores também medem o consumo pela quantidade de água que passa pelos hidrômetros e pela quantidade de água que sai das caixas d’água em tempo real, aplicando um algoritmo desenvolvido pela equipe é possível saber se existem vazamentos, pois, se pelo hidrômetro passa mais água do que sai da caixa, em algum lugar está vazando ou entrando ar. 
	Através disso é possível saber, se a população está gastando mais do que a nascente produz, é possível saber, quanto a população consome, por cidade, por área, por bairro, por família e todos esses dados atualizados em gráficos em tempo real, inclusive o nível de água de cada caixa de água.
	Todos gráficos e indicadores atualizados em tempo real, inclusive o nivel da caixa d'água.

## História
	O Projeto foi desenvolvido no evento HACKATHON 2015 no evento Ticnova Maringá, onde três problemáticas foram colocadas em pauta, onde por times se escolhia uma delas, e em 24 horas de desafio, desenvolvemos o H2Okay.   
    
## Tecnologia utilizada
* Arduino (platform)
* Mqtt (protocol)
* MEAN (MongoDB, ExpressJS, AngularJS, e Node.js)
* Flotchart
    
    
## Instalação

 * Baixar dependencias
 
		npm install

	    
 * Start no projeto local
	
		grunt


 * Gerar um build

		grunt build

 * Gerar um build de producao:

		grunt build:production

 * Rodar os testes

		grunt test 

## Créditos
[Luan Pignata](https://github.com/LuanPignata)	
[Marco Diniz](https://github.com/marcodiniz)	
[Marcos Tomazini](https://github.com/marcostomazini)	
[Ricardo Martins Aleixo](https://github.com/ricardomaleixo)		
 
## License
© 2015 This code is distributed under the MIT license.