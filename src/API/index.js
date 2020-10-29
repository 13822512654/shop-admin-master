const baseURL = '/api'
export default {
  USERLOGIN: baseURL + '/userlogin',

  MENULIST: baseURL + '/menulist',//菜单列表
  MENUADD: baseURL + '/menuadd',//菜单添加
  MENUINFO: baseURL + '/menuinfo',//菜单获取（一条）
  MENUEDIT: baseURL + '/menuedit',//菜单编辑
  MENUDELETE: baseURL + '/menudelete',//菜单删除

  //分类列表
  CATEADD: baseURL + '/cateadd',
  CATELIST: baseURL + '/catelist',
  CATEINFO: baseURL + '/cateinfo',
  CATEDELETE: baseURL + '/catedelete',
  CATEEDIT: baseURL + '/cateedit',

  //角色管理
  ROLEADD: baseURL + '/roleadd',
  ROLELIST: baseURL + '/rolelist',
  ROLEINFO: baseURL + '/roleinfo',
  ROLEDELETE: baseURL + '/roledelete',
  ROLEEDIT: baseURL + '/roleedit',

  //管理员管理
  USERADD: baseURL + '/useradd',
  USERLIST: baseURL + '/userlist',
  USERINFO: baseURL + '/userinfo',
  USERDELETE: baseURL + '/userdelete',
  USEREDIT: baseURL + '/useredit',
  USERLOGIN: baseURL + '/userlogin',//管理员登陆
  USERCOUNT: baseURL + '/usercount',//管理员总数（用于计算分页）


  //商品规格管理
  SPECSADD: baseURL + '/specsadd',
  SPECSCOUNT: baseURL + '/specscount',//用于计算分页
  SPECSLIST: baseURL + '/specslist',//分页，要传参
  SPECSINFO: baseURL + '/specsinfo',
  SPECSDELETE: baseURL + '/specsdelete',
  SPECSEDIT: baseURL + '/specsedit',


  //轮播图管理
  BANNERADD: baseURL + '/banneradd',
  BANNERLIST: baseURL + '/bannerlist',
  BANNERINFO: baseURL + '/bannerinfo',
  BANNERDELETE: baseURL + '/bannerdelete',
  BANNEREDIT: baseURL + '/banneredit',

  //商品管理
  GOODSADD: baseURL + '/goodsadd',
  GOODSLIST: baseURL + '/goodslist',
  GOODSCOUNT: baseURL + '/goodscount',//分页，要传参
  GOODSINFO: baseURL + '/goodsinfo',
  GOODSDELETE: baseURL + '/goodsdelete',
  GOODSEDIT: baseURL + '/goodsedit',

  //会员管理
  MEMBERLIST: baseURL + '/memberlist',
  MEMBERINFO: baseURL + '/memberinfo',
  MEMBEREDIT: baseURL + '/memberedit',

  //秒杀管理
  SECKADD: baseURL + '/seckadd',
  SECKLIST: baseURL + '/secklist',
  SECKINFO: baseURL + '/seckinfo',
  SECKDELETE: baseURL + '/seckdelete',
  SECKEDIT: baseURL + '/seckedit',
}