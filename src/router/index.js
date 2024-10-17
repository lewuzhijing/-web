
import VueRouter from 'vue-router';

const routes =[
    {
        path:'/',
        name:'login',
        component:()=>import('../components/Login')

    },

    {


        path:'/Index',
        name:'index',
        component:()=>import('../components/Index'),
        children :[
            {
            path:'/Home',
            name:'home',
            meta:{
                title:'首页'
            },
            component:()=>import('../components/Home.vue')


            },
            // {
            //     path: '/Admin',
            //     name:'admin',
            //     meta:{
            //         title:'管理员管理'
            //     },
            //     component:()=>import('../components/admin/AdminManage.vue')
            //
            // },
            // {
            //     path:'/User',
            //     name:'user',
            //     meta:{
            //         title:'用户管理'
            //     },
            //     component:()=>import('../components/user/UserManage.vue')
            //
            // },
            // {
            //     path:'/Storage',
            //     name:'storage',
            //     meta:{
            //         title:'仓库管理'
            //     },
            //     component:()=>import('../components/storage/StorageManage.vue')
            //
            // },
            // {
            //     path:'/Goodstype',
            //     name:'goodstype',
            //     meta:{
            //         title:'物品管理'
            //     },
            //     component:()=>import('../components/goodstype/GoodstypeManage.vue')
            //
            // }

        ]
    }
]

const  router =new VueRouter({
    mode:'history',
    routes
})

export function resetRouter() {
    router.matcher = new VueRouter({
        mode:'history',
        routes: []
    }).matcher
}

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
export default router;


// let childRoute={
//     // {
//     path: '/'+menu.menuclick,
//     name:menu.menuclick,
//     meta:{
//         title:'管理员管理'
//     },
//     component:()=>import('../components/'+menu.menucomponent)
//
// },
