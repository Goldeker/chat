const dateFormat =  function(inputstr, showsplit) {
        inputstr = inputstr + ""; //末尾加一个空格
        var str = inputstr.split(" ");
		var temp = new Date(inputstr)
        var date =  temp.getHours() +  showsplit + temp.getMinutes()
console.log(date)
        return date
}
 
const dateFormatDetail = function(date){
	var temp = new Date(date)
	var transDate =  temp.getFullYear()+ ""  + (temp.getMonth()+1) +"" + temp.getDate()+"" + temp.getHours()+"" + temp.getMinutes()
	return transDate
}

const dateDiffer = function(newDate,oldDate){
	var nd = dateFormatDetail(newDate)
	var od = dateFormatDetail(oldDate)
	console.log(nd)
	console.log(od)
	if(nd - od > 1) {
		return true
	}else {
		return false
	}
}

export  {
	dateFormat,
	dateDiffer
}