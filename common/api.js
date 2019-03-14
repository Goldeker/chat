import requst from './request.js'

export function check_online(){
	return requst({
		url:'https://grLUK9P7.api.lncld.net/1.2/rtm/clients/check-online',
		method:'post',
		param:{'client_ids':['Tom']}
	})
} 