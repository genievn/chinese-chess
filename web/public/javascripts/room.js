var allow_load =  '';
var site = '';
var site_num = "";
//房主：红色（0），客人：黑色（1）
var flag = "";
var now_chess = "";
var moved = "";
var eated = "";
var pause_time = 0;
var prompt_pause_time = 0;
var attention = 0;
var guest_win = '';
var host_win = '';
var game_ended = 0;
var t3 = "";
function copy_url(){
	if(window.clipboardData.setData('text',document.location.href))
	alert('复制成功！Ctrl + v 把地址发送给好友');
}
function form_chess(chess){
	now_chess = chess;
	var chess_split = chess.split(",");
	var pla = "<table border=0 cellpadding=0 cellspacing=2 width=542 height=602>";
	if(site == "host")
		for(var i = 0;i < 10;i ++){
			pla += "<tr>";
			for(j = 0;j < 9;j ++){
				pla += "<td><div width=58 height=58 id=chess_"+(i * 9 + j + 1)+"><input type=hidden name=chess_value_"+(i * 9 + j + 1)+" id=chess_value_"+(i * 9 + j + 1)+" value="+chess_split[i * 9 + j]+"><a href=javascript:click_chess("+(i * 9 + j + 1)+")><img alt="+chess_split[i * 9 + j]+","+(i * 9 + j + 1)+" border=0 src=images/"+chess_split[i * 9 + j]+".gif></a></div></td>";
			}
			pla += "</tr>";
		}
	}else{
		for(var i = 9;i >= 0;i --){
			pla += "<tr>";
			for(j = 8;j >= 0;j --)
			{
				pla += "<td><div width=58 height=58 id=chess_"+(i * 9 + j + 1)+"><input type=hidden name=chess_value_"+(i * 9 + j + 1)+" id=chess_value_"+(i * 9 + j + 1)+" value="+chess_split[i * 9 + j]+"><a href=javascript:click_chess("+(i * 9 + j + 1)+")><img alt="+chess_split[i * 9 + j]+","+(i * 9 + j + 1)+" border=0 src=images/"+chess_split[i * 9 + j]+".gif></a></div></td>";
			}
			pla += "</tr>";
		}
		pla += "</table>";
		return pla;
	}
}
var prev_click = "";
var chess_flash = "";
var flash_status = 0;
var guest = "";
var host = "";
var message_guest = "";
var message_host = "";
var prev_message_guest = "";
var prev_message_host = "";
function click_chess(num){
	if(site != flag)
	open_prompt("对方执棋！", 292, 177 + 622);
	else{
	close_prompt();
		for(var i = 1;i < 9 * 10 + 1;i ++)
		document.getElementById("chess_"+i).style.visibility = "visible";
		chess_flash = "";
		if(document.getElementById("chess_value_"+num).value.substr(0, 1) == site_num){
			chess_flash = num;
			prev_click = num;
		}else{
			if(prev_click != "")
			{
				if(!check(document.getElementById('chess_value_'+prev_click).value, prev_click, num))
				open_prompt("操作有误！", 292, 177 + 622);
				else{
					send_request("submit.php?roomid=<?php echo $_GET[id];?>&from="+prev_click+"&to="+num+"&site="+site+"&time="+Math.random());
					allow_load = 1;
					prev_click = "";
				}
			}else
			open_prompt("这不是你的棋子！", 292, 177 + 622);
		}
	}
}

var prompt_count = 0;
function open_prompt(message, top, left){
	prompt_count = 1;
	prompt_pause_time ++;
	if(message){
		document.getElementById("item").style.visibility = "visible";
		document.getElementById("item").style.align = "center";
		document.getElementById("item").style.top = top ;
		document.getElementById("item").style.left = left ;
		document.getElementById("item").innerHTML =  '<table class=message_box onclick=close_prompt()><tr><td><img src=attention.gif border=0></td><td valign=middle>系统提示'+message+'</td></tr></table>';
	}
}
function close_prompt(){
document.getElementById("item").style.visibility = "hidden";
document.getElementById("item").innerHTML =  '';
prompt_pause_time = 0;
}


