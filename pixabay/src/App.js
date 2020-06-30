import React, {useState, useEffect} from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';

function App() {

	const [busqueda, guardarBusqueda] = useState('');
	const [imagenes, guardarImagenes] = useState([]);
	const [paginaactual, guardarPaginaActual] = useState(1);
	const [totalpaginas, guardarTotalPaginas] = useState(1);


	useEffect(() => {
		//para que no busque un strin vacio
		if(busqueda === '') return;
		const consultarAPI = async () => {

			const imagenerPorPagina=30;
			const key='17280110-afb8a1a289787963028945485';
			const url=`https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenerPorPagina}
				&page=${paginaactual}`;

			const respuesta = await fetch(url);
			const resultado = await respuesta.json();

			guardarImagenes(resultado.hits);

			//calcular total de paginas
			const calcularTotalPaginas = Math.ceil(resultado.totalHits/imagenerPorPagina);
			guardarTotalPaginas(calcularTotalPaginas);

			const jumbotron = document.querySelector('.jumbotron');
			jumbotron.scrollIntoView({ behavior: 'smooth'})

		}	
		consultarAPI();

	}, [busqueda, paginaactual])//pasamos pagina actual como dependencia

	//definir pagina anterior
	const paginaAnterior = () => {
		const nuevaPaginaActual = paginaactual - 1;

		if(nuevaPaginaActual === 0) return;
		guardarPaginaActual(nuevaPaginaActual);
	}

	const paginaSiguiente = () => {
		const nuevaPaginaActual = paginaactual + 1;

		if(nuevaPaginaActual > totalpaginas) return;

		guardarPaginaActual(nuevaPaginaActual);
	}

    return (
    	<div className="container">
    		<div className="jumbotron">
    			<p className="lead text-center">Buscador de Imágenes</p>

    			<Formulario 
					guardarBusqueda={guardarBusqueda}
    			/>
    		</div>
    		<div className="row justify-content-center">
				<ListadoImagenes
					imagenes={imagenes}
				/>

				{(paginaactual === 1) ? null : (
					<button
						type="button"
						className="btn btn-info mr-1"
						onClick={paginaAnterior}
					>&laquo; Anterior</button>
				)}
				{(paginaactual === totalpaginas) ? null : (
					<button
						type="button"
						className="btn btn-info"
						onClick={paginaSiguiente}
					>Siguiente &raquo;</button>
				)}
    		</div>
    	</div>
    );
}

export default App;