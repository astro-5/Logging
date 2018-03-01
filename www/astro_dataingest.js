
function getdata_xchangeloc(app,username,trace)
{
	var socket = io('/astro/xchangeloc?app='+app+'&user='+username);
	var TRACE = trace || false;
	function publishData(room,data)
	{
		console.log("publishing Data .....");
		if (TRACE)
		var publisher_item = 	{
			room_name : room,
			data : data
		}
		console.log ("publisher_data-ingest : "+JSON.stringify(publisher_item));
		socket.emit('location.update',publisher_item);
	}
	function subscribe()
	{
		console.log("subscribe method calling !!! ");
		socket.on('location.subcribe', function (data)
		{
			console.log("location.subcribe : "+data);
			//return data;
		});


	}
	return { publishData : publishData,
		subscribe : subscribe
	}
}
