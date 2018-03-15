export const SIDEBAR_MENU_LIST = [
	{
		title: 'menu.home',
		icon: 'fa fa-home',
		link: '/restaurant/home',
		index: 'rest-home'
	},
	{
		title: 'menu.product',
		icon: 'fa fa-cutlery',
		link: '/restaurant/product',
		index: 'rest-product'
	},
	{
		title: 'menu.orderHistory',
		icon: 'fa fa-file-text-o',
		link: '/restaurant/order',
		index: 'rest-order'
	},
	{
		title: 'menu.mySuppliers',
		icon: 'fa fa-truck',
		link: '/restaurant/supplier',
		index: 'rest-supplier'
	},
	{
		title: 'menu.cart',
		icon: 'fa fa-shopping-cart',
		link: '/restaurant/cart',
		index: 'rest-cart'
	},
	{
		title: 'menu.logout',
		icon: 'fa fa-unlock',
		link: '/logout',
		index: 'rest-logout'
	}
]

export const SERVER_URL = 'http://195.154.50.156:8000/api'

export const AUTH_HEADER = {
	'x-api-token': 'cjd22hzu400042ugn0mi0rdel',
    'Content-Type': 'application/x-www-form-urlencoded'
}