export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/home/index',
    'pages/list/index',
    'pages/detail/index',
    'pages/register/index',
    'pages/admin/hotel/list/index',
    'pages/admin/hotel/edit/index',
    'pages/admin/hotel/audit/list/index',
    'pages/admin/hotel/audit/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
