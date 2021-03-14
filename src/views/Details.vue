 <template>
  <div id="details">
    <!-- 主要内容 -->
    <div class="main">
      <div style="overflow: hidden">
        <!-- 左侧商品轮播图 -->
        <div class="block">
          <el-carousel height="500px" v-if="productPicture.length>1">
            <el-carousel-item v-for="item in productPicture" :key="item">
              <img style="width:500px;" :src="item" :alt="item" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 左侧商品轮播图END -->

        <!-- 右侧内容区 -->
        <div class="content">
          <h1 class="name">{{productDetails.name}}</h1>
          <p class="brief">{{productDetails.brief}}</p>
          <p class="store">商城自营</p>
          <div class="pro-list">
            <span class="pro-name">{{productDetails.name}}</span>
            <el-input-number size="small" v-model="goodsNum"></el-input-number>
            <p class="price-sum">总计 : {{productDetails.retailPrice * goodsNum}}元</p>
          </div>
          <!-- 内容区底部按钮 -->
          <div class="button">
            <el-button class="shop-cart" :disabled="dis" @click="addShoppingCart">加入购物车</el-button>
            <el-button v-if="!collState" class="like" @click="addCollect(productDetails.goodsId)">喜欢</el-button>
            <el-button v-else class="like" @click="addCollect(productDetails.goodsId)">已收藏</el-button>
          </div>
          <el-divider></el-divider>
          <!-- 内容区底部按钮END -->
          <div class="pro-policy">
            <ul>
              <li>
                <i class="el-icon-circle-check"></i> 商城自营
              </li>
              <li>
                <i class="el-icon-circle-check"></i> 商城发货
              </li>
              <li>
                <i class="el-icon-circle-check"></i> 7天无理由退货
              </li>
              <li>
                <i class="el-icon-circle-check"></i> 7天价格保护
              </li>
            </ul>
          </div>
        </div>
        <!-- 右侧内容区END -->
      </div>
      <el-divider></el-divider>
    </div>
    <div class="bottom-content">
      <p>评论</p>
      <div class="comment">
        <div v-if="commentList.length !== 0">
          <div  v-for="item in commentList" :key="item.commentId" class="comment-box">
            <div>
              <el-avatar size="medium" :src="item.user.avatar"></el-avatar>
              <div class="comment-user">
                <div>
                  <span>{{item.user.username}}</span>
                  <el-rate style="display: inline-block;margin-left: 10px;vertical-align: top"
                           disabled
                           v-model="item.star">
                  </el-rate>
                </div>
                <p>{{item.addTime}}</p>
              </div>
            </div>
            <p class="comment-content">sdfsdfsdfsdfsdfsdfsdfsdf</p>
          </div>
        </div>
        <div v-else style="text-align: center;line-height: 60px">暂无评论</div>
      </div>
    </div>
    <!-- 主要内容END -->
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { getByGoodsId } from '@/api/goods'
import { addCart } from '@/api/cart'
import { listComment } from '@/api/comment'
import { addOrUpdateCollection ,getCollectionState} from '@/api/collection'
export default {
  data() {
    return {
      dis: false, // 控制“加入购物车按钮是否可用”
      goodsId: "", // 商品id
      productDetails: "", // 商品详细信息
      productPicture: "",// 商品图片
      goodsNum:1, //商品数量,
      collState:false,//收藏状态
      commentList:[]
    };
  },
  // 通过路由获取商品id
  activated() {
    window.scrollTo(0,0)
    if (this.$route.query.goodsId !== undefined) {
      this.goodsId = this.$route.query.goodsId;
      this.getCollection();
    }
    this.getComments()
  },
  watch: {
    // 监听商品id的变化，请求后端获取商品数据
    goodsId: function(val) {
      this.getDetails(val);
    }
  },
  methods: {
    ...mapActions(["unshiftShoppingCart", "addShoppingCartNum","setShoppingCart"]),
    getCollection(){
      getCollectionState({
        goodsId:this.$route.query.goodsId,
        userId: this.$store.getters.getUser.userId,
      }).then(res =>{
        if(res.data.code === 200){
          this.collState = res.data.data.state
        }
      })
    },
    getComments(){
      listComment({
        current:1,
        size:20,
        goodsSn:this.$route.query.goodsSn
      }).then(res =>{
        if(res.data.code === 200){
          console.log('commentList',res.data.data);
          this.commentList = res.data.data.records
        }
      })

    },
    // 获取商品详细信息
    getDetails(val) {
      getByGoodsId({goodsId:val}).then(res =>{
        if(res.data.code === 200){
          this.productDetails = res.data.data
          this.productPicture = res.data.data.gallery.split(',')
          console.log('res.data.data.gallery.split(\',\')',res.data.data.gallery.split(','))
        }
      })
    },
    // 加入购物车
    addShoppingCart() {
      // 判断是否登录,没有登录则显示登录组件
      if (!this.$store.getters.getUser) {
        this.$store.dispatch("setShowLogin", true);
        return;
      }
      addCart({
          userId: this.$store.getters.getUser.userId,
          goodsSn: this.productDetails.goodsSn,
          goodsNum: this.goodsNum
        })
        .then(res => {
          this.notifySucceed(res.data.msg);
          console.log('addCart',res.data.data)
          this.setShoppingCart(res.data.data.data);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    },
    getCollect(){

    },
    addCollect(id) {
      // 判断是否登录,没有登录则显示登录组件
      if (!this.$store.getters.getUser) {
        this.$store.dispatch("setShowLogin", true);
        return;
      }
      addOrUpdateCollection({
          userId: this.$store.getters.getUser.userId,
          goodsId: id
        }).then(res => {
          if (res.data.code === 200) {
            // 添加收藏成功
            this.notifySucceed(res.data.msg);
            this.collState = !this.collState
          }
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
  }
};
</script>
<style type="scss">

/* 主要内容CSS */
#details .main {
  width: 1225px;
  height: 560px;
  padding-top: 30px;
  margin: 0 auto;
}
#details .main .block {
  float: left;
  width: 560px;
  height: 560px;
}
#details .el-carousel .el-carousel__indicator .el-carousel__button {
  background-color: rgba(163, 163, 163, 0.8);
}
#details .main .content {
  float: left;
  margin-left: 25px;
  width: 640px;
}
#details .main .content .name {
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  font-weight: normal;
  color: #212121;
}
#details .main .content .brief {
  color: #b0b0b0;
  padding-top: 40px;
}
#details .main .content .store {
  color: #ff6700;
  padding-top: 10px;
}
#details .main .content .price {
  display: block;
  font-size: 18px;
  color: #ff6700;
  border-bottom: 1px solid #e0e0e0;
  padding: 25px 0 25px;
}
#details .main .content .price .del {
  font-size: 14px;
  margin-left: 10px;
  color: #b0b0b0;
  text-decoration: line-through;
}
#details .main .content .pro-list {
  background: #f9f9fa;
  padding: 30px 60px;
  margin: 50px 0 50px;
}
.pro-list .el-input-number{
  margin-top: 20px;
}
#details .main .content .pro-list>span {
  line-height: 30px;
  color: #616161;
}
#details .main .content .pro-list .pro-price {
  float: right;
}
#details .main .content .pro-list .pro-price .pro-del {
  margin-left: 10px;
  text-decoration: line-through;
}
#details .main .content .pro-list .price-sum {
  color: #ff6700;
  font-size: 24px;
  padding-top: 20px;
}
#details .main .content .button {
  height: 55px;
  margin: 10px 0 20px 0;
}
#details .main .content .button .el-button {
  float: left;
  height: 55px;
  font-size: 16px;
  color: #fff;
  border: none;
  text-align: center;
}
#details .main .content .button .shop-cart {
  width: 340px;
  background-color: #ff6700;
}
#details .main .content .button .shop-cart:hover {
  background-color: #f25807;
}

#details .main .content .button .like {
  width: 260px;
  margin-left: 40px;
  background-color: #b0b0b0;
}
#details .main .content .button .like:hover {
  background-color: #757575;
}
#details .main .content .pro-policy li {
  float: left;
  margin-right: 20px;
  color: #b0b0b0;
}
/* 主要内容CSS END */
</style>
 <style>
   .bottom-content{
     width: 1225px;
     margin: 0 auto;
   }
   .comment{
     margin-top: 20px;
     min-height: 100px;
     overflow: hidden;
   }
   .comment .comment-box{
     padding-bottom: 10px;
     border-bottom: 1px solid #DCDFE6;
     margin-bottom: 20px;
   }
   .comment .comment-user{
     display: inline-block;
     vertical-align: top;
     margin-left: 10px;
     font-size: 15px;
   }
   .comment .comment-user p:last-child{
     font-size: 12px;
     color: #6a737d;
   }
   .comment-content{
     font-size: 16px;
     margin-top: 10px;
     width: 80%;
   }

 </style>
