import requestZabbix from '@/utils/requestZabbix'

//获取Zabbix监控资源
export const getZabbixResource = (data={}) => {
	return requestZabbix({
		url: "/api_jsonrpc.php",
		method: "post",
		data,
	})
}
