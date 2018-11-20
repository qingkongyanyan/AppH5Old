<template>
	<div>
		<h1>业务</h1>
		<Tabbar></Tabbar>
	</div>
</template>
<script>
import Tabbar from './tabbar'
	export default{
		name:'business',
		data(){
			return{
				msg:'business'
			}
		},
		components:{
			Tabbar
		}
	}
</script>