<template>
    <Layout style="height: 100%" class="main">
        <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider"
            :style="{overflow: 'hidden'}">
            <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage"
                :menu-list="menuList">
                <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
                <div class="logo-con">
                    <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
                    <img v-show="collapsed" :src="minLogo" key="min-logo" />
                </div>
            </side-menu>
        </Sider>
        <Layout>
            <Header class="header-con">
                <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
                    <user :user-avator="userAvator" :login-name="loginName" />
                    <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local" />
                    <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
                    <organization style="margin-right: 10px;" />
                </header-bar>
            </Header>
            <Content class="main-content-con">
                <Layout class="main-layout-con">
                    <div class="tag-nav-wrapper">
                        <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" />
                    </div>
                    <Content class="content-wrapper">
                        <keep-alive :include="cacheList">
                            <router-view />
                        </keep-alive>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    </Layout>
</template>
<script>
    import SideMenu from './components/side-menu'
    import HeaderBar from './components/header-bar'
    import TagsNav from './components/tags-nav'
    import User from './components/user'
    import routers from '@/router/routers'
    import Fullscreen from './components/fullscreen'
    import Organization from './components/organization'
    import Language from './components/language'
    import {
        mapMutations,
        mapActions
    } from 'vuex'
    import {
        getNewTagList,
        getNextRoute,
        routeEqual
    } from '@/libs/util'
    import {
        on,
        off
    } from '@/libs/tools'
    import minLogo from '@/assets/images/ncdgLogo.png'
    import maxLogo from '@/assets/images/ncdgLogo.png'
    import './main.less'
    export default {
        name: 'Main',
        components: {
            SideMenu,
            HeaderBar,
            Language,
            TagsNav,
            Fullscreen,
            Organization,
            User
        },
        data() {
            return {
                collapsed: false,
                minLogo,
                maxLogo,
                isFullscreen: false
            }
        },
        computed: {
            tagNavList() {
                return this.$store.state.app.tagNavList
            },
            tagRouter() {
                return this.$store.state.app.tagRouter
            },
            userAvator() {
                return this.$store.state.user.avatorImgPath
            },
            loginName() {
                return this.$store.state.user.userNameOrEmailAddress
            },
            cacheList() {
                return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(
                    item => item.name) : []
            },
            menuList() {
                return this.$store.getters.menuList
            },
            local() {
                return this.$store.state.app.local
            }
        },
        methods: {
            ...mapMutations([
                'setBreadCrumb',
                'setTagNavList',
                'addTag',
                'setLocal',
                'setHomeRoute',
                'setCollapsed'
            ]),
            ...mapActions([
                'handleLogin',
                'getOrganizationInfo'
            ]),
            turnToPage(route) {
                let {
                    name,
                    params,
                    query
                } = {}
                if (typeof route === 'string') name = route
                else {
                    name = route.name
                    params = route.params
                    query = route.query
                }
                if (name.indexOf('isTurnByHref_') > -1) {
                    window.open(name.split('_')[1])
                    return
                }
                this.$router.push({
                    name,
                    params,
                    query
                })
            },
            handleCollapsedChange(state) {
                this.collapsed = state
                this.setCollapsed(state)
            },
            handleCloseTag(res, type, route) {
                if (type === 'all') {
                    this.turnToPage('home')
                } else if (routeEqual(this.$route, route)) {
                    if (type === 'others') {} else {
                        const nextRoute = getNextRoute(this.tagNavList, route)
                        this.$router.push(nextRoute)
                    }
                }
                this.setTagNavList(res)
            },
            handleClick(item) {
                this.turnToPage(item)
            },
            resize() {
                if(document.body.scrollWidth < 800){
                    this.collapsed = true
                }
            },
        },
        watch: {
            '$route'(newRoute) {
                const {
                    name,
                    query,
                    params,
                    meta
                } = newRoute
                this.addTag({
                    route: {
                        name,
                        query,
                        params,
                        meta
                    },
                    type: 'push'
                })
                this.setBreadCrumb(newRoute)
                this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
                this.$refs.sideMenu.updateOpenName(newRoute.name)
            }
        },
        mounted() {
            /**
             * @description 初始化设置面包屑导航和标签导航
             */
            this.setTagNavList()
            this.getOrganizationInfo()
            this.setHomeRoute(routers)
            this.addTag({
                route: this.$store.state.app.homeRoute
            })
            this.setBreadCrumb(this.$route)
            // 设置初始语言
            this.setLocal(this.$i18n.locale)
            on(window, 'resize', this.resize)
            
            // 文档提示
            // this.$Notice.info({
            //   title: '想快速上手，去看文档吧',
            //   duration: 0,
            //   render: (h) => {
            //     return h('p', {
            //       style: {
            //         fontSize: '13px'
            //       }
            //     }, [
            //       '点击',
            //       h('a', {
            //         attrs: {
            //           href: 'https://lison16.github.io/iview-admin-doc/#/',
            //           target: '_blank'
            //         }
            //       }, 'iview-admin2.0文档'),
            //       '快速查看'
            //     ])
            //   }
            // })
        },
        beforeDestroy() {
            off(window, 'resize', this.resize)
        }
    }

</script>
