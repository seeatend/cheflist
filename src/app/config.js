export const SIDEBAR_MENU_LIST = [
	{
		title: 'Home',
		icon: 'fa fa-home',
		link: '/restaurant/home',
		index: 'rest-home'
	},
	{
		title: 'Product',
		icon: 'fa fa-cutlery',
		link: '/restaurant/product',
		index: 'rest-product'
	},
	{
		title: 'Order List',
		icon: 'fa fa-file-text-o',
		link: '/restaurant/order',
		index: 'rest-order'
	},
	{
		title: 'My Suppliers',
		icon: 'fa fa-truck',
		link: '/restaurant/supplier',
		index: 'rest-supplier'
	},
	{
		title: 'Cart',
		icon: 'fa fa-shopping-cart',
		link: '/restaurant/cart',
		index: 'rest-cart'
	},
	{
		title: 'Logout',
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