var http_request = false;
function send_request(url) {
	open_prompt((prompt_pause_time > 0?'等待对方响应（'+prompt_pause_time+'）':''), 292, 177 + 622);
	http_request = false;
	if (window.XMLHttpRequest) { 
		http_request = new XMLHttpRequest();
		if (http_request.overrideMimeType) {
		http_request.overrideMimeType('text/xml');
		}
	} else if (window.ActiveXObject) { 
		try {
		http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
			http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}
	if (!http_request) {
	alert('不能创建 XMLHttpRequest 对象!');
	return false;
	}
	http_request.onreadystatechange = processRequest;
	http_request.open('GET', url, true);
	http_request.send(null);
}


//处理返回信息
function processRequest() {
	if (http_request.readyState == 1) {
	//alert('正在连接');
	//document.getELementById('network_status').innerHTML = '正在连接..';
	}
	if (http_request.readyState == 4) {
		if (http_request.status == 200) {
			//alert(http_request.responseText);
			if(http_request.responseText == "ended")
			document.location.href = "index.php";
			var text = http_request.responseText.split("|");
			if(http_request.responseText){
				t3 = text[3];
				message_guest = text[8];
				message_host = text[9];
				guest_win = text[6];
				host_win = text[7];
				if(text[4] != guest)
				{
					document.getElementById('sound').innerHTML = dd_code('[wmp]sounds/begin.wav[/wmp]');
					if(text[4] == "")
					open_prompt(guest+"退出了！", 292, 177 + 622);
					else
					open_prompt(text[4]+"进来了！", 292, 177 + 622);
					guest = text[4];
				}
				if(text[5] != host)
				{
					document.getElementById('sound').innerHTML = dd_code('[wmp]sounds/begin.wav[/wmp]');
					if(text[5] == "")
					open_prompt(host+"退出了！", 292, 177 + 622);
					else
					open_prompt(text[5]+"进来了！", 292, 177 + 622);
					host = text[5];
				}
			}
			if(now_chess != text[0] && text[0])
			{
				attention = 1;
				document.getElementById("pla").innerHTML = form_chess(text[0]);
				flag = text[1];
				moved = text[2];
				if(site == flag)
				allow_load = 0;
				if(text[3] == "000" && site == "guest" || (text[3] == "100" && site == "host"))
				{
					eated = text[3];
					document.getElementById('sound').innerHTML = dd_code('[wmp]sounds/gameover.wav[/wmp]');
					game_ended = 1;
				}else
				if(text[3] == "000" && site == "host" || (text[3] == "100" && site == "guest"))
				{
					eated = text[3];
					document.getElementById('sound').innerHTML = dd_code('[wmp]sounds/gamewin.wav[/wmp]');
					game_ended = 1;
				}else
				if(text[3] && eated != text[3] && text[3] != 'blank')
				{
					eated = text[3];
					document.getElementById('sound').innerHTML = dd_code('[wmp]sounds/eat.wav[/wmp]');
				}
				else
				document.getElementById('sound').innerHTML = dd_code('[wmp]sounds/go.wav[/wmp]');
			}
		}
	}
}

function output_message(message){
	message = message.replace('(加)','+');
	message = message.replace('(减)','-');
	message = message.replace('(和)','&');
	message = message.replace('(等于)','=');
	message = message.replace('(问号)','?');
	message = message.replace('(c)',"&#39;");
	return dd_code(message);
}
function send_message(){
	var message = document.getElementById('message').value;
	message = message.replace('<','&lt;');
	message = message.replace('>','&gt;');
	message = message.replace('+','(加)');
	message = message.replace('-','(减)');
	message = message.replace('&','(和)');
	message = message.replace('=','(等于)');
	message = message.replace('?','(问号)');
	message = message.replace("'",'(c)');
	if(message != '')
	{
		send_request('send_message.php?roomid=<?php echo $_GET[id];?>&message='+message+'&site='+site+'&random='+Math.random());
		document.getElementById('message').value = '';
		open_prompt('消息发送成功！', 292, 177 + 622);
	}
}

function insert_emot(num){
document.getElementById("message").value += "[em:"+num+"]";
document.getElementById("more").style.visibility = "hidden";
document.getElementById("more").innerHTML =  '';
document.getElementById("message").focus();
}
function quick_message(message){
document.getElementById('message').value += message;
document.getElementById("more").style.visibility = "hidden";
document.getElementById("more").innerHTML =  '';
document.getElementById("message").focus();
}
function more(){
var top = 422;
var left = 177 + 622;
		document.getElementById("more").style.visibility = "visible";
		document.getElementById("more").style.align = "center";
		document.getElementById("more").style.top = top ;
		document.getElementById("more").style.left = left ;
		var emot = "<table cellpadding=0 cellspacing=0 border=0>";
		for(var i = 0;i < 50;i ++)
		{
			if(i % 10 == 0)
			emot += "</tr>";
			emot += "<td><a href=\"javascript:insert_emot("+i+");\"><img src=emot/"+i+".gif border=0></a></td>";
			if(i % 10 == 9)
			emot += "<tr>";
		}
		emot += "</table>";
		var message_arr = new Array('很高兴和你一起玩游戏！','快点啦，我等到花儿都谢了！','你太厉害了，我服了你了！','你输了，哈哈！','下次再玩吧，我要走了！');

		var quick_message = "<table cellpadding=0 cellspacing=0 border=0>";
		for(var i = 0;i < message_arr.length;i ++)
		quick_message += "<tr><td>&middot;<a href=\"javascript:void(0);\" onclick=\"quick_message('"+message_arr[i]+"');\">"+message_arr[i]+"</a></td></tr>";
		quick_message += "</table>";
		document.getElementById("more").innerHTML =  '<table class=message_box><tr><td valign=middle>'+emot+'</td></tr><tr><td>'+quick_message+'</td></tr></table>';
}

var message_sum = 10;
var message_arr = new Array();
function show_message(message){
	if(message_arr.length < message_sum)
	{
		document.getElementById("message_pla").innerHTML += message;
		message_arr[message_arr.length] = message;
	}else{
		for(var i = 1;i < message_sum;i ++){
			message_arr[i - 1] = message_arr[i];
		}
		message_arr[message_sum - 1] = message;
		document.getElementById("message_pla").innerHTML = "";
		for(var i = 0;i < message_sum;i ++)
		{
			document.getElementById("message_pla").innerHTML += message_arr[i];
		}
	}
}
function get_boss_num(){
	if(site == "guest")
	{
		for(var i = 4;i <= 24;i ++)
		{
			if(document.getElementById("chess_value_"+i).value == "000")
			return i;
		}
	}else{
		for(var i = 90 + 1 - 24;i <= 90 + 1 - 4;i ++)
		{
			if(document.getElementById("chess_value_"+i).value == "100")
			return i;
		}
	}
}
function get_info(){
if(guest && output_message(message_guest) && prev_message_guest != output_message(message_guest))
{
	show_message(guest + "£º" + output_message(message_guest)+"<br />");
	prev_message_guest = output_message(message_guest);
}
if(host && output_message(message_host) && prev_message_host != output_message(message_host))
{
	show_message(host + "£º" + output_message(message_host)+"<br />");
	prev_message_host = output_message(message_host);
}
if(attention == 1){
	for(var i = 1;i <= 90;i ++)
	{
		var chess_value = document.getElementById("chess_value_"+i).value;
		if(chess_value == "blank")
		continue;

		if((flag == "guest" && site == "guest" && chess_value.substr(0, 1) == "1" && check(chess_value, i, get_boss_num())) || (flag == "host" && site == "host" && chess_value.substr(0, 1) == "0" && check(chess_value, i, get_boss_num())))
		{
			document.getElementById("sound").innerHTML = dd_code("[wmp]sounds/danger.wav[/wmp]");
			attention = 0;
			break;
		}
	}
}
if(site == "guest")
{
	document.getElementById('top_box').innerHTML = "ºì×Ó£º"+host;
	document.getElementById('bottom_box').innerHTML = "ºÚ×Ó£º"+guest;
	document.getElementById('top_box_tongji').innerHTML = "Ê€ŸÖ£º"+host_win;
	document.getElementById('bottom_box_tongji').innerHTML = "Ê€ŸÖ£º"+guest_win;
	if(flag == "guest")
	{
		document.getElementById('bottom_box_flag').innerHTML = "<img src=images/000.gif>";
		document.getElementById('top_box_flag').innerHTML = "";
	}
	else{
		document.getElementById('top_box_flag').innerHTML = "<img src=images/100.gif>";
		document.getElementById('bottom_box_flag').innerHTML = "";
	}
}
else if(site == "host")
{
	document.getElementById('bottom_box').innerHTML = "ºì×Ó£º"+host;
	document.getElementById('top_box').innerHTML = "ºÚ×Ó£º"+guest;
	document.getElementById('bottom_box_tongji').innerHTML = "Ê€ŸÖ£º"+host_win;
	document.getElementById('top_box_tongji').innerHTML = "Ê€ŸÖ£º"+guest_win;
	if(flag == "host")
	{
		document.getElementById('bottom_box_flag').innerHTML = "<img src=images/100.gif>";
		document.getElementById('top_box_flag').innerHTML = "";
	}
	else{
		document.getElementById('top_box_flag').innerHTML = "<img src=images/000.gif>";
		document.getElementById('bottom_box_flag').innerHTML = "";
	}
}
	if(moved)
	{
		var moved_split = moved.split(",");
		document.getElementById("chess_"+moved_split[0]).className = "moved";
		document.getElementById("chess_"+moved_split[1]).className = "moved";
	}
if(prompt_count > 0)
{
	if(prompt_count == 3)
	{
		prompt_count = 0;
		close_prompt();
	}else
	prompt_count ++;
}

	if(chess_flash != "")
	{
		if(flash_status == 0)
		{
			document.getElementById("chess_"+chess_flash).style.visibility = "hidden";
			flash_status = 1;
		}else{
			document.getElementById("chess_"+chess_flash).style.visibility = "visible";
			flash_status = 0;
		}		
	}
	if(allow_load == 1)
	{
		pause_time = 0;
		send_request('get_info.php?roomid=<?php echo $_GET[id];?>&site='+site+'&random='+Math.random());
		document.getElementById("pla").innerHTML = document.getElementById("pla").innerHTML.replace(/<a(.*?)>/ig, "");
		document.getElementById("pla").innerHTML = document.getElementById("pla").innerHTML.replace(/<\/a>/ig, "");
	}
	if(pause_time == 15 || host == "" || guest == "" || t3 == "000" || t3 == "001")
	{
		pause_time = 0;
		send_request('get_info.php?roomid=<?php echo $_GET[id];?>&site='+site+'&random='+Math.random());
	}
		pause_time ++;
	if(game_ended == 1)
	game_ended ++;
	else if(game_ended == 2)
	{
		if(site == "host")
		{
					if(t3 == "100")
					guest_win ++;
					else
					host_win ++;
					var url = "restart.php?roomid=<?php echo $_GET[id];?>&guest_win="+guest_win+"&host_win="+host_win;
					send_request(url);
		}
		game_ended = 0;
	}
}
send_request('get_info.php?roomid=<?php echo $_GET[id];?>&site='+site+'&random='+Math.random());
get_info();
setInterval("get_info()", 1000);
function init(){
	document.getElementById("main_table").style.display = "";
	document.getElementById("loading").style.display = "none";
}
window.onload = init;
