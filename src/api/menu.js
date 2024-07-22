import request from '@/utils/request'
import defaultSettings from '@/config/defaultSettings'

//获取菜单列表
export const getMenuList = (data = {}) => {
	
	// return request({
	// 	url: defaultSettings.apiPrefix + "get-menu/",
	// 	method: "get",
	// 	params: data
	// })
	
	return Promise.resolve({
		"code": 200,
		"successcode": 20007,
		"message": "\u83b7\u5f97\u83dc\u5355\u5217\u8868\u6210\u529f",
		"data": {
			"priority": "17",
			"menu_code": "apptest03",
			"menu_type": "platform",
			"children": [
				{
					"priority": "17.1",
					"menu_code": "RouteView",
					"menu_type": "directory",
					"auth": [
						{
							"button_code": "17.1",
							"id": 771,
							"button_name": "\u67e5\u770b\u9875\u9762"
						}
					],
					"children": [
						{
							"priority": "17.1.1",
							"menu_code": "home",
							"menu_type": "menu",
							"auth": [
								{
									"menu": {
										"menu_name": "\u603b\u89c8",
										"id": 257,
										"menu_code": "home"
									},
									"button_code": "17.1.1",
									"id": 775,
									"button_name": "\u67e5\u770b\u9875\u9762"
								}
							],
							"children": [],
							"menu_name": "\u603b\u89c8",
							"parent_id": 252,
							"menu_address": "/",
							"id": 257
						},
					],
					"menu_name": "\u5e73\u53f0\u6570\u636e\u7edf\u8ba1",
					"parent_id": 251,
					"menu_address": "/datashow",
					"id": 252
				},
				{
					"priority": "17.2",
					"menu_code": "RouteView1",
					"menu_type": "directory",
					"auth": [],
					"children": [
						{
							"priority": "17.2.2",
							"menu_code": "productLineCostView",
							"menu_type": "menu",
							"auth": [
								{
									"menu": {
										"menu_name": "\u4ea7\u54c1\u7ebf\u8d39\u7528\u6982\u89c8",
										"id": 255,
										"menu_code": "productLineCostView"
									},
									"button_code": "17.2.2",
									"id": 773,
									"button_name": "\u67e5\u770b\u9875\u9762"
								}
							],
							"children": [],
							"menu_name": "\u4ea7\u54c1\u7ebf\u8d39\u7528\u6982\u89c8",
							"parent_id": 253,
							"menu_address": "/cost/productLineCostView",
							"id": 255
						},
						{
							"priority": "17.2.3",
							"menu_code": "platformCost",
							"menu_type": "menu",
							"auth": [
								{
									"menu": {
										"menu_name": "\u4ea7\u54c1\u7ebf\u8d39\u7528\u7edf\u8ba1",
										"id": 256,
										"menu_code": "platformCost"
									},
									"button_code": "17.2.3",
									"id": 774,
									"button_name": "\u67e5\u770b\u9875\u9762"
								}
							],
							"children": [],
							"menu_name": "\u4ea7\u54c1\u7ebf\u8d39\u7528\u7edf\u8ba1",
							"parent_id": 253,
							"menu_address": "/cost/platformCost",
							"id": 256
						}
					],
					"menu_name": "\u8d39\u7528\u7edf\u8ba1",
					"parent_id": 251,
					"menu_address": "/cost",
					"id": 253
				}
			],
			"menu_name": "inhandops",
			"parent_id": null,
			"menu_address": "/t/apptest03/",
			"id": 251
		}
	})	


}
