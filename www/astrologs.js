function getlogger(app, username, trace){

	var socket = io(' /astro/logs?app='+app+'&user='+username);
	//var socket = io();
	var TRACE = trace || false;
	function error(errorcode, message1,data)
	{
		if (TRACE)
		console.log (errorcode + message1 + data);
		var item = 	{ errorCode : errorcode,
			errorMessage : message1,
			data : data
		}
		socket.emit('log.error',item);

	}
	function warning(errorcode, message1,data)
	{
		if (TRACE)
		console.log (errorcode + message1 + data);
		var item = { errorCode : errorcode,
			message : message1,
			data : data
		}
		socket.emit('log.warning',item);
	}

	function info(errorcode, message1,data)
	{
		if (TRACE)
		console.log (errorcode + message1 + data);
		var item = { errorCode : errorcode,
			message : message1,
			data : data
		}
		socket.emit('log.info',item);
	}
	function debug(errorcode, message1,data)
	{
		if (TRACE)
		console.log (errorcode + message1 + data);
		var item = { errorCode : errorcode,
			message : message1,
			data : data
		}
		socket.emit('log.debug',item);
	}

	function ingest(errorcode, message1,data)
	{
		if (TRACE)
		console.log (errorcode + message1 + data);
		var item = { errorCode : errorcode,
			message : message1,
			data : data
		}
		socket.emit('log.ingest',item);
	}
	return {
		error : error,
		warning : warning,
		info : info,
		ingest : ingest,
		debug : debug
	}
}
